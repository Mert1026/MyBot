using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Models.Models
{
    public class Parent
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int ChildrenCount { get; set; }
        public double GivenPrice { get; set; }
        public ICollection<Member> Kids { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset PayedUntil { get; set; }
    }
}
