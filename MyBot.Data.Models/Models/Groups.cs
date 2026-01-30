using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;
using MyBot.GCommon;

namespace MyBot.Data.Models.Models
{
    public class Groups
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(ValidationConstraints.Groups.GroupNameMaxLength)]
        public string GroupName { get; set; }

        [Required]
        [MaxLength(ValidationConstraints.Groups.DescriptionMaxLength)]
        public string Description { get; set; }

        // TimestampZ in supabase!!
        [Required]
        public DateTimeOffset CreatedAt { get; set; }

        [Required]
        [DefaultValue(ValidationConstraints.Groups.IsActiveDefaultValue)]
        public bool isActive { get; set; }

        [Required]
        [DefaultValue(ValidationConstraints.Groups.IsDeletedDefaultValue)]
        public bool isDeleted { get; set; }
    }
}
