using Microsoft.EntityFrameworkCore;
using MyBotApi.Data;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Repositories;
using NUnit.Framework;
using System.Text.RegularExpressions;
using Testcontainers.PostgreSql;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace MyBotApi.Tests;

[TestFixture]
public class UserRepoTests
{
    private ApplicationDbContext _context;
    private UserRepository _repository;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(TestContext.CurrentContext.Test.Name)
            .Options;

        _context = new ApplicationDbContext(options);
        _repository = new UserRepository(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    private MyBotApi.Data.Models.Models.User MakeUser(
        string? email = null,
        string role = "user",
        string? nhostId = null) => new MyBotApi.Data.Models.Models.User
        {
            Id = Guid.NewGuid(),
            Email = email ?? $"{Guid.NewGuid()}@test.com",
            DisplayName = "Test User",
            Role = role,
            EmailVerified = true,
            NhostUserId = nhostId,
            CreatedAt = DateTime.UtcNow
        };

    [Test]
    public async Task CreateAsync_ValidUser_ReturnsSavedUser()
    {
        var user = MakeUser("alice@test.com");

        var result = await _repository.CreateAsync(user);

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(user.Id));
        Assert.That(result.Email, Is.EqualTo("alice@test.com"));
    }

    [Test]
    public async Task CreateAsync_ValidUser_PersistsToDatabase()
    {
        var user = MakeUser();
        await _repository.CreateAsync(user);

        Assert.That(await _context.Users.FindAsync(user.Id), Is.Not.Null);
    }

    [Test]
    public async Task GetByIdAsync_ExistingId_ReturnsUserWithRefreshTokens()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        _context.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = "tok1",
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
        await _context.SaveChangesAsync();

        var result = await _repository.GetByIdAsync(user.Id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.RefreshTokens.Count, Is.EqualTo(1));
    }

    [Test]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        var result = await _repository.GetByIdAsync(Guid.NewGuid());

        Assert.That(result, Is.Null);
    }


    [Test]
    public async Task GetByEmailAsync_ExistingEmail_ReturnsUser()
    {
        var user = MakeUser("bob@test.com");
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByEmailAsync("bob@test.com");

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Email, Is.EqualTo("bob@test.com"));
    }

    [Test]
    public async Task GetByEmailAsync_NonExistingEmail_ReturnsNull()
    {
        var result = await _repository.GetByEmailAsync("nobody@test.com");

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetByEmailAsync_IncludesRefreshTokens()
    {
        var user = MakeUser("carol@test.com");
        _context.Users.Add(user);
        _context.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = "tok2",
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
        await _context.SaveChangesAsync();

        var result = await _repository.GetByEmailAsync("carol@test.com");

        Assert.That(result!.RefreshTokens.Count, Is.EqualTo(1));
    }

    [Test]
    public async Task GetByNhostIdAsync_ExistingNhostId_ReturnsUser()
    {
        var user = MakeUser(nhostId: "nhost-abc-123");
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByNhostIdAsync("nhost-abc-123");

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.NhostUserId, Is.EqualTo("nhost-abc-123"));
    }

    [Test]
    public async Task GetByNhostIdAsync_NonExistingNhostId_ReturnsNull()
    {
        var result = await _repository.GetByNhostIdAsync("does-not-exist");

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetAllAsync_NoUsers_ReturnsEmptyCollection()
    {
        var result = await _repository.GetAllAsync();

        Assert.That(result, Is.Empty);
    }

    [Test]
    public async Task GetAllAsync_MultipleUsers_ReturnsAll()
    {
        _context.Users.AddRange(MakeUser(), MakeUser(), MakeUser());
        await _context.SaveChangesAsync();

        var result = await _repository.GetAllAsync();

        Assert.That(result.Count(), Is.EqualTo(3));
    }

    [Test]
    public async Task GetAllAsync_ReturnsUsersOrderedByCreatedAt()
    {
        var oldest = MakeUser();
        oldest.CreatedAt = DateTime.UtcNow.AddDays(-2);

        var middle = MakeUser();
        middle.CreatedAt = DateTime.UtcNow.AddDays(-1);

        var newest = MakeUser();
        newest.CreatedAt = DateTime.UtcNow;

        _context.Users.AddRange(newest, oldest, middle);
        await _context.SaveChangesAsync();

        var result = (await _repository.GetAllAsync()).ToList();

        Assert.That(result[0].Id, Is.EqualTo(oldest.Id));
        Assert.That(result[1].Id, Is.EqualTo(middle.Id));
        Assert.That(result[2].Id, Is.EqualTo(newest.Id));
    }

    [Test]
    public async Task GetByRoleAsync_MatchingRole_ReturnsOnlyThatRole()
    {
        _context.Users.AddRange(
            MakeUser(role: "admin"),
            MakeUser(role: "admin"),
            MakeUser(role: "user"));
        await _context.SaveChangesAsync();

        var result = (await _repository.GetByRoleAsync("admin")).ToList();

        Assert.That(result.Count, Is.EqualTo(2));
        Assert.That(result.All(u => u.Role == "admin"), Is.True);
    }

    [Test]
    public async Task GetByRoleAsync_NoMatchingRole_ReturnsEmpty()
    {
        _context.Users.Add(MakeUser(role: "user"));
        await _context.SaveChangesAsync();

        var result = await _repository.GetByRoleAsync("superadmin");

        Assert.That(result, Is.Empty);
    }

    [Test]
    public async Task UpdateAsync_ChangesDisplayName_PersistsChange()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        user.DisplayName = "Renamed";
        await _repository.UpdateAsync(user);

        Assert.That((await _context.Users.FindAsync(user.Id))!.DisplayName, Is.EqualTo("Renamed"));
    }

    [Test]
    public async Task UpdateAsync_SetsUpdatedAt()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        Assert.That(user.UpdatedAt, Is.Null);

        await _repository.UpdateAsync(user);

        Assert.That(user.UpdatedAt, Is.Not.Null);
        Assert.That(
            user.UpdatedAt!.Value,
            Is.EqualTo(DateTime.UtcNow).Within(TimeSpan.FromSeconds(5)));
    }

    [Test]
    public async Task DeleteAsync_ExistingId_ReturnsTrueAndRemovesUser()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = await _repository.DeleteAsync(user.Id);

        Assert.That(result, Is.True);
        Assert.That(await _context.Users.FindAsync(user.Id), Is.Null);
    }

    [Test]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        var result = await _repository.DeleteAsync(Guid.NewGuid());

        Assert.That(result, Is.False);
    }


    [Test]
    public async Task ExistsAsync_ExistingEmail_ReturnsTrue()
    {
        _context.Users.Add(MakeUser("exists@test.com"));
        await _context.SaveChangesAsync();

        var result = await _repository.ExistsAsync("exists@test.com");

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task ExistsAsync_NonExistingEmail_ReturnsFalse()
    {
        var result = await _repository.ExistsAsync("ghost@test.com");

        Assert.That(result, Is.False);
    }
}


