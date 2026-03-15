using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using MyBotApi.Data.Models.Models;
using static MyBotApi.GCommon.MainCommons;
using static MyBotApi.GCommon.Specifics.GroupSpecificCommons;
using static MyBotApi.GCommon.Specifics.UserSpecificCommons;

namespace MyBotApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<ApplicationForm> ApplicationForms { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<SMSModel> SMSHistory { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User config
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.DisplayName).HasMaxLength(NameMaxLength);
                entity.HasIndex(e => e.DisplayName).IsUnique();
                entity.Property(e => e.Role).IsRequired().HasMaxLength(RoleMaxLength);
                entity.Property(e => e.NhostUserId);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.Description).HasMaxLength(DescriptionMaxLength);
                entity.Property(e => e.ImageLink).HasDefaultValue("https://cdn-icons-png.flaticon.com/512/847/847969.png");
                entity.Property(e => e.Description).HasDefaultValue("No description!");
                entity.Property(e => e.EmailVerified).HasDefaultValue(true);//testovo
            });

            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.JoinTime).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.Description).HasMaxLength(DescriptionMaxLength);
                entity.Property(e => e.Status).HasDefaultValue(true);
                entity.Property(e => e.Age).IsRequired();
                entity.HasOne(e => e.Parent)
                    .WithMany(p => p.Kids)
                    .HasForeignKey(e => e.ParentId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            });

            modelBuilder.Entity<Group>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(DescriptionMaxLength);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Description).IsRequired().HasMaxLength(DescriptionMaxLength);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.StartAsHour).IsRequired().HasMaxLength(HourMaxLength);
                entity.Property(e => e.EndAsHour).IsRequired().HasMaxLength(HourMaxLength);
                entity.Property(e => e.MaxMembers).IsRequired();
                entity.Property(e => e.MinAge).IsRequired();
                entity.Property(e => e.MaxAge).IsRequired();
                entity.Property(e => e.Location).IsRequired();
                entity.Property(e => e.DayOfWeek).HasMaxLength(DescriptionMaxLength);
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Groups)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            });


            // RefreshToken - TODO za react compatibility
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Token).IsUnique();
                entity.Property(e => e.Token).IsRequired();

                entity.HasOne(e => e.User)
                    .WithMany(u => u.RefreshTokens)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicationForm>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ParentFirstName).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.ParentLastName).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.PhoneNumber).IsRequired();
                entity.Property(e => e.Location).IsRequired();
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            });

            modelBuilder.Entity<Parent>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.PhoneNumber).IsRequired();
                entity.Property(e => e.GivenPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPaid).HasColumnType("decimal(18,2)").HasDefaultValue(0);
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.PayedUntil).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            modelBuilder.Entity<SMSModel>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SentAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.Message).HasMaxLength(DescriptionMaxLength);//TODO
                entity.Property(e => e.PhoneNumber).IsRequired();
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            });
    }   }
}
