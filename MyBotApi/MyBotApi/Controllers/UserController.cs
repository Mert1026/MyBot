using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBotApi.Data.Models.Models.DTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;
using MyBotApi.Services.AuthServices.IAuthservices;

namespace MyBotApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly INhostAuthService _authService;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UsersController> _logger;

        public UsersController(
            INhostAuthService authService,
            IUserRepository userRepository,
            ILogger<UsersController> logger)
        {
            _authService = authService;
            _userRepository = userRepository;
            _logger = logger;
        }

        [HttpPost("signup")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> SignUp([FromBody] SignUpRequest request)
        {
            try
            {
                //if (request.Role != "admin" && request.Role != "teacher")
                //{
                //    return BadRequest(new ApiResponse<AuthResponse>
                //    {
                //        Success = false,
                //        Message = "Invalid role. Must be 'admin' or 'teacher'."
                //    });
                //}

                var result = await _authService.SignUpAsync(request);

                return Ok(new ApiResponse<AuthResponse>
                {
                    Success = true,
                    Message = "User registered successfully. Please verify your email.",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sign up failed");
                return BadRequest(new ApiResponse<AuthResponse>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("signin")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> SignIn([FromBody] SignInRequest request)
        {
            try
            {
                var result = await _authService.SignInAsync(request);

                return Ok(new ApiResponse<AuthResponse>
                {
                    Success = true,
                    Message = "Sign in successful",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sign in failed");
                return Unauthorized(new ApiResponse<AuthResponse>
                {
                    Success = false,
                    Message =  ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpGet("profile")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<UserDto>>> GetProfile()
        {
            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(new ApiResponse<UserDto>
                    {
                        Success = false,
                        Message = "User email not found in token"
                    });
                }

                var user = await _userRepository.GetByEmailAsync(userEmail);

                if (user == null)
                {
                    return NotFound(new ApiResponse<UserDto>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                return Ok(new ApiResponse<UserDto>
                {
                    Success = true,
                    Message = "Profile retrieved successfully",
                    Data = new UserDto
                    {
                        Id = user.Id.ToString(),
                        Email = user.Email,
                        DisplayName = user.DisplayName,
                        Role = user.Role,
                        EmailVerified = user.EmailVerified
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile");
                return StatusCode(500, new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving profile - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        //testovo samo
        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAllUsers()
        {
            try
            {
                var users = await _userRepository.GetAllAsync();

                var userDtos = users.Select(u => new UserDto
                {
                    Id = u.Id.ToString(),
                    Email = u.Email,
                    DisplayName = u.DisplayName,
                    Role = u.Role,
                    EmailVerified = u.EmailVerified
                });

                return Ok(new ApiResponse<IEnumerable<UserDto>>
                {
                    Success = true,
                    Message = "Users retrieved successfully",
                    Data = userDtos
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, new ApiResponse<IEnumerable<UserDto>>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving users - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        //testovo samo
        [HttpGet("by-role/{role}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetUsersByRole(string role)
        {
            try
            {
                if (role != "admin" && role != "teacher")
                {
                    return BadRequest(new ApiResponse<IEnumerable<UserDto>>
                    {
                        Success = false,
                        Message = "Invalid role. Must be 'admin' or 'teacher'."
                    });
                }

                var users = await _userRepository.GetByRoleAsync(role);

                var userDtos = users.Select(u => new UserDto
                {
                    Id = u.Id.ToString(),
                    Email = u.Email,
                    DisplayName = u.DisplayName,
                    Role = u.Role,
                    EmailVerified = u.EmailVerified
                });

                return Ok(new ApiResponse<IEnumerable<UserDto>>
                {
                    Success = true,
                    Message = $"Users with role '{role}' retrieved successfully",
                    Data = userDtos
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users by role");
                return StatusCode(500, new ApiResponse<IEnumerable<UserDto>>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving users - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUser(Guid id)
        {
            try
            {
                var deleted = await _userRepository.DeleteAsync(id);

                if (!deleted)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "User deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"An error occurred while deleting user - {ex.InnerException?.Message ?? ex.Message}"
                });
            }
        }
    }
}
