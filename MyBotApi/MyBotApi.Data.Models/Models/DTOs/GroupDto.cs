using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models.DTOs
{
    public class GroupDto
    {
        public string Name { get; set; }
        public string ImageLink { get; set; }
        public string Description { get; set; }
        public string StartAsHour { get; set; }
        public string EndAsHour { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        public string Location { get; set; }
        public int MembersCount { get; set; }
        public int MaxMembers { get; set; }
        public string DayOfWeek { get; set; }
        public string UserId { get; set; }
    }
}
