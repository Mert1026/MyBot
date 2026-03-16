using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;
using MyBotApi.Services.AuthServices;
using NUnit.Framework;
using System.Net;
using System.Text;
using System.Text.Json;

namespace MyBotApi.Tests;

[TestFixture]
public class AuthServiceTests
{
    private Mock<IUserRepository> _userRepoMock;
    private Mock<ILogger<NhostAuthService>> _loggerMock;
    private Mock<IConfiguration> _configMock;

    // ── Fake HTTP handler ──────────────────────────────────────────────────
    private class FakeHttpMessageHandler : HttpMessageHandler
    {
        public Func<HttpRequestMessage, HttpResponseMessage> ResponseFactory { get; set; }
            = _ => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{}", Encoding.UTF8, "application/json")
            };

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
            => Task.FromResult(ResponseFactory(request));
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private FakeHttpMessageHandler _fakeHandler;

    /// <summary>
    /// Builds the service under test, injecting a real HttpClient that uses
    /// FakeHttpMessageHandler instead of the network.
    /// 
    /// NhostAuthService constructs its own HttpClient internally, so we use
    /// a small subclass that accepts an injected HttpClient for testability.
    /// If you want to avoid the subclass, consider refactoring NhostAuthService
    /// to accept IHttpClientFactory in production code instead.
    /// </summary>
    private NhostAuthService BuildService()
    {
        _fakeHandler = new FakeHttpMessageHandler();
        var httpClient = new HttpClient(_fakeHandler);

        _configMock = new Mock<IConfiguration>();
        _configMock.Setup(c => c["NHost:AuthUrl"]).Returns("https://fake.nhost.test/v1");

        return new NhostAuthService(
            _configMock.Object,
            _userRepoMock.Object,
            _loggerMock.Object,
            httpClient);
    }

    private static string MakeNhostSessionJson(
        string accessToken = "acc",
        string refreshToken = "ref",
        string email = "a@t.com")
    {
        var payload = new
        {
            session = new
            {
                accessToken,
                refreshToken,
                user = new
                {
                    id = Guid.NewGuid().ToString(),
                    email,
                    displayName = "Alice",
                    emailVerified = true,
                    metadata = new { role = "admin" }
                }
            }
        };
        return JsonSerializer.Serialize(payload);
    }

    private static HttpResponseMessage OkJson(string json) =>
        new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

    private static HttpResponseMessage ErrorJson(string error, HttpStatusCode code = HttpStatusCode.BadRequest) =>
        new HttpResponseMessage(code)
        {
            Content = new StringContent(error, Encoding.UTF8, "application/json")
        };

    [SetUp]
    public void SetUp()
    {
        _userRepoMock = new Mock<IUserRepository>();
        _loggerMock = new Mock<ILogger<NhostAuthService>>();
    }

    [Test]
    public async Task SignUpAsync_NewUser_CallsNhostAndCreatesUserInDb()
    {
        var svc = BuildService();
        _userRepoMock.Setup(r => r.ExistsAsync("a@t.com")).ReturnsAsync(false);
        _userRepoMock.Setup(r => r.CreateAsync(It.IsAny<User>()))
                     .ReturnsAsync((User u) => u);
        _fakeHandler.ResponseFactory = _ => OkJson(MakeNhostSessionJson());

        var request = new SignUpRequest
        {
            Email = "a@t.com",
            Password = "pass",
            DisplayName = "Alice"
        };

        var result = await svc.SignUpAsync(request);

        Assert.That(result, Is.Not.Null);
        Assert.That(result.AccessToken, Is.EqualTo("acc"));
        _userRepoMock.Verify(r => r.CreateAsync(It.IsAny<User>()), Times.Once);
    }

    [Test]
    public async Task SignUpAsync_ReturnsCorrectUserDto()
    {
        var svc = BuildService();
        _userRepoMock.Setup(r => r.ExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
        _userRepoMock.Setup(r => r.CreateAsync(It.IsAny<User>())).ReturnsAsync((User u) => u);
        _fakeHandler.ResponseFactory = _ => OkJson(MakeNhostSessionJson(email: "b@t.com"));

        var result = await svc.SignUpAsync(new SignUpRequest
        {
            Email = "b@t.com",
            Password = "p",
            DisplayName = "Bob"
        });

        Assert.That(result.User.Email, Is.EqualTo("b@t.com"));
        Assert.That(result.User.Role, Is.EqualTo("teacher"));
    }

    [Test]
    public void SignUpAsync_UserAlreadyExists_ThrowsException()
    {
        var svc = BuildService();
        _userRepoMock.Setup(r => r.ExistsAsync("a@t.com")).ReturnsAsync(true);

        var ex = Assert.ThrowsAsync<Exception>(() =>
            svc.SignUpAsync(new SignUpRequest
            {
                Email = "a@t.com",
                Password = "p",
                DisplayName = "A"
            }));

        Assert.That(ex!.Message, Does.Contain("already exists"));
    }

    [Test]
    public void SignUpAsync_NhostReturnsError_ThrowsException()
    {
        var svc = BuildService();
        _userRepoMock.Setup(r => r.ExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
        _fakeHandler.ResponseFactory = _ => ErrorJson("email already taken");

        Assert.ThrowsAsync<Exception>(() =>
            svc.SignUpAsync(new SignUpRequest
            {
                Email = "a@t.com",
                Password = "p",
                DisplayName = "A"
            }));
    }

    [Test]
    public void SignUpAsync_NhostReturnsError_DoesNotCreateUserInDb()
    {
        var svc = BuildService();
        _userRepoMock.Setup(r => r.ExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
        _fakeHandler.ResponseFactory = _ => ErrorJson("bad request");

        Assert.ThrowsAsync<Exception>(() =>
            svc.SignUpAsync(new SignUpRequest
            {
                Email = "a@t.com",
                Password = "p",
                DisplayName = "A"
            }));

        _userRepoMock.Verify(r => r.CreateAsync(It.IsAny<User>()), Times.Never);
    }

    [Test]
    public async Task SignInAsync_ExistingUser_UpdatesAndReturnsAuthResponse()
    {
        var svc = BuildService();
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "a@t.com",
            Role = "admin",
            ImageLink = "http://example.com/image.png",
            EmailVerified = false
        };
        _userRepoMock.Setup(r => r.GetByEmailAsync("a@t.com")).ReturnsAsync(existingUser);
        _userRepoMock.Setup(r => r.UpdateAsync(It.IsAny<User>())).ReturnsAsync(existingUser);
        _fakeHandler.ResponseFactory = _ => OkJson(MakeNhostSessionJson());

        var result = await svc.SignInAsync(new SignInRequest { Email = "a@t.com", Password = "pass" });

        Assert.That(result, Is.Not.Null);
        Assert.That(result.AccessToken, Is.EqualTo("acc"));
        _userRepoMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Once);
    }

    [Test]
    public async Task SignInAsync_NewUser_CreatesUserInDb()
    {
        var svc = BuildService();
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);
        _userRepoMock.Setup(r => r.CreateAsync(It.IsAny<User>())).ReturnsAsync((User u) => u);
        _fakeHandler.ResponseFactory = _ => OkJson(MakeNhostSessionJson(email: "new@t.com"));

        var result = await svc.SignInAsync(new SignInRequest { Email = "new@t.com", Password = "pass" });

        Assert.That(result, Is.Not.Null);
        _userRepoMock.Verify(r => r.CreateAsync(It.IsAny<User>()), Times.Once);
    }

    [Test]
    public async Task SignInAsync_ExistingUser_DoesNotCreateNewUserInDb()
    {
        var svc = BuildService();
        var existing = new User { Id = Guid.NewGuid(), Email = "a@t.com", Role = "admin" };
        _userRepoMock.Setup(r => r.GetByEmailAsync("a@t.com")).ReturnsAsync(existing);
        _userRepoMock.Setup(r => r.UpdateAsync(It.IsAny<User>())).ReturnsAsync(existing);
        _fakeHandler.ResponseFactory = _ => OkJson(MakeNhostSessionJson());

        await svc.SignInAsync(new SignInRequest { Email = "a@t.com", Password = "pass" });

        _userRepoMock.Verify(r => r.CreateAsync(It.IsAny<User>()), Times.Never);
    }

    [Test]
    public void SignInAsync_NhostReturnsError_ThrowsException()
    {
        var svc = BuildService();
        _fakeHandler.ResponseFactory = _ => ErrorJson("invalid credentials", HttpStatusCode.Unauthorized);

        Assert.ThrowsAsync<Exception>(() =>
            svc.SignInAsync(new SignInRequest { Email = "a@t.com", Password = "wrong" }));
    }

    [Test]
    public async Task VerifyTokenAsync_NonEmptyToken_ReturnsTrue()
    {
        var svc = BuildService();

        var result = await svc.VerifyTokenAsync("some-valid-token");

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task VerifyTokenAsync_EmptyToken_ReturnsFalse()
    {
        var svc = BuildService();

        var result = await svc.VerifyTokenAsync(string.Empty);

        Assert.That(result, Is.False);
    }

    [Test]
    public async Task VerifyTokenAsync_NullToken_ReturnsFalse()
    {
        var svc = BuildService();

        var result = await svc.VerifyTokenAsync(null!);

        Assert.That(result, Is.False);
    }
}
