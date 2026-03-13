using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models.DTOs.MemberDTOs
{
    public class MemberUpdateDto
    {
        public string MemberId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string BornDate { get; set; }
        public string JoinTime { get; set; }
        public string ParentId { get; set; }
        public string Description { get; set; }
        public string GroupId { get; set; }
        public string ApplicationFormId { get; set; }
    }
}
