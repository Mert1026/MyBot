using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models.NHostModels
{
    public class NhostUser
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? DisplayName { get; set; }
        public bool EmailVerified { get; set; }
        public object? Metadata { get; set; }
    }
}
