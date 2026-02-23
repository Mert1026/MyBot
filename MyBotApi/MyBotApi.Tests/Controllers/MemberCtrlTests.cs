using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MyBotApi.Controllers;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;
using NUnit.Framework;

namespace MyBotApi.Tests;

[TestFixture]
public class MemberCtrlTests
{
    //private Mock<IMemberRepository> _memberRepoMock;
    //private Mock<IGroupRepository> _groupRepoMock;
    //private Mock<ILogger<UsersController>> _loggerMock;
    //private MembersController _controller;

    //// ── Setup ──────────────────────────────────────────────────────────────

    //[SetUp]
    //public void SetUp()
    //{
    //    _memberRepoMock = new Mock<IMemberRepository>();
    //    _groupRepoMock = new Mock<IGroupRepository>();
    //    _loggerMock = new Mock<ILogger<UsersController>>();

    //    _controller = new MembersController(
    //        _memberRepoMock.Object,
    //        _groupRepoMock.Object,
    //        _loggerMock.Object);
    //}

    //// ── Helpers ────────────────────────────────────────────────────────────

    //private static Member MakeMember(string name = "Alice") => new Member
    //{
    //    Id = Guid.NewGuid(),
    //    Name = name,
    //    Description = "desc",
    //    JoinTime = DateTimeOffset.UtcNow,
    //    Status = true,
    //    GroupId = Guid.NewGuid()
    //};

    //private static MemberDto MakeMemberDto(Guid? groupId = null) => new MemberDto
    //{
    //    Name = "Alice",
    //    Description = "desc",
    //    GroupId = (groupId ?? Guid.NewGuid()).ToString()
    //};

    //private static T GetData<T>(ActionResult<ApiResponse<T>> result)
    //{
    //    var ok = (OkObjectResult)result.Result!;
    //    return ((ApiResponse<T>)ok.Value!).Data!;
    //}

    //private static ApiResponse<T> GetBody<T>(ActionResult<ApiResponse<T>> result)
    //{
    //    var ok = (OkObjectResult)result.Result!;
    //    return (ApiResponse<T>)ok.Value!;
    //}

    //// ── GetAllMembersAsync ─────────────────────────────────────────────────

    //[Test]
    //public async Task GetAllMembersAsync_ReturnsOkWithAllMembers()
    //{
    //    var members = new List<Member> { MakeMember("Alice"), MakeMember("Bob") };
    //    _memberRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(members);

    //    var result = await _controller.GetAllMembersAsync();

    //    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    //    Assert.That(GetData<IEnumerable<Member>>(result).Count(), Is.EqualTo(2));
    //}

    //[Test]
    //public async Task GetAllMembersAsync_ReturnsSuccessTrue()
    //{
    //    _memberRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Member>());

    //    var result = await _controller.GetAllMembersAsync();

    //    Assert.That(GetBody<IEnumerable<Member>>(result).Success, Is.True);
    //}

    //[Test]
    //public async Task GetAllMembersAsync_WhenRepositoryThrows_Returns500()
    //{
    //    _memberRepoMock.Setup(r => r.GetAllAsync()).ThrowsAsync(new Exception("DB error"));

    //    var result = await _controller.GetAllMembersAsync();

    //    Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    //}

    //// ── GetMemberByIdAsync ─────────────────────────────────────────────────

    //[Test]
    //public async Task GetMemberByIdAsync_ExistingId_ReturnsOkWithMember()
    //{
    //    var member = MakeMember();
    //    _memberRepoMock.Setup(r => r.GetByIdAsync(member.Id)).ReturnsAsync(member);

    //    var result = await _controller.GetMemberByIdAsync(member.Id);

    //    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    //    Assert.That(GetData<Member>(result).Id, Is.EqualTo(member.Id));
    //}

    //[Test]
    //public async Task GetMemberByIdAsync_NonExistingId_ReturnsNotFound()
    //{
    //    _memberRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Member?)null);

    //    var result = await _controller.GetMemberByIdAsync(Guid.NewGuid());

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task GetMemberByIdAsync_WhenRepositoryThrows_Returns500()
    //{
    //    _memberRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

    //    var result = await _controller.GetMemberByIdAsync(Guid.NewGuid());

    //    Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    //}

    //// ── CreateMemberAsync ──────────────────────────────────────────────────

    //[Test]
    //public async Task CreateMemberAsync_ValidDto_ReturnsOkWithMember()
    //{
    //    var dto = MakeMemberDto();
    //    _memberRepoMock.Setup(r => r.CreateAsync(It.IsAny<Member>()))
    //                   .ReturnsAsync((Member m) => m);

    //    var result = await _controller.CreateMemberAsync(dto);

    //    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    //    Assert.That(GetBody<Member>(result).Success, Is.True);
    //}

    //[Test]
    //public async Task CreateMemberAsync_ValidDto_MemberHasCorrectName()
    //{
    //    var dto = new MemberDto { Name = "Bob", Description = "d", GroupId = Guid.NewGuid().ToString() };
    //    _memberRepoMock.Setup(r => r.CreateAsync(It.IsAny<Member>()))
    //                   .ReturnsAsync((Member m) => m);

    //    var result = await _controller.CreateMemberAsync(dto);

    //    Assert.That(GetData<Member>(result).Name, Is.EqualTo("Bob"));
    //}

    //[Test]
    //public async Task CreateMemberAsync_WhenRepositoryThrows_Returns500()
    //{
    //    _memberRepoMock.Setup(r => r.CreateAsync(It.IsAny<Member>())).ThrowsAsync(new Exception("fail"));

    //    var result = await _controller.CreateMemberAsync(MakeMemberDto());

    //    Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    //}

    //// ── UpdateMemberAsync ──────────────────────────────────────────────────

    //[Test]
    //public async Task UpdateMemberAsync_ValidRequest_ReturnsOkWithUpdatedMember()
    //{
    //    var groupId = Guid.NewGuid();
    //    var member = MakeMember();
    //    var dto = new MemberDto { Name = "Updated", Description = "d", GroupId = groupId.ToString() };

    //    _memberRepoMock.Setup(r => r.GetByIdAsync(member.Id)).ReturnsAsync(member);
    //    _groupRepoMock.Setup(r => r.GetByIdAsync(groupId)).ReturnsAsync(new Group { Id = groupId, Name = "G" });
    //    _memberRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Member>())).ReturnsAsync((Member m) => m);

    //    var result = await _controller.UpdateMemberAsync(member.Id.ToString(), dto);

    //    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    //    Assert.That(GetBody<Member>(result).Success, Is.True);
    //}

    //[Test]
    //public async Task UpdateMemberAsync_InvalidMemberId_ReturnsNotFound()
    //{
    //    var dto = MakeMemberDto();

    //    var result = await _controller.UpdateMemberAsync("not-a-guid", dto);

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task UpdateMemberAsync_InvalidGroupId_ReturnsNotFound()
    //{
    //    var dto = new MemberDto { Name = "X", Description = "d", GroupId = "not-a-guid" };

    //    var result = await _controller.UpdateMemberAsync(Guid.NewGuid().ToString(), dto);

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task UpdateMemberAsync_MemberNotFound_ReturnsNotFound()
    //{
    //    _memberRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Member?)null);

    //    var result = await _controller.UpdateMemberAsync(Guid.NewGuid().ToString(), MakeMemberDto());

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task UpdateMemberAsync_GroupNotFound_ReturnsNotFound()
    //{
    //    var member = MakeMember();
    //    _memberRepoMock.Setup(r => r.GetByIdAsync(member.Id)).ReturnsAsync(member);
    //    _groupRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Group?)null);

    //    var result = await _controller.UpdateMemberAsync(member.Id.ToString(), MakeMemberDto());

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task UpdateMemberAsync_WhenRepositoryThrows_Returns500()
    //{
    //    _memberRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

    //    var result = await _controller.UpdateMemberAsync(Guid.NewGuid().ToString(), MakeMemberDto());

    //    Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    //}

    //// ── DeleteMemberAsync ──────────────────────────────────────────────────

    //[Test]
    //public async Task DeleteMemberAsync_ExistingId_ReturnsOkAndTrue()
    //{
    //    var id = Guid.NewGuid();
    //    _memberRepoMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(true);

    //    var result = await _controller.DeleteMemberAsync(id.ToString());

    //    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    //    Assert.That(GetData<bool>(result), Is.True);
    //}

    //[Test]
    //public async Task DeleteMemberAsync_NonExistingId_ReturnsNotFound()
    //{
    //    _memberRepoMock.Setup(r => r.DeleteAsync(It.IsAny<Guid>())).ReturnsAsync(false);

    //    var result = await _controller.DeleteMemberAsync(Guid.NewGuid().ToString());

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task DeleteMemberAsync_WhenRepositoryThrows_Returns500()
    //{
    //    _memberRepoMock.Setup(r => r.DeleteAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

    //    var result = await _controller.DeleteMemberAsync(Guid.NewGuid().ToString());

    //    Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    //}

    //// ── SoftDeleteMemberAsync ──────────────────────────────────────────────

    //[Test]
    //public async Task SoftDeleteMemberAsync_ExistingId_ReturnsOkAndTrue()
    //{
    //    var id = Guid.NewGuid();
    //    _memberRepoMock.Setup(r => r.SoftDeleteAsync(id)).ReturnsAsync(true);

    //    var result = await _controller.SoftDeleteMemberAsync(id.ToString());

    //    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    //    Assert.That(GetData<bool>(result), Is.True);
    //}

    //[Test]
    //public async Task SoftDeleteMemberAsync_NonExistingId_ReturnsNotFound()
    //{
    //    _memberRepoMock.Setup(r => r.SoftDeleteAsync(It.IsAny<Guid>())).ReturnsAsync(false);

    //    var result = await _controller.SoftDeleteMemberAsync(Guid.NewGuid().ToString());

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task SoftDeleteMemberAsync_WhenRepositoryThrows_Returns500()
    //{
    //    _memberRepoMock.Setup(r => r.SoftDeleteAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

    //    var result = await _controller.SoftDeleteMemberAsync(Guid.NewGuid().ToString());

    //    Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    //}

    //// ── ChangeStatusOfMemberByIdAsync ──────────────────────────────────────

    //[Test]
    //public async Task ChangeStatusAsync_ValidId_ReturnsOkWithMember()
    //{
    //    var member = MakeMember();
    //    _memberRepoMock.Setup(r => r.ChangeStatusAsync(member.Id, false)).ReturnsAsync(true);
    //    _memberRepoMock.Setup(r => r.GetByIdAsync(member.Id)).ReturnsAsync(member);

    //    var result = await _controller.ChangeStatusOfMemberByIdAsync(member.Id.ToString(), false);

    //    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    //    Assert.That(GetBody<Member>(result).Success, Is.True);
    //}

    //[Test]
    //public async Task ChangeStatusAsync_InvalidId_ReturnsNotFound()
    //{
    //    var result = await _controller.ChangeStatusOfMemberByIdAsync("not-a-guid", true);

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task ChangeStatusAsync_MemberNotFound_ReturnsNotFound()
    //{
    //    _memberRepoMock.Setup(r => r.ChangeStatusAsync(It.IsAny<Guid>(), It.IsAny<bool>())).ReturnsAsync(false);

    //    var result = await _controller.ChangeStatusOfMemberByIdAsync(Guid.NewGuid().ToString(), true);

    //    Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    //}

    //[Test]
    //public async Task ChangeStatusAsync_WhenRepositoryThrows_Returns500()
    //{
    //    _memberRepoMock.Setup(r => r.ChangeStatusAsync(It.IsAny<Guid>(), It.IsAny<bool>()))
    //                   .ThrowsAsync(new Exception());

    //    var result = await _controller.ChangeStatusOfMemberByIdAsync(Guid.NewGuid().ToString(), true);

    //    Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    //}
}
