using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MyBotApi.Data.Models;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Models.Models.DTOs;
using MyBotApi.Data.Models.Models.NHostModels;
using MyBotApi.Data.Repositories.IRepositories;
using MyBotApi.Services.AuthServices.IAuthservices;
using System.Net.Http.Json;
using System.Text.Json;

namespace MyBotApi.Services.AuthServices
{
    public class NhostAuthService : INhostAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly string _nhostAuthUrl;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<NhostAuthService> _logger;

        public NhostAuthService(
            IConfiguration configuration,
            IUserRepository userRepository,
            ILogger<NhostAuthService> logger)
        {
            _httpClient = new HttpClient();
            _nhostAuthUrl = configuration["NHost:AuthUrl"] ??
                "https://jrpixlslkjplvkxzqsmb.auth.eu-central-1.nhost.run/v1";
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<AuthResponse> SignUpAsync(SignUpRequest request)
        {
            try
            {
                if (await _userRepository.ExistsAsync(request.Email))
                {
                    throw new Exception("User already exists in the system");
                }

                var nhostRequest = new
                {
                    email = request.Email,
                    password = request.Password,
                    options = new
                    {
                        displayName = request.DisplayName,
                        // Store role in metadata
                        metadata = new
                        {
                            role = request.Role
                        },
                        // CRITICAL: Set default role and allowed roles for Hasura
                        // Without these, the role won't be in the JWT token!
                        defaultRole = request.Role,
                        allowedRoles = new[] { request.Role }
                    }
                };

                _logger.LogInformation("Signing up user {Email} with role: {Role}",
                    request.Email, request.Role);

                var response = await _httpClient.PostAsJsonAsync(
                    $"{_nhostAuthUrl}/signup/email-password",
                    nhostRequest
                );

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Nhost signup failed: {Error}", errorContent);
                    throw new Exception($"Sign up failed: {errorContent}");
                }

                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Nhost signup successful for {Email}", request.Email);

                var nhostResponse = JsonSerializer.Deserialize<NhostSignUpResponse>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                var user = new User
                {
                    Email = request.Email,
                    DisplayName = request.DisplayName,
                    Role = request.Role,
                    NhostUserId = nhostResponse?.Session?.User?.Id,
                    EmailVerified = nhostResponse?.Session?.User?.EmailVerified ?? false,
                    CreatedAt = DateTime.UtcNow
                };

                await _userRepository.CreateAsync(user);
                _logger.LogInformation("User created in database: {Email} with role: {Role}",
                    request.Email, request.Role);

                return new AuthResponse
                {
                    //TODO - error handlinga opravi
                    AccessToken = nhostResponse?.Session?.AccessToken,
                    RefreshToken = nhostResponse?.Session?.RefreshToken,
                    User = new UserDto
                    {
                        Id = user.Id.ToString(),
                        Email = user.Email,
                        DisplayName = user.DisplayName,
                        Role = user.Role,
                        EmailVerified = user.EmailVerified
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sign up error for {Email}", request.Email);
                throw new Exception($"Sign up error: {ex.Message}", ex);
            }
        }

        public async Task<AuthResponse> SignInAsync(SignInRequest request)
        {
            try
            {
                var nhostRequest = new
                {
                    email = request.Email,
                    password = request.Password
                };

                _logger.LogInformation("Signing in user: {Email}", request.Email);

                var response = await _httpClient.PostAsJsonAsync(
                    $"{_nhostAuthUrl}/signin/email-password",
                    nhostRequest
                );

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Nhost signin failed: {Error}", errorContent);
                    throw new Exception($"Sign in failed: {errorContent}");
                }

                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Sign in response received");

                var nhostResponse = JsonSerializer.Deserialize<NhostSignInResponse>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                var user = await _userRepository.GetByEmailAsync(request.Email);

                if (user == null)
                {
                    string role = "teacher";
                    if (nhostResponse?.Session?.User?.Metadata != null)
                    {
                        var metadata = nhostResponse.Session.User.Metadata as JsonElement?;
                        if (metadata.HasValue && metadata.Value.TryGetProperty("role", out var roleProperty))
                        {
                            role = roleProperty.GetString() ?? "teacher";
                        }
                    }

                    user = new User
                    {
                        Email = request.Email,
                        DisplayName = nhostResponse?.Session?.User?.DisplayName,
                        Role = role,
                        NhostUserId = nhostResponse?.Session?.User?.Id,
                        EmailVerified = nhostResponse?.Session?.User?.EmailVerified ?? false,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _userRepository.CreateAsync(user);
                    _logger.LogInformation("Created user in database: {Email} with role: {Role}",
                        request.Email, role);
                }
                else
                {
                    user.EmailVerified = nhostResponse?.Session?.User?.EmailVerified ?? false;
                    user.NhostUserId = nhostResponse?.Session?.User?.Id;
                    if (!string.IsNullOrEmpty(nhostResponse?.Session?.User?.DisplayName))
                    {
                        user.DisplayName = nhostResponse.Session.User.DisplayName;
                    }
                    await _userRepository.UpdateAsync(user);
                }

                _logger.LogInformation("Sign in successful for user: {Email} with role: {Role}",
                    request.Email, user.Role);

                return new AuthResponse
                {
                    //TODO - error handlinga opravi
                    AccessToken = nhostResponse?.Session?.AccessToken,
                    RefreshToken = nhostResponse?.Session?.RefreshToken,
                    User = new UserDto
                    {
                        Id = user.Id.ToString(),
                        Email = user.Email,
                        DisplayName = user.DisplayName,
                        Role = user.Role,
                        EmailVerified = user.EmailVerified
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sign in error");
                throw new Exception($"Sign in error: {ex.Message}", ex);
            }
        }


        //Malik 'snipet'
        public async Task<bool> VerifyTokenAsync(string token)
        {
            try
            {
                return !string.IsNullOrEmpty(token);
            }
            catch
            {
                return false;
            }
        }

        
    }
}