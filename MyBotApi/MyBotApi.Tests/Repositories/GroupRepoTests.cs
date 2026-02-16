using Microsoft.EntityFrameworkCore;
using MyBotApi.Data;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Repositories;
using NUnit.Framework;

namespace MyBotApi.Tests;

[TestFixture]
public class GroupRepoTests
{
    private ApplicationDbContext _context;
    private GroupRepository _repository;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(TestContext.CurrentContext.Test.Name)
            .Options;

        _context = new ApplicationDbContext(options);
        _repository = new GroupRepository(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    private User MakeUser() => new User
    {
        Id = Guid.NewGuid(),
        Email = $"{Guid.NewGuid()}@test.com",
        Role = "admin",
        CreatedAt = DateTime.UtcNow
    };

    private Group MakeGroup(Guid userId, string name = "Alpha") => new Group
    {
        Id = Guid.NewGuid(),
        Name = name,
        Description = "Test group",
        StartAsHour = "08:00",
        EndAsHour = "10:00",
        CreatedAt = DateTimeOffset.UtcNow,
        UserId = userId,
        IsDeleted = false
    };

    [Test]
    public async Task CreateAsync_ValidGroup_ReturnsSavedGroup()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = await _repository.CreateAsync(MakeGroup(user.Id));

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Name, Is.EqualTo("Alpha"));
    }

    [Test]
    public async Task CreateAsync_ValidGroup_PersistsToDatabase()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var group = MakeGroup(user.Id);
        await _repository.CreateAsync(group);

        Assert.That(await _context.Groups.FindAsync(group.Id), Is.Not.Null);
    }

    [Test]
    public async Task GetByIdAsync_ExistingId_ReturnsGroup()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        var group = MakeGroup(user.Id);
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByIdAsync(group.Id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Id, Is.EqualTo(group.Id));
    }

    [Test]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        var result = await _repository.GetByIdAsync(Guid.NewGuid());

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetByNameAsync_ExistingName_ReturnsGroup()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        _context.Groups.Add(MakeGroup(user.Id, "Beta"));
        await _context.SaveChangesAsync();

        var result = await _repository.GetByNameAsync("Beta");

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Name, Is.EqualTo("Beta"));
    }

    [Test]
    public async Task GetByNameAsync_NonExistingName_ReturnsNull()
    {
        var result = await _repository.GetByNameAsync("DoesNotExist");

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetAllAsync_NoGroups_ReturnsEmptyCollection()
    {
        var result = await _repository.GetAllAsync();

        Assert.That(result, Is.Empty);
    }

    [Test]
    public async Task GetAllAsync_MultipleGroups_ReturnsAll()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        _context.Groups.AddRange(
            MakeGroup(user.Id, "G1"),
            MakeGroup(user.Id, "G2"),
            MakeGroup(user.Id, "G3"));
        await _context.SaveChangesAsync();

        var result = await _repository.GetAllAsync();

        Assert.That(result.Count(), Is.EqualTo(3));
    }

    [Test]
    public async Task UpdateAsync_ChangeName_PersistsChange()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        var group = MakeGroup(user.Id);
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        group.Name = "UpdatedName";
        var result = await _repository.UpdateAsync(group);

        Assert.That(result.Name, Is.EqualTo("UpdatedName"));
        Assert.That((await _context.Groups.FindAsync(group.Id))!.Name, Is.EqualTo("UpdatedName"));
    }

    [Test]
    public async Task DeleteAsync_ExistingId_ReturnsTrueAndRemovesGroup()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        var group = MakeGroup(user.Id);
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        var result = await _repository.DeleteAsync(group.Id);

        Assert.That(result, Is.True);
        Assert.That(await _context.Groups.FindAsync(group.Id), Is.Null);
    }

    [Test]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        var result = await _repository.DeleteAsync(Guid.NewGuid());

        Assert.That(result, Is.False);
    }

    [Test]
    public async Task SoftDeleteAsync_ExistingId_ReturnsTrue()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        var group = MakeGroup(user.Id);
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        var result = await _repository.SoftDeleteAsync(group.Id);

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task SoftDeleteAsync_ExistingId_SetsIsDeletedTrue()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        var group = MakeGroup(user.Id);
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        await _repository.SoftDeleteAsync(group.Id);

        // EF change tracker reflects the update immediately in InMemory
        var fromDb = await _context.Groups.FindAsync(group.Id);
        Assert.That(fromDb!.IsDeleted, Is.True);
    }

    [Test]
    public async Task SoftDeleteAsync_DoesNotPhysicallyRemoveGroup()
    {
        var user = MakeUser();
        _context.Users.Add(user);
        var group = MakeGroup(user.Id);
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        await _repository.SoftDeleteAsync(group.Id);

        Assert.That(await _context.Groups.FindAsync(group.Id), Is.Not.Null);
    }

    [Test]
    public async Task SoftDeleteAsync_NonExistingId_ReturnsFalse()
    {
        var result = await _repository.SoftDeleteAsync(Guid.NewGuid());

        Assert.That(result, Is.False);
    }
}
