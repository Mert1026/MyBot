using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs.ParentDTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;

namespace MyBotApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParentsController : Controller
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly IParentRepository _parentRepository;
        private readonly ILogger<UsersController> _logger;

        public ParentsController(
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
        public async Task<ActionResult<ApiResponse<IEnumerable<Parent>>>> GetAllParentsAsync()
        {
            try
            {
                var parents = await _parentRepository.GetAllAsync();

                return Ok(new ApiResponse<IEnumerable<Parent>>
                {
                    Success = true,
                    Message = "Parents retrieved successfully",
                    Data = parents
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all Parents");
                return StatusCode(500, new ApiResponse<IEnumerable<Parent>>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving parents  - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [HttpGet("id")]
        public async Task<ActionResult<ApiResponse<Parent>>> GetParentByIdAsync(Guid id)
        {
            try
            {
                var parent = await _parentRepository.GetByIdAsync(id);
                if (parent == null)
                {
                    return NotFound(new ApiResponse<Parent>
                    {
                        Success = false,
                        Message = "Parent not found"
                    });
                }
                return Ok(new ApiResponse<Parent>
                {
                    Success = true,
                    Message = "Parent retrieved successfully by id",
                    Data = parent
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting parent with ID {id}");
                return StatusCode(500, new ApiResponse<Parent>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving the parent by id  - {ex.InnerException?.Message ?? ex.Message}"
                });
            }

        }

        [Authorize(Roles = "admin")]
        [HttpPost("create")]
        public async Task<ActionResult<ApiResponse<Parent>>> CreateParentAsync([FromBody] ParentDto parentDto)
        {
            try
            {
                DateTimeOffset payedUntilParsed= DateTimeOffset.Parse(parentDto.PayedUntil);
                DateTimeOffset joinTimeParsed = DateTimeOffset.Parse(parentDto.JoinTime);
                var parent = new Parent
                {
                    FirstName = parentDto.FirstName,
                    LastName = parentDto.LastName,
                    Email = parentDto.Email,
                    PhoneNumber = parentDto.PhoneNumber,
                    GivenPrice = parentDto.GivenPrice,
                    PayedUntil = payedUntilParsed,
                    JoinTime = joinTimeParsed,
                    ApplicationFormId = Guid.Parse(parentDto.ApplicationFormId)
                };
                await _parentRepository.CreateAsync(parent);
                return Ok(new ApiResponse<Parent>
                {
                    Success = true,
                    Message = "Parent created successfully",
                    Data = parent
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating parent");
                return StatusCode(500, new ApiResponse<Parent>
                {
                    Success = false,
                    Message = $"An error occurred while creating the parent - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }


        [Authorize(Roles = "admin")]
        [HttpPost("update")]
        public async Task<ActionResult<ApiResponse<Member>>> UpdateParentAsync([FromBody] ParentUpdateDto parentDto)
        {
            try
            {
                DateTimeOffset payedUntilParsed = DateTimeOffset.Parse(parentDto.PayedUntil);
                DateTimeOffset joinTimeParsed = DateTimeOffset.Parse(parentDto.JoinTime);
                bool parentIdCheck = Guid.TryParse(parentDto.ParentId, out var parentIdResult);
                if (!parentIdCheck)
                {
                    return NotFound(new ApiResponse<Member>
                    {
                        Success = false,
                        Message = "Parent id is not valid"
                    });
                }
                Guid parentIdParsed = Guid.Parse(parentDto.ParentId);
                var existingParent = await _parentRepository.GetByIdAsync(parentIdParsed);
                if (existingParent == null)
                {
                    return NotFound(new ApiResponse<Parent>
                    {
                        Success = false,
                        Message = "Parent is not found"
                    });
                }
                var kidsOfParent = await _memberRepository.GetAllByParentIdAsync(parentIdParsed);
                existingParent.FirstName = parentDto.FirstName;
                existingParent.LastName = parentDto.LastName;
                existingParent.Email = parentDto.Email;
                existingParent.PhoneNumber = parentDto.PhoneNumber;
                existingParent.GivenPrice = parentDto.GivenPrice;
                existingParent.PayedUntil = payedUntilParsed;
                existingParent.JoinTime = joinTimeParsed;
                await _parentRepository.UpdateAsync(existingParent);
                Parent toShow = new Parent
                {
                    Id = existingParent.Id,
                    FirstName = existingParent.FirstName,
                    LastName = existingParent.LastName,
                    Email = existingParent.Email,
                    PhoneNumber = existingParent.PhoneNumber,
                    GivenPrice = existingParent.GivenPrice,
                    PayedUntil = existingParent.PayedUntil,
                    JoinTime = joinTimeParsed 
                };
                return Ok(new ApiResponse<Parent>
                {
                    Success = true,
                    Message = "Parent updated successfully",
                    Data = toShow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating parent with id {parentDto.ParentId}");
                return StatusCode(500, new ApiResponse<Parent>
                {
                    Success = false,
                    Message = $"An error occurred while updating the parent - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteParentAsync(string id)
        {
            try
            {
                var success = await _parentRepository.DeleteAsync(Guid.Parse(id));
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Parent not found"
                    });
                }
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Parent deleted successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting parent with id {id}");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"An error occurred while deleting the parent - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("softDelete")]
        public async Task<ActionResult<ApiResponse<bool>>> SoftDeleteParentAsync(string id)
        {
            try
            {
                var success = await _parentRepository.SoftDeleteAsync(Guid.Parse(id));
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Parent not found"
                    });
                }
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Parent deleted successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting parent with id {id}");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"An error occurred while deleting the parent - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("recordPayment")]
        public async Task<ActionResult<ApiResponse<Parent>>> RecordPaymentAsync([FromBody] RecordPaymentDto paymentDto)
        {
            try
            {
                var parent = await _parentRepository.GetByIdAsync(paymentDto.ParentId);
                if (parent == null)
                {
                    return NotFound(new ApiResponse<Parent>
                    {
                        Success = false,
                        Message = "Parent not found"
                    });
                }

                // Update total paid
                parent.TotalPaid += paymentDto.AmountPaid;

                // Update PayedUntil based on rules from front-end
                parent.PayedUntil = paymentDto.NewPayedUntil;

                await _parentRepository.UpdateAsync(parent);

                return Ok(new ApiResponse<Parent>
                {
                    Success = true,
                    Message = "Payment recorded successfully",
                    Data = parent
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error recording payment for parent id {paymentDto.ParentId}");
                return StatusCode(500, new ApiResponse<Parent>
                {
                    Success = false,
                    Message = $"An error occurred while recording the payment - {ex.InnerException?.Message ?? ex.Message}"
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
                    Message = $"Error with changing status of member with ID {memberId}  - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }
    }
}
