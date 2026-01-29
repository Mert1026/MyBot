using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace MyBot.Data
{
    internal class MyBotDBContext : DbContext
    {
        public MyBotDBContext(DbContextOptions<MyBotDBContext> options)
        : base(options)
        {

        }
    }
}
