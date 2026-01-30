using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;
using MyBot.GCommon;

namespace MyBot.Data.Models.Models
{
    public class Applications
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(ValidationConstraints.Applications.ParentFirstNameMaxLength)]
        public string ParentFirstName { get; set; }

        [Required]
        [MaxLength(ValidationConstraints.Applications.ParentLastNameMaxLength)]
        public string ParentLastName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(ValidationConstraints.Applications.ParentFirstNameMaxLength)]
        public string ParentEmail { get; set; }

        [Required]
        [MaxLength(ValidationConstraints.Applications.ParentPhoneMaxLength)]
        public string ParentPhone { get; set; }

        [Required]
        [MaxLength(ValidationConstraints.Applications.ChildNameMaxLength)]
        public string ChildName { get; set; }

        // TimestampZ in supabase!!
        [Required]
        public DateTimeOffset ChildBirthDate { get; set; }

        [Required]
        [DefaultValue(ValidationConstraints.Applications.IsReviewedDefaultValue)]
        public bool isReviewed { get; set; }

        [Required]
        [DefaultValue(ValidationConstraints.Applications.IsDeletedDefaultValue)]
        public bool isDeleted { get; set; }
    }
}
