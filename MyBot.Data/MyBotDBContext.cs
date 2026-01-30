using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using MyBot.Data.Models.Models;

namespace MyBot.Data
{
    public class MyBotDBContext : DbContext
    {

        public virtual DbSet<Applications> Applications { get; set; } = null!;
        public virtual DbSet<Groups> Groups { get; set; } = null!;

        public MyBotDBContext(DbContextOptions<MyBotDBContext> options)
        : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }


    }
}
