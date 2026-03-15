using System;

namespace MyBotApi.Data.Models.Models.DTOs.ParentDTOs
{
    public class RecordPaymentDto
    {
        public Guid ParentId { get; set; }
        public double AmountPaid { get; set; }
        public int MonthsAdded { get; set; }
        public DateTimeOffset NewPayedUntil { get; set; }
    }
}
