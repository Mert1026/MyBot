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
    public class Member
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;
        public string Description { get; set; }

        [Column(TypeName = "timestamptz")]
        public DateTimeOffset JoinTime { get; set; }
        public bool Status { get; set; }
        public Group Group { get; set; }
        public Guid GroupId { get; set; }
        public bool IsDeleted { get; set; }

    }
}
