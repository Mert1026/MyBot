using MyBotApi.Data.Models.Models.NHostModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Services.AuthServices.IAuthservices
{
    public interface INhostAuthService
    {
        Task<AuthResponse> SignUpAsync(SignUpRequest request);
        Task<AuthResponse> SignInAsync(SignInRequest request);
        Task<bool> VerifyTokenAsync(string token);
    }
}
