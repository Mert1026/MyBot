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
                entity.Property(e => e.Role).IsRequired().HasMaxLength(RoleMaxLength);
                entity.Property(e => e.NhostUserId);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(NameMaxLength);
                entity.Property(e => e.JoinTime).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.EndTime).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.Description).HasMaxLength(DescriptionMaxLength);
                entity.Property(e => e.Status).HasDefaultValue(true);
                entity.HasOne(e => e.Group)
                    .WithMany(g => g.Members)
                    .HasForeignKey(e => e.GroupId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            });

            modelBuilder.Entity<Group>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(DescriptionMaxLength);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(DescriptionMaxLength);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.Property(e => e.StartAsHour).IsRequired().HasMaxLength(HourMaxLength);
                entity.Property(e => e.EndAsHour).IsRequired().HasMaxLength(HourMaxLength);
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
        }
    }
}
