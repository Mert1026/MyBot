using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;

namespace MyBotApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : Controller
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly ILogger<UsersController> _logger;

        public MembersController(
            IMemberRepository memberRepository,
            IGroupRepository groupRepository,
            ILogger<UsersController> logger)
        {
            _memberRepository = memberRepository;
            _groupRepository = groupRepository;
            _logger = logger;
        }

        //testovo samo
        [HttpGet("all")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Member>>>> GetAllMembersAsync()
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
        public async Task<ActionResult<ApiResponse<Member>>> GetMemberByIdAsync(Guid id)
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
        public async Task<ActionResult<ApiResponse<Member>>> CreateMemberAsync([FromBody] MemberDto memberDto)
        {
            try
            {
                var member = new Member
                {
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
        public async Task<ActionResult<ApiResponse<Member>>> UpdateMemberAsync(string memberid, [FromBody]MemberDto memberDto)
        {
            try
            {
                bool groupIdCheck = Guid.TryParse(memberDto.GroupId, out var result);
                bool userIdCheck = Guid.TryParse(memberid, out var userIdResult);
                if (!userIdCheck
                    || !groupIdCheck)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Group id or User id is not valid"
                    });
                }
                var existingMember = await _memberRepository.GetByIdAsync(Guid.Parse(memberid));
                if (existingMember == null)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Member not found"
                    });
                }
                var existingGroup = await _groupRepository.GetByIdAsync(Guid.Parse(memberDto.GroupId));
                if (existingGroup == null)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Group is not found"
                    });
                }
                existingMember.Name = memberDto.Name;
                existingMember.Description = memberDto.Description;
                existingMember.GroupId = Guid.Parse(memberDto.GroupId);
                await _memberRepository.UpdateAsync(existingMember);
                Member toShow = new Member
                {
                    Id = existingMember.Id,
                    Name = existingMember.Name,
                    Description = existingMember.Description,
                    JoinTime = existingMember.JoinTime,
                    Status = existingMember.Status,
                    GroupId = existingMember.GroupId,
                    Group = null
                };
                return Ok(new ApiResponse<Member>
                {
                    Success = true,
                    Message = "Member updated successfully",
                    Data = toShow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating member with id {memberid}");
                return StatusCode(500, new ApiResponse<Member>
                {
                    Success = false,
                    Message = "An error occurred while updating the member"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteMemberAsync(string id)
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
        public async Task<ActionResult<ApiResponse<bool>>> SoftDeleteMemberAsync(string id)
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

        [Authorize(Roles = "admin")]
        [HttpPost("statusChange")]
        public async Task<ActionResult<ApiResponse<Member>>> ChangeStatusOfMemberByIdAsync(string memberId, bool status)
        {
            try
            {
                bool memberIdCheck = Guid.TryParse(memberId, out var userIdResult);
                if (memberIdCheck == false)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Invalid member id"
                    });
                }
                bool member = await _memberRepository.ChangeStatusAsync(Guid.Parse(memberId), status);
                if (member == false)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Member not found"
                    });
                }
                Member? memberData = await _memberRepository.GetByIdAsync(Guid.Parse(memberId));
                if (memberData == null)
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
                    Message = "Status of member changed successfully",
                    Data = memberData
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error with changing status of member with ID {memberId}");
                return StatusCode(500, new ApiResponse<Member>
                {
                    Success = false,
                    Message = $"Error with changing status of member with ID {memberId}"
                });
            }
        }
    }
}
