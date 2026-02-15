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
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTimeOffset JoinTime { get; set; }
        public string GroupId { get; set; }
        public bool IsDeleted { get; set; }
        public bool Status { get; set; }
    }
}
