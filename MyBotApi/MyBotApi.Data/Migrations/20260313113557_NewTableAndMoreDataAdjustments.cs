using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBotApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class NewTableAndMoreDataAdjustments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BornDate",
                table: "Parents");

            migrationBuilder.CreateTable(
                name: "SMSHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: true),
                    Message = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SentAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW() AT TIME ZONE 'UTC'"),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SMSHistory", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SMSHistory");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "BornDate",
                table: "Parents",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }
    }
}
