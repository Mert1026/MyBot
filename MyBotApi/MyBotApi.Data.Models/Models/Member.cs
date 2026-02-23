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
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int Age { get; set; }
        public string Description { get; set; }

        [Column(TypeName = "timestamptz")]
        public DateTimeOffset JoinTime { get; set; }
        public bool Status { get; set; }
        public Group Group { get; set; }
        public Guid GroupId { get; set; }
        public Parent Parent { get; set; }
        public Guid ParentId { get; set; }
        public ApplicationForm ApplicationForm { get; set; }
        public Guid ApplicationFormId { get; set; }
        public bool IsDeleted { get; set; }

    }
}
