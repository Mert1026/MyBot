using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBot.Data.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ParentFirstName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ParentLastName = table.Column<string>(type: "character varying(70)", maxLength: 70, nullable: false),
                    ParentEmail = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ParentPhone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ChildName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ChildBirthDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    isReviewed = table.Column<bool>(type: "boolean", nullable: false),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupName = table.Column<string>(type: "character varying(70)", maxLength: 70, nullable: false),
                    Description = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    isActive = table.Column<bool>(type: "boolean", nullable: false),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "Groups");
        }
    }
}
