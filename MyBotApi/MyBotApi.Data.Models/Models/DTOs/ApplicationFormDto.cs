using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models.DTOs
{
    public class ApplicationFormDto
    {
        public string ParentFirstName { get; set; }
        public string ParentLastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Location { get; set; }
    }
}
