using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models.DTOs.ParentDTOs
{
    public class ParentDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public double GivenPrice { get; set; }
        public string PayedUntil { get; set; }
        public string JoinTime { get; set; }
        public string ApplicationFormId { get; set; }
    }
}
