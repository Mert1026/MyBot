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
public class GroupCtrlTests
{
    private Mock<IGroupRepository> _groupRepoMock;
    private Mock<IUserRepository> _userRepoMock;
    private Mock<ILogger<UsersController>> _loggerMock;
    private GroupsController _controller;

    [SetUp]
    public void SetUp()
    {
        _groupRepoMock = new Mock<IGroupRepository>();
        _userRepoMock = new Mock<IUserRepository>();
        _loggerMock = new Mock<ILogger<UsersController>>();

        _controller = new GroupsController(
            _groupRepoMock.Object,
            _loggerMock.Object,
            _userRepoMock.Object);
    }

    private static Group MakeGroup(string name = "Alpha") => new Group
    {
        Id = Guid.NewGuid(),
        Name = name,
        Description = "desc",
        StartAsHour = "08:00",
        EndAsHour = "10:00",
        CreatedAt = DateTimeOffset.UtcNow,
        UserId = Guid.NewGuid()
    };

    private static GroupDto MakeGroupDto(string name = "Alpha", Guid? userId = null) => new GroupDto
    {
        Name = name,
        Description = "desc",
        StartAsHour = "08:00",
        EndAsHour = "10:00",
        UserId = (userId ?? Guid.NewGuid()).ToString()
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

    [Test]
    public async Task GetAllGroups_ReturnsOk_WithAllGroups()
    {
        var groups = new List<Group> { MakeGroup("G1"), MakeGroup("G2") };
        _groupRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(groups);

        var result = await _controller.GetAllGroups();

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<IEnumerable<Group>>(result).Count(), Is.EqualTo(2));
    }

    [Test]
    public async Task GetAllGroups_ReturnsSuccessTrue()
    {
        _groupRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Group>());

        var result = await _controller.GetAllGroups();

        Assert.That(GetBody<IEnumerable<Group>>(result).Success, Is.True);
    }

    [Test]
    public async Task GetAllGroups_WhenRepositoryThrows_Returns500()
    {
        _groupRepoMock.Setup(r => r.GetAllAsync()).ThrowsAsync(new Exception("DB error"));

        var result = await _controller.GetAllGroups();

        var status = (ObjectResult)result.Result!;
        Assert.That(status.StatusCode, Is.EqualTo(500));
    }

    [Test]
    public async Task GetGroupById_ExistingId_ReturnsOkWithGroup()
    {
        var group = MakeGroup();
        _groupRepoMock.Setup(r => r.GetByIdAsync(group.Id)).ReturnsAsync(group);

        var result = await _controller.GetGroupById(group.Id);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<Group>(result).Id, Is.EqualTo(group.Id));
    }

    [Test]
    public async Task GetGroupById_NonExistingId_ReturnsNotFound()
    {
        _groupRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Group?)null);

        var result = await _controller.GetGroupById(Guid.NewGuid());

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task GetGroupById_WhenRepositoryThrows_Returns500()
    {
        _groupRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ThrowsAsync(new Exception());

        var result = await _controller.GetGroupById(Guid.NewGuid());

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    [Test]
    public async Task GetGroupByName_ExistingName_ReturnsOkWithGroup()
    {
        var group = MakeGroup("Beta");
        _groupRepoMock.Setup(r => r.GetByNameAsync("Beta")).ReturnsAsync(group);

        var result = await _controller.GetGroupByName("Beta");

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<Group>(result).Name, Is.EqualTo("Beta"));
    }

    [Test]
    public async Task GetGroupByName_NonExistingName_ReturnsNotFound()
    {
        _groupRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ReturnsAsync((Group?)null);

        var result = await _controller.GetGroupByName("Ghost");

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task GetGroupByName_WhenRepositoryThrows_Returns500()
    {
        _groupRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ThrowsAsync(new Exception());

        var result = await _controller.GetGroupByName("Ghost");

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    [Test]
    public async Task CreateGroup_ValidDto_ReturnsOkWithGroup()
    {
        var dto = MakeGroupDto();
        _groupRepoMock.Setup(r => r.CreateAsync(It.IsAny<Group>()))
                      .ReturnsAsync((Group g) => g);

        var result = await _controller.CreateGroup(dto);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetBody<Group>(result).Success, Is.True);
    }

    [Test]
    public async Task CreateGroup_ValidDto_GroupHasCorrectName()
    {
        var dto = MakeGroupDto("NewGroup");
        _groupRepoMock.Setup(r => r.CreateAsync(It.IsAny<Group>()))
                      .ReturnsAsync((Group g) => g);

        var result = await _controller.CreateGroup(dto);

        Assert.That(GetData<Group>(result).Name, Is.EqualTo("NewGroup"));
    }

    [Test]
    public async Task CreateGroup_WhenRepositoryThrows_Returns500()
    {
        var dto = MakeGroupDto();
        _groupRepoMock.Setup(r => r.CreateAsync(It.IsAny<Group>())).ThrowsAsync(new Exception("fail"));

        var result = await _controller.CreateGroup(dto);

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    [Test]
    public async Task UpdateGroup_ExistingGroup_ReturnsOkWithUpdatedGroup()
    {
        var userId = Guid.NewGuid();
        var group = MakeGroup("Old");
        group.UserId = userId;
        var dto = MakeGroupDto("New", userId);

        _groupRepoMock.Setup(r => r.GetByNameAsync("Old")).ReturnsAsync(group);
        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(new User { Id = userId, Email = "u@t.com", Role = "admin" });
        _groupRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Group>())).ReturnsAsync((Group g) => g);

        var result = await _controller.UpdateGroup("Old", dto);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetBody<Group>(result).Success, Is.True);
    }

    [Test]
    public async Task UpdateGroup_GroupNotFound_ReturnsNotFound()
    {
        var dto = MakeGroupDto();
        _groupRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ReturnsAsync((Group?)null);
        _userRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((User?)null);

        var result = await _controller.UpdateGroup("Ghost", dto);

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task UpdateGroup_InvalidUserId_ReturnsNotFound()
    {
        var dto = new GroupDto { Name = "X", UserId = "not-a-guid" };

        var result = await _controller.UpdateGroup("X", dto);

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task UpdateGroup_WhenRepositoryThrows_Returns500()
    {
        var userId = Guid.NewGuid();
        var dto = MakeGroupDto(userId: userId);
        _groupRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ThrowsAsync(new Exception());

        var result = await _controller.UpdateGroup("X", dto);

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    [Test]
    public async Task DeleteGroup_ExistingGroup_ReturnsOkAndTrue()
    {
        var group = MakeGroup("ToDelete");
        _groupRepoMock.Setup(r => r.GetByNameAsync("ToDelete")).ReturnsAsync(group);
        _groupRepoMock.Setup(r => r.DeleteAsync(group.Id)).ReturnsAsync(true);

        var result = await _controller.DeleteGroup("ToDelete");

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<bool>(result), Is.True);
    }

    [Test]
    public async Task DeleteGroup_GroupNotFound_ReturnsNotFound()
    {
        _groupRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ReturnsAsync((Group?)null);

        var result = await _controller.DeleteGroup("Ghost");

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task DeleteGroup_WhenRepositoryThrows_Returns500()
    {
        _groupRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ThrowsAsync(new Exception());

        var result = await _controller.DeleteGroup("X");

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }

    [Test]
    public async Task SoftDeleteGroup_ExistingGroup_ReturnsOkAndTrue()
    {
        var group = MakeGroup("ToSoftDelete");
        _groupRepoMock.Setup(r => r.GetByNameAsync("ToSoftDelete")).ReturnsAsync(group);
        _groupRepoMock.Setup(r => r.SoftDeleteAsync(group.Id)).ReturnsAsync(true);

        var result = await _controller.SoftDeleteGroup("ToSoftDelete");

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        Assert.That(GetData<bool>(result), Is.True);
    }

    [Test]
    public async Task SoftDeleteGroup_GroupNotFound_ReturnsNotFound()
    {
        _groupRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ReturnsAsync((Group?)null);

        var result = await _controller.SoftDeleteGroup("Ghost");

        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task SoftDeleteGroup_WhenRepositoryThrows_Returns500()
    {
        _groupRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ThrowsAsync(new Exception());

        var result = await _controller.SoftDeleteGroup("X");

        Assert.That(((ObjectResult)result.Result!).StatusCode, Is.EqualTo(500));
    }
}
