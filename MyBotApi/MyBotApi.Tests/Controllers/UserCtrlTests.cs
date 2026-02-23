using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MyBotApi.Controllers;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;
using MyBotApi.Services.AuthServices.IAuthservices;
using NUnit.Framework;
using System.Security.Claims;

namespace MyBotApi.Tests;

[TestFixture]
public class UserCtrlTests
{
    private Mock<INhostAuthService> _authServiceMock;
    private Mock<IUserRepository> _userRepoMock;
    private Mock<ILogger<UsersController>> _loggerMock;
    private UsersController _controller;

    // ── Setup ──────────────────────────────────────────────────────────────

    [SetUp]
    public void SetUp()
    {
        _authServiceMock = new Mock<INhostAuthService>();
        _userRepoMock = new Mock<IUserRepository>();
        _loggerMock = new Mock<ILogger<UsersController>>();

        _controller = new UsersController(
            _authServiceMock.Object,
            _userRepoMock.Object,
            _loggerMock.Object);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    /// <summary>Injects a ClaimsPrincipal so controller can read User.Claims.</summary>
    private void SetControllerUser(string email, string role = "admin")
    {
        var claims = new[]
        {
                new Claim("email", email),
                new Claim("role", role)
            };
        var identity = new ClaimsIdentity(claims, "Test");
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(identity)
            }
        };
    }

    private static User MakeUser(string email = "alice@test.com", string role = "admin") => new User
    {
        Id = Guid.NewGuid(),
        Email = email,
        DisplayName = "Alice",
        Role = role,
        EmailVerified = true
    };

    private static AuthResponse MakeAuthResponse() => new AuthResponse
    {
        AccessToken = "access-token",
        RefreshToken = "refresh-token",
        User = new UserDto { Id = Guid.NewGuid().ToString(), Email = "alice@test.com", Role = "admin" }
    };

    private static T GetData<T>(ActionResult<ApiResponse<T>> result)
    {
        var ok = (OkObjectResult)result.Result!;
        return ((ApiResponse<T>)ok.Value!).Data!;
    }

    private static ApiResponse<T> GetBody<T>(ActionResult<ApiResponse<T>> result)
    {
        var ok = (OkObjectResult)result.Result!;
        return (ApiResponse<T>)ok.Value!;
    }

    // ── SignUp ─────────────────────────────────────────────────────────────

    [Test]
    public async Task SignUp_ValidAdminRequest_ReturnsOk()
    {
        var request = new SignUpRequest { Email = "a@t.com", Password = "pass", DisplayName = "A"};
        _authServiceMock.Setup(s => s.SignUpAsync(request)).ReturnsAsync(MakeAuthResponse());

        var result = await _controller.SignUp(request);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetBody<AuthResponse>(result).Success, Is.True);
    }

    [Test]
    public async Task SignUp_ValidTeacherRequest_ReturnsOk()
    {
        var request = new SignUpRequest { Email = "t@t.com", Password = "pass", DisplayName = "T"};
        _authServiceMock.Setup(s => s.SignUpAsync(request)).ReturnsAsync(MakeAuthResponse());

        var result = await _controller.SignUp(request);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task SignUp_InvalidRole_ReturnsBadRequest()
    {
        var request = new SignUpRequest { Email = "a@t.com", Password = "pass", DisplayName = "A"};

        var result = await _controller.SignUp(request);

        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
    }

    [Test]
    public async Task SignUp_InvalidRole_SuccessIsFalse()
    {
        var request = new SignUpRequest {Email = "a@t.com", Password = "p", DisplayName = "A" };

        var result = await _controller.SignUp(request);

        var bad = (BadRequestObjectResult)result.Result!;
        Assert.That(((ApiResponse<AuthResponse>)bad.Value!).Success, Is.False);
    }

    [Test]
    public async Task SignUp_WhenServiceThrows_ReturnsBadRequest()
    {
        var request = new SignUpRequest { Email = "a@t.com", Password = "p", DisplayName = "A"};
        _authServiceMock.Setup(s => s.SignUpAsync(request)).ThrowsAsync(new Exception("Nhost down"));

        var result = await _controller.SignUp(request);

        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
    }

    // ── SignIn ─────────────────────────────────────────────────────────────

    [Test]
    public async Task SignIn_ValidCredentials_ReturnsOkWithAuthResponse()
    {
        var request = new SignInRequest { Email = "a@t.com", Password = "pass" };
        _authServiceMock.Setup(s => s.SignInAsync(request)).ReturnsAsync(MakeAuthResponse());

        var result = await _controller.SignIn(request);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetBody<AuthResponse>(result).Success, Is.True);
    }

    [Test]
    public async Task SignIn_WhenServiceThrows_ReturnsUnauthorized()
    {
        var request = new SignInRequest { Email = "a@t.com", Password = "wrong" };
        _authServiceMock.Setup(s => s.SignInAsync(request)).ThrowsAsync(new Exception("Bad credentials"));

        var result = await _controller.SignIn(request);

        Assert.That(result.Result, Is.InstanceOf<UnauthorizedObjectResult>());
    }

    [Test]
    public async Task SignIn_WhenServiceThrows_SuccessIsFalse()
    {
        var request = new SignInRequest { Email = "a@t.com", Password = "wrong" };
        _authServiceMock.Setup(s => s.SignInAsync(request)).ThrowsAsync(new Exception("Bad credentials"));

        var result = await _controller.SignIn(request);

        var unauth = (UnauthorizedObjectResult)result.Result!;
        Assert.That(((ApiResponse<AuthResponse>)unauth.Value!).Success, Is.False);
    }

    // ── GetProfile ─────────────────────────────────────────────────────────

    [Test]
    public async Task GetProfile_AuthenticatedUser_ReturnsOkWithUserDto()
    {
        var user = MakeUser("alice@test.com");
        SetControllerUser("alice@test.com");
        _userRepoMock.Setup(r => r.GetByEmailAsync("alice@test.com")).ReturnsAsync(user);

        var result = await _controller.GetProfile();

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<UserDto>(result).Email, Is.EqualTo("alice@test.com"));
    }

    [Test]
    public async Task GetProfile_NoEmailClaim_ReturnsUnauthorized()
    {
        // Set user with no email claim
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity())
            }
        };

        var result = await _controller.GetProfile();

        Assert.That(result.Result, Is.InstanceOf<UnauthorizedObjectResult>());
    }

    [Test]
    public async Task GetProfile_UserNotInDatabase_ReturnsNotFound()
    {
        SetControllerUser("ghost@test.com");
        _userRepoMock.Setup(r => r.GetByEmailAsync("ghost@test.com")).ReturnsAsync((User?)null);

        var result = await _controller.GetProfile();

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task GetProfile_WhenRepositoryThrows_Returns500()
    {
        SetControllerUser("alice@test.com");
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ThrowsAsync(new Exception());

        var result = await _controller.GetProfile();

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    [Test]
    public async Task GetAllUsers_ReturnsOkWithMappedDtos()
    {
        var users = new List<User> { MakeUser("a@t.com"), MakeUser("b@t.com") };
        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(users);

        var result = await _controller.GetAllUsers();

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<IEnumerable<UserDto>>(result).Count(), Is.EqualTo(2));
    }

    [Test]
    public async Task GetAllUsers_WhenRepositoryThrows_Returns500()
    {
        _userRepoMock.Setup(r => r.GetAllAsync()).ThrowsAsync(new Exception());

        var result = await _controller.GetAllUsers();

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── GetUsersByRole ─────────────────────────────────────────────────────

    [Test]
    public async Task GetUsersByRole_ValidRole_ReturnsOkWithUsers()
    {
        var users = new List<User> { MakeUser(role: "admin"), MakeUser(role: "admin") };
        _userRepoMock.Setup(r => r.GetByRoleAsync("admin")).ReturnsAsync(users);

        var result = await _controller.GetUsersByRole("admin");

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<IEnumerable<UserDto>>(result).Count(), Is.EqualTo(2));
    }

    [Test]
    public async Task GetUsersByRole_InvalidRole_ReturnsBadRequest()
    {
        var result = await _controller.GetUsersByRole("hacker");

        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
    }

    [Test]
    public async Task GetUsersByRole_TeacherRole_ReturnsOk()
    {
        _userRepoMock.Setup(r => r.GetByRoleAsync("teacher")).ReturnsAsync(new List<User>());

        var result = await _controller.GetUsersByRole("teacher");

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task GetUsersByRole_WhenRepositoryThrows_Returns500()
    {
        _userRepoMock.Setup(r => r.GetByRoleAsync(It.IsAny<string>())).ThrowsAsync(new Exception());

        var result = await _controller.GetUsersByRole("admin");

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── DeleteUser ─────────────────────────────────────────────────────────

    [Test]
    public async Task DeleteUser_ExistingId_ReturnsOk()
    {
        var id = Guid.NewGuid();
        _userRepoMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(true);

        var result = await _controller.DeleteUser(id);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetBody<object>(result).Success, Is.True);
    }

    [Test]
    public async Task DeleteUser_NonExistingId_ReturnsNotFound()
    {
        _userRepoMock.Setup(r => r.DeleteAsync(It.IsAny<Guid>())).ReturnsAsync(false);

        var result = await _controller.DeleteUser(Guid.NewGuid());

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task DeleteUser_WhenRepositoryThrows_Returns500()
    {
        _userRepoMock.Setup(r => r.DeleteAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

        var result = await _controller.DeleteUser(Guid.NewGuid());

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── GetPublicInfo ──────────────────────────────────────────────────────

    //[Test]
    //public void GetPublicInfo_ReturnsOkWithSuccessTrue()
    //{
    //    var result = _controller.GetPublicInfo();

    //    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    //    var ok = (OkObjectResult)result.Result!;
    //    Assert.That(((ApiResponse<object>)ok.Value!).Success, Is.True);
    //}
}
