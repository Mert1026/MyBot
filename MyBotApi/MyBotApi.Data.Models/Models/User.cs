using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MyBotApi.Data.Models.Models
{
    public class User
    {
        public int Id { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string? DisplayName { get; set; }

        public string Role { get; set; } 

        public bool EmailVerified { get; set; }

        public string? NhostUserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}
