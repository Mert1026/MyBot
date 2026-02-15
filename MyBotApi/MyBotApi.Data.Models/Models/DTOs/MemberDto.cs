using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models.DTOs
{
    public class MemberDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string GroupId { get; set; }
    }
}
