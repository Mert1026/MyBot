using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MyBotApi.Controllers;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs.MemberDTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;
using NUnit.Framework;

namespace MyBotApi.Tests;

[TestFixture]
public class MemberCtrlTests
{
    private Mock<IMemberRepository> _memberRepoMock;
    private Mock<IGroupRepository> _groupRepoMock;
    private Mock<IParentRepository> _parentRepoMock;
    private Mock<ILogger<UsersController>> _loggerMock;
    private MembersController _controller;

    // ── Setup ──────────────────────────────────────────────────────────────

    [SetUp]
    public void SetUp()
    {
        _memberRepoMock = new Mock<IMemberRepository>();
        _groupRepoMock = new Mock<IGroupRepository>();
        _parentRepoMock = new Mock<IParentRepository>();
        _loggerMock = new Mock<ILogger<UsersController>>();

        _controller = new MembersController(
            _memberRepoMock.Object,
            _groupRepoMock.Object,
            _parentRepoMock.Object,
            _loggerMock.Object);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private static Member MakeMember(string firstName = "Alice", string lastName = "Smith") => new Member
    {
        Id = Guid.NewGuid(),
        FirstName = firstName,
        LastName = lastName,
        Description = "desc",
        JoinTime = DateTimeOffset.UtcNow,
        BornDate = DateTimeOffset.UtcNow.AddYears(-10),
        Status = true,
        GroupId = Guid.NewGuid(),
        ParentId = Guid.NewGuid(),
        Age = 10 // required
    };

    private static MemberDto MakeMemberDto(Guid? groupId = null) => new MemberDto
    {
        FirstName = "Alice",
        LastName = "Smith",
        Description = "desc",
        BornDate = DateTimeOffset.UtcNow.AddYears(-10).ToString("O"),
        JoinTime = DateTimeOffset.UtcNow.ToString("O"),
        GroupId = (groupId ?? Guid.NewGuid()).ToString(),
        ParentId = Guid.NewGuid().ToString(),
        ApplicationFormId = Guid.NewGuid().ToString()
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

    // ── GetAllMembersAsync ─────────────────────────────────────────────────

    [Test]
    public async Task GetAllMembersAsync_ReturnsOkWithAllMembers()
    {
        var members = new List<Member> { MakeMember("Alice"), MakeMember("Bob") };
        _memberRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(members);

        var result = await _controller.GetAllMembersAsync();

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<IEnumerable<Member>>(result).Count(), Is.EqualTo(2));
    }

    [Test]
    public async Task GetAllMembersAsync_ReturnsSuccessTrue()
    {
        _memberRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Member>());

        var result = await _controller.GetAllMembersAsync();

        Assert.That(GetBody<IEnumerable<Member>>(result).Success, Is.True);
    }

    [Test]
    public async Task GetAllMembersAsync_WhenRepositoryThrows_Returns500()
    {
        _memberRepoMock.Setup(r => r.GetAllAsync()).ThrowsAsync(new Exception("DB error"));

        var result = await _controller.GetAllMembersAsync();

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── GetMemberByIdAsync ─────────────────────────────────────────────────

    [Test]
    public async Task GetMemberByIdAsync_ExistingId_ReturnsOkWithMember()
    {
        var member = MakeMember();
        _memberRepoMock.Setup(r => r.GetByIdAsync(member.Id)).ReturnsAsync(member);

        var result = await _controller.GetMemberByIdAsync(member.Id);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<Member>(result).Id, Is.EqualTo(member.Id));
    }

    [Test]
    public async Task GetMemberByIdAsync_NonExistingId_ReturnsNotFound()
    {
        _memberRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Member?)null);

        var result = await _controller.GetMemberByIdAsync(Guid.NewGuid());

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task GetMemberByIdAsync_WhenRepositoryThrows_Returns500()
    {
        _memberRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

        var result = await _controller.GetMemberByIdAsync(Guid.NewGuid());

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── CreateMemberAsync ──────────────────────────────────────────────────

    [Test]
    public async Task CreateMemberAsync_ValidDto_ReturnsOkWithMember()
    {
        var dto = MakeMemberDto();
        _groupRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
                      .ReturnsAsync(new Group { Id = Guid.NewGuid(), Name = "Test group" });
        _memberRepoMock.Setup(r => r.CreateAsync(It.IsAny<Member>()))
                       .ReturnsAsync((Member m) => m);

        var result = await _controller.CreateMemberAsync(dto);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetBody<Member>(result).Success, Is.True);
    }

    [Test]
    public async Task CreateMemberAsync_ValidDto_MemberHasCorrectName()
    {
        var dto = MakeMemberDto();
        dto.FirstName = "Bob";
        _memberRepoMock.Setup(r => r.CreateAsync(It.IsAny<Member>()))
                       .ReturnsAsync((Member m) => m);
        _groupRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Group());

        var result = await _controller.CreateMemberAsync(dto);

        Assert.That(GetData<Member>(result).FirstName, Is.EqualTo("Bob"));
    }

    [Test]
    public async Task CreateMemberAsync_WhenRepositoryThrows_Returns500()
    {
        _memberRepoMock.Setup(r => r.CreateAsync(It.IsAny<Member>())).ThrowsAsync(new Exception("fail"));
        _groupRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Group());

        var result = await _controller.CreateMemberAsync(MakeMemberDto());

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── UpdateMemberAsync ──────────────────────────────────────────────────

    [Test]
    public async Task UpdateMemberAsync_ValidRequest_ReturnsOkWithUpdatedMember()
    {
        var groupId = Guid.NewGuid();
        var member = MakeMember();
        var dto = new MemberUpdateDto { 
            MemberId = member.Id.ToString(),
            FirstName = "Updated", 
            LastName = "Name",
            Description = "d", 
            GroupId = groupId.ToString(),
            BornDate = DateTimeOffset.UtcNow.ToString("O"),
            JoinTime = DateTimeOffset.UtcNow.ToString("O"),
            ParentId = Guid.NewGuid().ToString(),
            ApplicationFormId = Guid.NewGuid().ToString()
        };

        _memberRepoMock.Setup(r => r.GetByIdAsync(member.Id)).ReturnsAsync(member);
        _groupRepoMock.Setup(r => r.GetByIdAsync(groupId)).ReturnsAsync(new Group { Id = groupId, Name = "G" });
        _parentRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(new Parent { Id = Guid.NewGuid() });
        _memberRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Member>())).ReturnsAsync((Member m) => m);

        var result = await _controller.UpdateMemberAsync(dto);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetBody<Member>(result).Success, Is.True);
    }

    [Test]
    public async Task UpdateMemberAsync_InvalidMemberId_ReturnsNotFound()
    {
        var dto = new MemberUpdateDto { 
            MemberId = "not-a-guid",
            BornDate = DateTimeOffset.UtcNow.ToString("O"),
            JoinTime = DateTimeOffset.UtcNow.ToString("O"),
            GroupId = Guid.NewGuid().ToString(),
            ParentId = Guid.NewGuid().ToString()
        };

        var result = await _controller.UpdateMemberAsync(dto);

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task UpdateMemberAsync_InvalidGroupId_ReturnsNotFound()
    {
        var dto = new MemberUpdateDto { 
            MemberId = Guid.NewGuid().ToString(),
            FirstName = "X", 
            LastName = "Y",
            Description = "d", 
            GroupId = "not-a-guid",
            BornDate = DateTimeOffset.UtcNow.ToString("O"),
            JoinTime = DateTimeOffset.UtcNow.ToString("O"),
            ParentId = Guid.NewGuid().ToString(),
            ApplicationFormId = Guid.NewGuid().ToString()
        };

        var result = await _controller.UpdateMemberAsync(dto);

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task UpdateMemberAsync_MemberNotFound_ReturnsNotFound()
    {
        _memberRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Member?)null);

        var result = await _controller.UpdateMemberAsync(new MemberUpdateDto { 
            MemberId = Guid.NewGuid().ToString(),
            GroupId = Guid.NewGuid().ToString(),
            ParentId = Guid.NewGuid().ToString(),
            BornDate = DateTimeOffset.UtcNow.ToString("O"),
            JoinTime = DateTimeOffset.UtcNow.ToString("O")
        });

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task UpdateMemberAsync_GroupNotFound_ReturnsNotFound()
    {
        var member = MakeMember();
        var dto = new MemberUpdateDto { 
            MemberId = member.Id.ToString(),
            GroupId = Guid.NewGuid().ToString(),
            ParentId = Guid.NewGuid().ToString(),
            BornDate = DateTimeOffset.UtcNow.ToString("O"),
            JoinTime = DateTimeOffset.UtcNow.ToString("O")
        };
        _memberRepoMock.Setup(r => r.GetByIdAsync(member.Id)).ReturnsAsync(member);
        _groupRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Group?)null);

        var result = await _controller.UpdateMemberAsync(dto);

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task UpdateMemberAsync_WhenRepositoryThrows_Returns500()
    {
        _memberRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

        var result = await _controller.UpdateMemberAsync(new MemberUpdateDto { MemberId = Guid.NewGuid().ToString() });

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── DeleteMemberAsync ──────────────────────────────────────────────────

    [Test]
    public async Task DeleteMemberAsync_ExistingId_ReturnsOkAndTrue()
    {
        var id = Guid.NewGuid();
        _memberRepoMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(true);

        var result = await _controller.DeleteMemberAsync(id.ToString());

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<bool>(result), Is.True);
    }

    [Test]
    public async Task DeleteMemberAsync_NonExistingId_ReturnsNotFound()
    {
        _memberRepoMock.Setup(r => r.DeleteAsync(It.IsAny<Guid>())).ReturnsAsync(false);

        var result = await _controller.DeleteMemberAsync(Guid.NewGuid().ToString());

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task DeleteMemberAsync_WhenRepositoryThrows_Returns500()
    {
        _memberRepoMock.Setup(r => r.DeleteAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

        var result = await _controller.DeleteMemberAsync(Guid.NewGuid().ToString());

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── SoftDeleteMemberAsync ──────────────────────────────────────────────

    [Test]
    public async Task SoftDeleteMemberAsync_ExistingId_ReturnsOkAndTrue()
    {
        var id = Guid.NewGuid();
        _memberRepoMock.Setup(r => r.SoftDeleteAsync(id)).ReturnsAsync(true);

        var result = await _controller.SoftDeleteMemberAsync(id.ToString());

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<bool>(result), Is.True);
    }

    [Test]
    public async Task SoftDeleteMemberAsync_NonExistingId_ReturnsNotFound()
    {
        _memberRepoMock.Setup(r => r.SoftDeleteAsync(It.IsAny<Guid>())).ReturnsAsync(false);

        var result = await _controller.SoftDeleteMemberAsync(Guid.NewGuid().ToString());

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task SoftDeleteMemberAsync_WhenRepositoryThrows_Returns500()
    {
        _memberRepoMock.Setup(r => r.SoftDeleteAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

        var result = await _controller.SoftDeleteMemberAsync(Guid.NewGuid().ToString());

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    // ── ChangeStatusOfMemberByIdAsync ──────────────────────────────────────

    [Test]
    public async Task ChangeStatusAsync_ValidId_ReturnsOkWithMember()
    {
        var member = MakeMember();
        _memberRepoMock.Setup(r => r.ChangeStatusAsync(member.Id, false)).ReturnsAsync(true);
        _memberRepoMock.Setup(r => r.GetByIdAsync(member.Id)).ReturnsAsync(member);

        var result = await _controller.ChangeStatusOfMemberByIdAsync(member.Id.ToString(), false);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetBody<Member>(result).Success, Is.True);
    }

    [Test]
    public async Task ChangeStatusAsync_InvalidId_ReturnsNotFound()
    {
        var result = await _controller.ChangeStatusOfMemberByIdAsync("not-a-guid", true);

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task ChangeStatusAsync_MemberNotFound_ReturnsNotFound()
    {
        _memberRepoMock.Setup(r => r.ChangeStatusAsync(It.IsAny<Guid>(), It.IsAny<bool>())).ReturnsAsync(false);

        var result = await _controller.ChangeStatusOfMemberByIdAsync(Guid.NewGuid().ToString(), true);

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task ChangeStatusAsync_WhenRepositoryThrows_Returns500()
    {
        _memberRepoMock.Setup(r => r.ChangeStatusAsync(It.IsAny<Guid>(), It.IsAny<bool>()))
                       .ThrowsAsync(new Exception());

        var result = await _controller.ChangeStatusOfMemberByIdAsync(Guid.NewGuid().ToString(), true);

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }
}
