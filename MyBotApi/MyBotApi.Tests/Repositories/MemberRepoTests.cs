using Microsoft.EntityFrameworkCore;
using MyBotApi.Data;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Repositories;
using NUnit.Framework;

namespace MyBotApi.Tests;

[TestFixture]
public class MemberRepoTests
{
    private ApplicationDbContext _context;
    private MemberRepository _repository;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(TestContext.CurrentContext.Test.Name)
            .Options;

        _context = new ApplicationDbContext(options);
        _repository = new MemberRepository(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    private async Task<Group> SeedGroupAsync()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = $"{Guid.NewGuid()}@test.com",
            Role = "admin",
            ImageLink = "http://example.com/image.png",
            CreatedAt = DateTime.UtcNow
        };
        var group = new Group
        {
            Id = Guid.NewGuid(),
            Name = "TestGroup",
            Description = "description", // required
            StartAsHour = "09:00",
            EndAsHour = "11:00",
            CreatedAt = DateTimeOffset.UtcNow,
            UserId = user.Id,
            Location = "Test Location", // required
            MaxMembers = 20, // required
            MinAge = 5, // required
            MaxAge = 15 // required
        };
        _context.Users.Add(user);
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();
        return group;
    }

    private Member MakeMember(Guid groupId, string firstName = "Alice", string lastName = "Smith") => new Member
    {
        Id = Guid.NewGuid(),
        FirstName = firstName,
        LastName = lastName,
        Description = "Test member",
        JoinTime = DateTimeOffset.UtcNow,
        BornDate = DateTimeOffset.UtcNow.AddYears(-10),
        Status = true,
        GroupId = groupId,
        IsDeleted = false,
        Age = 10 // required
    };

    [Test]
    public async Task CreateAsync_ValidMember_ReturnsSavedMember()
    {
        var group = await SeedGroupAsync();

        var result = await _repository.CreateAsync(MakeMember(group.Id));

        Assert.That(result, Is.Not.Null);
        Assert.That(result.FirstName, Is.EqualTo("Alice"));
    }

    [Test]
    public async Task CreateAsync_ValidMember_PersistsToDatabase()
    {
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);

        await _repository.CreateAsync(member);

        Assert.That(await _context.Members.FindAsync(member.Id), Is.Not.Null);
    }

    [Test]
    public async Task GetByIdAsync_ExistingId_ReturnsMember()
    {
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);
        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByIdAsync(member.Id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Id, Is.EqualTo(member.Id));
    }

    [Test]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        var result = await _repository.GetByIdAsync(Guid.NewGuid());

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetAllAsync_NoMembers_ReturnsEmptyCollection()
    {
        var result = await _repository.GetAllAsync();

        Assert.That(result, Is.Empty);
    }

    [Test]
    public async Task GetAllAsync_MultipleMembers_ReturnsAll()
    {
        var group = await SeedGroupAsync();
        _context.Members.AddRange(
            MakeMember(group.Id, "Alice"),
            MakeMember(group.Id, "Bob"),
            MakeMember(group.Id, "Carol"));
        await _context.SaveChangesAsync();

        var result = await _repository.GetAllAsync();

        Assert.That(result.Count(), Is.EqualTo(3));
    }

    [Test]
    public async Task UpdateAsync_ChangeName_PersistsChange()
    {
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);
        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        member.FirstName = "AliceUpdated";
        var result = await _repository.UpdateAsync(member);

        Assert.That(result.FirstName, Is.EqualTo("AliceUpdated"));
        Assert.That((await _context.Members.FindAsync(member.Id))!.FirstName, Is.EqualTo("AliceUpdated"));
    }

    [Test]
    public async Task DeleteAsync_ExistingId_ReturnsTrueAndRemovesMember()
    {
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);
        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        var result = await _repository.DeleteAsync(member.Id);

        Assert.That(result, Is.True);
        Assert.That(await _context.Members.FindAsync(member.Id), Is.Null);
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
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);
        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        var result = await _repository.SoftDeleteAsync(member.Id);

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task SoftDeleteAsync_ExistingId_SetsIsDeletedTrue()
    {
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);
        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        await _repository.SoftDeleteAsync(member.Id);

        var fromDb = await _context.Members.FindAsync(member.Id);
        Assert.That(fromDb!.IsDeleted, Is.True);
    }

    [Test]
    public async Task SoftDeleteAsync_DoesNotPhysicallyRemoveMember()
    {
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);
        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        await _repository.SoftDeleteAsync(member.Id);

        Assert.That(await _context.Members.FindAsync(member.Id), Is.Not.Null);
    }

    [Test]
    public async Task SoftDeleteAsync_NonExistingId_ReturnsFalse()
    {
        var result = await _repository.SoftDeleteAsync(Guid.NewGuid());

        Assert.That(result, Is.False);
    }

    [Test]
    public async Task ChangeStatusAsync_ExistingId_UpdatesStatusToFalse()
    {
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);
        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        var result = await _repository.ChangeStatusAsync(member.Id, false);

        Assert.That(result, Is.True);
        Assert.That((await _context.Members.FindAsync(member.Id))!.Status, Is.False);
    }

    [Test]
    public async Task ChangeStatusAsync_ExistingId_UpdatesStatusToTrue()
    {
        var group = await SeedGroupAsync();
        var member = MakeMember(group.Id);
        member.Status = false;
        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        var result = await _repository.ChangeStatusAsync(member.Id, true);

        Assert.That(result, Is.True);
        Assert.That((await _context.Members.FindAsync(member.Id))!.Status, Is.True);
    }

    [Test]
    public async Task ChangeStatusAsync_NonExistingId_ReturnsFalse()
    {
        var result = await _repository.ChangeStatusAsync(Guid.NewGuid(), false);

        Assert.That(result, Is.False);
    }
}
