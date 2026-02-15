using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;

namespace MyBotApi.Controllers
{
    public class MembersController : Controller
    {
        private readonly IMemberRepository _memberRepository;
        private readonly ILogger<UsersController> _logger;

        public MembersController(
            IMemberRepository memberRepository,
            ILogger<UsersController> logger)
        {
            _memberRepository = memberRepository;
            _logger = logger;
        }

        //testovo samo
        [HttpGet("all")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Member>>>> GetAllMembers()
        {
            try
            {
                var members = await _memberRepository.GetAllAsync();

                return Ok(new ApiResponse<IEnumerable<Member>>
                {
                    Success = true,
                    Message = "Members retrieved successfully",
                    Data = members
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all members");
                return StatusCode(500, new ApiResponse<IEnumerable<Member>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving members"
                });
            }
        }

        [HttpGet("id")]
        public async Task<ActionResult<ApiResponse<Member>>> GetMemberById(Guid id)
        {
            try
            {
                var member = await _memberRepository.GetByIdAsync(id);
                if (member == null)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Member not found"
                    });
                }
                return Ok(new ApiResponse<Member>
                {
                    Success = true,
                    Message = "Member retrieved successfully by id",
                    Data = member
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting member with ID {id}");
                return StatusCode(500, new ApiResponse<Member>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the member by id"
                });
            }

        }

        [Authorize(Roles = "admin")]
        [HttpPost("create")]
        public async Task<ActionResult<ApiResponse<Member>>> CreateMember(MemberDto memberDto)
        {
            try
            {
                var member = new Member
                {
                    Id = Guid.NewGuid(),
                    Name = memberDto.Name,
                    Description = memberDto.Description,
                    JoinTime = DateTimeOffset.UtcNow,
                    GroupId = Guid.Parse(memberDto.GroupId)
                };
                await _memberRepository.CreateAsync(member);
                return Ok(new ApiResponse<Member>
                {
                    Success = true,
                    Message = "Member created successfully",
                    Data = member
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating member");
                return StatusCode(500, new ApiResponse<Member>
                {
                    Success = false,
                    Message = "An error occurred while creating the member"
                });
            }
        }


        [Authorize(Roles = "admin")]
        [HttpPost("update")]
        public async Task<ActionResult<ApiResponse<Member>>> UpdateMember(string id, MemberDto memberDto)
        {
            try
            {
                var existingMember = await _memberRepository.GetByIdAsync(Guid.Parse(id));
                if (existingMember == null)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false, 
                        Message = "Member not found"
                    });
                }
                existingMember.Name = memberDto.Name;
                existingMember.Description = memberDto.Description;
                existingMember.GroupId = Guid.Parse(memberDto.GroupId);
                existingMember.IsDeleted = memberDto.IsDeleted;
                existingMember.Status = memberDto.Status;
                await _memberRepository.UpdateAsync(existingMember);
                return Ok(new ApiResponse<Member>
                {
                    Success = true,
                    Message = "Member updated successfully",
                    Data = existingMember
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating member with id {id}");
                return StatusCode(500, new ApiResponse<Member>
                {
                    Success = false,
                    Message = "An error occurred while updating the member"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteMember(string id)
        {
            try
            {
                var success = await _memberRepository.DeleteAsync(Guid.Parse(id));
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Member not found"
                    });
                }
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Member deleted successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting member with id {id}");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting the member"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("softDelete")]
        public async Task<ActionResult<ApiResponse<bool>>> SoftDeleteMember(string id)
        {
            try
            {
                var success = await _memberRepository.SoftDeleteAsync(Guid.Parse(id));
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Member not found"
                    });
                }
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Member deleted successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting member with id {id}");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting the member"
                });
            }
        }
    }
}
