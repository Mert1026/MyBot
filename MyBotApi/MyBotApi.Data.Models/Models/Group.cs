using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models
{
    public class Group
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ImageLink { get; set; }

        [Column(TypeName = "timestamptz")]
        public DateTimeOffset CreatedAt { get; set; }
        public string StartAsHour { get; set; } = null!;
        public string EndAsHour { get; set; } = null!;
        public int MembersCount { get; set; }
        public int MaxMembers { get; set; }
        public string Location { get; set; } = null!;
        public int MinAge { get; set; }
        public int MaxAge { get; set; } 
        public ICollection<Member> Members { get; set; }
        public User User { get; set; }
        public Guid UserId { get; set; }
        public bool IsDeleted { get; set; }

    }
}
