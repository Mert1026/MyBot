using System;

namespace MyBotApi.Data.Models.Models.DTOs
{
    public class ApplicationApprovalDto
    {
        public Guid ApplicationFormId { get; set; }
        public DateTimeOffset PaymentStartDate { get; set; }
    }
}
