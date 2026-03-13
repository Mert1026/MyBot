using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models
{
    public class SMSModel
    {
        public Guid Id { get; set; }
        public Guid? ParentId { get; set; }
        public Guid? MemberId { get; set; }
        public string Message { get; set; }
        public DateTimeOffset SentAt { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsDeleted { get; set; }
    }
}
