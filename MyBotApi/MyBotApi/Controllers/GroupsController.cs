using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens.Experimental;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories;
using MyBotApi.Data.Repositories.IRepositories;
using MyBotApi.Services.AuthServices.IAuthservices;

namespace MyBotApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupsController : Controller
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UsersController> _logger;

        public GroupsController(
            IGroupRepository groupRepository,
            ILogger<UsersController> logger,
            IUserRepository userRepository)
        {
            _groupRepository = groupRepository;

            _logger = logger;
            _userRepository = userRepository;
        }

        //testovo samo
        [HttpGet("all")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Group>>>> GetAllGroups()
        {
            try
            {
                var groups = await _groupRepository.GetAllAsync();

                return Ok(new ApiResponse<IEnumerable<Group>>
                {
                    Success = true,
                    Message = "Groups retrieved successfully",
                    Data = groups
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all groups");
                return StatusCode(500, new ApiResponse<IEnumerable<Group>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving groups"
                });
            }
        }

        [HttpGet("id")]
        public async Task<ActionResult<ApiResponse<Group>>> GetGroupById(Guid id)
        {
            try
            {
                var group = await _groupRepository.GetByIdAsync(id);
                if (group == null)
                {
                    return NotFound(new ApiResponse<Group>
                    {
                        Success = false,
                        Message = "Group not found"
                    });
                }
                return Ok(new ApiResponse<Group>
                {
                    Success = true,
                    Message = "Group retrieved successfully",
                    Data = group
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting group with ID {id}");
                return StatusCode(500, new ApiResponse<Group>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the group"
                });
            }

        }

        [HttpGet("name")]
        public async Task<ActionResult<ApiResponse<Group>>> GetGroupByName(string name)
        {
            try
            {
                var group = await _groupRepository.GetByNameAsync(name);
                if (group == null)
                {
                    return NotFound(new ApiResponse<Group>
                    {
                        Success = false,
                        Message = "Group not found"
                    });
                }
                return Ok(new ApiResponse<Group>
                {
                    Success = true,
                    Message = "Group retrieved successfully",
                    Data = group
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting group with name {name}");
                return StatusCode(500, new ApiResponse<Group>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the group"
                });
            }

        }

        [Authorize(Roles = "admin")]
        [HttpPost("create")]
        public async Task<ActionResult<ApiResponse<Group>>> CreateGroup(GroupDto groupCreateDto)
        {
            try
            {
                
                var group = new Group
                {
                    Name = groupCreateDto.Name,
                    Description = groupCreateDto.Description,
                    CreatedAt = DateTime.UtcNow,
                    StartAsHour = groupCreateDto.StartAsHour,
                    EndAsHour = groupCreateDto.EndAsHour,
                    UserId = Guid.Parse(groupCreateDto.UserId) // Assuming UserName is actually a string representation of the UserId
                };
                await _groupRepository.CreateAsync(group);
                return Ok(new ApiResponse<Group>
                {
                    Success = true,
                    Message = "Group created successfully",
                    Data = group
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating group");
                return StatusCode(500, new ApiResponse<Group>
                {
                    Success = false,
                    Message = $"An error occurred while creating the group. {ex.Message}"
                });
            }
        }


        [Authorize(Roles = "admin")]
        [HttpPost("update")]
        public async Task<ActionResult<ApiResponse<Group>>> UpdateGroup(string name, GroupDto groupDto)
        {
            try
            {
                bool userIdCheck = Guid.TryParse(groupDto.UserId, out var result);
                if (!userIdCheck)
                {
                    return NotFound(new ApiResponse<Group>
                    {
                        Success = false,
                        Message = "User id is not valid"
                    });
                }
                var existingGroup = await _groupRepository.GetByNameAsync(name);
                var user = await _userRepository.GetByIdAsync(Guid.Parse(groupDto.UserId));
                if (existingGroup == null
                     || user == null)
                {
                    return NotFound(new ApiResponse<Group>
                    {
                        Success = false,
                        Message = "Group or user not found"
                    });
                }
                existingGroup.Name = groupDto.Name;
                existingGroup.Description = groupDto.Description;
                await _groupRepository.UpdateAsync(existingGroup);
                Group toShow = new Group()
                {
                    Id = existingGroup.Id,
                    Name = existingGroup.Name,
                    Description = existingGroup.Description,
                    CreatedAt = existingGroup.CreatedAt,
                    StartAsHour = existingGroup.StartAsHour,
                    EndAsHour = existingGroup.EndAsHour,
                    UserId = existingGroup.UserId,
                    IsDeleted = existingGroup.IsDeleted,
                    Members = null
                };
                return Ok(new ApiResponse<Group>
                {
                    Success = true,
                    Message = "Group updated successfully",
                    Data = toShow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating group with name {name}");
                return StatusCode(500, new ApiResponse<Group>
                {
                    Success = false,
                    Message = "An error occurred while updating the group"
                });
            }
        }
        
        [Authorize(Roles = "admin")]
        [HttpDelete("delete")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteGroup(string name)
        {
            try
            {
                Group? existingGroup = await _groupRepository.GetByNameAsync(name);
                if (existingGroup == null)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Group not found"
                    });
                }
                var success = await _groupRepository.DeleteAsync(existingGroup.Id);
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Group not found"
                    });
                }
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Group deleted successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting group with name {name}");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting the group"
                });
            }
        }


        [Authorize(Roles = "admin")]
        [HttpDelete("softDelete")]
        public async Task<ActionResult<ApiResponse<bool>>> SoftDeleteGroup(string name)
        {
            try
            {
                Group? existingGroup = await _groupRepository.GetByNameAsync(name);
                if (existingGroup == null)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Group not found"
                    });
                }
                var success = await _groupRepository.SoftDeleteAsync(existingGroup.Id);
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Group not found"
                    });
                }
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Group deleted successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting group with name {name}");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting the group"
                });
            }
        }
    }
}
