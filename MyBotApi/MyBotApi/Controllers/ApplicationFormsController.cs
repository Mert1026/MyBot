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
    public class ApplicationFormsController : Controller
    {
        private readonly ILogger<ApplicationFormsController> _logger;
        private readonly IApplicationFormRepository _applicationFormRepository;
        public ApplicationFormsController(
            ILogger<ApplicationFormsController> logger
            ,IApplicationFormRepository applicationFormRepository)
        {
            _logger = logger;
            _applicationFormRepository = applicationFormRepository;
        }

        [HttpGet("all")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ApplicationForm>>>> GetAllForms()
        {
            try
            {
                var forms = await _applicationFormRepository.GetAllAsync();

                return Ok(new ApiResponse<IEnumerable<ApplicationForm>>
                {
                    Success = true,
                    Message = "Application forms retrieved successfully",
                    Data = forms
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all application forms");
                return StatusCode(500, new ApiResponse<IEnumerable<ApplicationForm>>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving application forms - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [HttpGet("id")]
        public async Task<ActionResult<ApiResponse<ApplicationForm>>> GetFormById(Guid id)
        {
            try
            {
                var form = await _applicationFormRepository.GetByIdAsync(id);
                if (form == null)
                {
                    return NotFound(new ApiResponse<ApplicationForm>
                    {
                        Success = false,
                        Message = "Application form not found"
                    });
                }

                return Ok(new ApiResponse<ApplicationForm>
                {
                    Success = true,
                    Message = "Application form retrieved successfully",
                    Data = form
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting application form with ID {id}");
                return StatusCode(500, new ApiResponse<ApplicationForm>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving the application form - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [HttpGet("parentId")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ApplicationForm>>>> GetFormsByParentId(Guid parentId)
        {
            try
            {
                var forms = await _applicationFormRepository.GetByParentIdAsync(parentId);

                return Ok(new ApiResponse<IEnumerable<ApplicationForm>>
                {
                    Success = true,
                    Message = "Application forms retrieved successfully",
                    Data = forms
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting application forms for parent ID {parentId}");
                return StatusCode(500, new ApiResponse<IEnumerable<ApplicationForm>>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving application forms by parent - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [HttpGet("memberId")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ApplicationForm>>>> GetFormsByMemberId(Guid memberId)
        {
            try
            {
                var forms = await _applicationFormRepository.GetByMemberIdAsync(memberId);

                return Ok(new ApiResponse<IEnumerable<ApplicationForm>>
                {
                    Success = true,
                    Message = "Application forms retrieved successfully",
                    Data = forms
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting application forms for member ID {memberId}");
                return StatusCode(500, new ApiResponse<IEnumerable<ApplicationForm>>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving application forms by member - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("create")]
        public async Task<ActionResult<ApiResponse<ApplicationForm>>> CreateForm(ApplicationFormDto formDto)
        {
            try
            {
                var form = new ApplicationForm
                {
                    ParentFirstName = formDto.ParentFirstName,
                    ParentLastName = formDto.ParentLastName,
                    PhoneNumber = formDto.PhoneNumber,
                    Email = formDto.Email,
                    Location = formDto.Location,
                    CreatedAt = DateTimeOffset.UtcNow
                };

                await _applicationFormRepository.CreateAsync(form);

                return Ok(new ApiResponse<ApplicationForm>
                {
                    Success = true,
                    Message = "Application form created successfully",
                    Data = form
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating application form");
                return StatusCode(500, new ApiResponse<ApplicationForm>
                {
                    Success = false,
                    Message = $"An error occurred while creating the application form - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("update")]
        public async Task<ActionResult<ApiResponse<ApplicationForm>>> UpdateForm(Guid id, ApplicationFormDto formDto)
        {
            try
            {
                var existingForm = await _applicationFormRepository.GetByIdAsync(id);
                if (existingForm == null)
                {
                    return NotFound(new ApiResponse<ApplicationForm>
                    {
                        Success = false,
                        Message = "Application form not found"
                    });
                }

                existingForm.ParentFirstName = formDto.ParentFirstName;
                existingForm.ParentLastName = formDto.ParentLastName;
                existingForm.PhoneNumber = formDto.PhoneNumber;
                existingForm.Email = formDto.Email;
                existingForm.Location = formDto.Location;

                await _applicationFormRepository.UpdateAsync(existingForm);

                return Ok(new ApiResponse<ApplicationForm>
                {
                    Success = true,
                    Message = "Application form updated successfully",
                    Data = existingForm
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating application form with ID {id}");
                return StatusCode(500, new ApiResponse<ApplicationForm>
                {
                    Success = false,
                    Message = $"An error occurred while updating the application form - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteForm(Guid id)
        {
            try
            {
                var success = await _applicationFormRepository.DeleteAsync(id);
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Application form not found"
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Application form deleted successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting application form with ID {id}");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"An error occurred while deleting the application form - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("softDelete")]
        public async Task<ActionResult<ApiResponse<bool>>> SoftDeleteForm(Guid id)
        {
            try
            {
                var success = await _applicationFormRepository.SoftDeleteAsync(id);
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Application form not found"
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Application form soft deleted successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error soft deleting application form with ID {id}");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"An error occurred while soft deleting the application form - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }
    }
}
