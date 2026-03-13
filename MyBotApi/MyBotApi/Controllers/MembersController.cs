using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs.MemberDTOs;
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
        private readonly IParentRepository _parentRepository;
        private readonly ILogger<UsersController> _logger;

        public MembersController(
            IMemberRepository memberRepository,
            IGroupRepository groupRepository,
            IParentRepository parentRepository,
            ILogger<UsersController> logger)
        {
            _memberRepository = memberRepository;
            _groupRepository = groupRepository;
            _parentRepository = parentRepository;
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
                    Message = $"An error occurred while retrieving members - {ex.InnerException?.Message ?? ex.Message}"
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
                    Message = $"An error occurred while retrieving the member by id - {ex.InnerException?.Message ?? ex.Message}"
                });
            }

        }

        [Authorize(Roles = "admin")]
        [HttpPost("create")]
        public async Task<ActionResult<ApiResponse<Member>>> CreateMemberAsync([FromBody] MemberDto memberDto)
        {
            try
            {
                DateTimeOffset bornDate = DateTimeOffset.Parse(memberDto.BornDate);
                DateTimeOffset joinTime = DateTimeOffset.Parse(memberDto.JoinTime);
                var member = new Member
                {
                    FirstName = memberDto.FirstName,
                    LastName = memberDto.LastName,
                    BornDate = bornDate,
                    ParentId = Guid.Parse(memberDto.ParentId),
                    Description = memberDto.Description,
                    JoinTime = joinTime,
                    ApplicationFormId = Guid.Parse(memberDto.ApplicationFormId)
                };
                await _memberRepository.CreateAsync(member);

                var group = await _groupRepository.GetByIdAsync(Guid.Parse(memberDto.GroupId));
                if (group == null)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Group not found"
                    });
                }

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
                    Message = $"An error occurred while creating the member - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }


        [Authorize(Roles = "admin")]
        [HttpPost("update")]
        public async Task<ActionResult<ApiResponse<Member>>> UpdateMemberAsync([FromBody] MemberUpdateDto memberDto)
        {
            try
            {
                DateTimeOffset bornDate = DateTimeOffset.Parse(memberDto.BornDate);
                DateTimeOffset joinTime = DateTimeOffset.Parse(memberDto.JoinTime);
                bool groupIdCheck = Guid.TryParse(memberDto.GroupId, out var result);
                bool userIdCheck = Guid.TryParse(memberDto.MemberId, out var userIdResult);
                bool parentIdCheck = Guid.TryParse(memberDto.ParentId, out var parentIdResult);
                if (!userIdCheck
                    || !groupIdCheck
                    || !parentIdCheck)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        //Moje i po dobre da se napravi
                        Success = false,
                        Message = "Group id or User id or Parent Id is not valid"
                    });
                }
                var existingMember = await _memberRepository.GetByIdAsync(Guid.Parse(memberDto.MemberId));
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
                var existingParent = await _parentRepository.GetByIdAsync(Guid.Parse(memberDto.ParentId));
                if (existingParent == null)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Parent is not found"
                    });
                }
                existingMember.FirstName = memberDto.FirstName;
                existingMember.LastName = memberDto.LastName;
                existingMember.BornDate = bornDate;
                existingMember.JoinTime = joinTime;
                existingMember.Description = memberDto.Description;
                existingMember.ParentId = Guid.Parse(memberDto.ParentId);
                existingMember.ApplicationFormId = Guid.Parse(memberDto.ApplicationFormId);
                await _memberRepository.UpdateAsync(existingMember);
                Member toShow = new Member
                {
                    Id = existingMember.Id,
                    FirstName = existingMember.FirstName,
                    LastName = existingMember.LastName,
                    Age = existingMember.Age,
                    Description = existingMember.Description,
                    JoinTime = existingMember.JoinTime,
                    Status = existingMember.Status,
                    ParentId = existingParent.Id,
                    ApplicationFormId = existingParent.ApplicationFormId,
                    BornDate = existingMember.BornDate,
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
                _logger.LogError(ex, $"Error updating member with id {memberDto.MemberId}");
                return StatusCode(500, new ApiResponse<Member>
                {
                    Success = false,
                    Message = $"An error occurred while updating the member - {ex.InnerException?.Message ?? ex.Message}"
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
                    Message = $"An error occurred while deleting the member  - {ex.InnerException?.Message ?? ex.Message}"
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
                    Message = $"An error occurred while deleting the member - {ex.InnerException?.Message ?? ex.Message}"
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
                    Message = $"Error with changing status of member with ID {memberId} - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("addToGroup")]
        public async Task<ActionResult<ApiResponse<Member>>> AddMemberToGroupAsync(string memberId, string groupId)
        {
            try
            {
                bool memberIdCheck = Guid.TryParse(memberId, out var userIdResult);
                bool groupIdCheck = Guid.TryParse(groupId, out var groupIdResult);
                if (!memberIdCheck || !groupIdCheck)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Invalid member id or group id"
                    });
                }
                var member = await _memberRepository.GetByIdAsync(Guid.Parse(memberId));
                if (member == null)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Member not found"
                    });
                }
                var group = await _groupRepository.GetByIdAsync(Guid.Parse(groupId));
                if (group == null)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Group not found"
                    });
                }
                await _groupRepository.AddMemberToGroupAsync(member, group.Id);
                return Ok(new ApiResponse<Member>
                {
                    Success = true,
                    Message = "Member added to group successfully",
                    Data = member
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding member with ID {memberId} to group with ID {groupId}");
                return StatusCode(500, new ApiResponse<Member>
                {
                    Success = false,
                    Message = $"An error occurred while adding the member to the group - {ex.InnerException?.Message ?? ex.Message}"
                });
            }

        }
    }
}
