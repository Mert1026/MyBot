using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBotApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedModelsData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Parents",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "BornDate",
                table: "Parents",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Parents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "JoinTime",
                table: "Parents",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "BornDate",
                table: "Members",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Parents");

            migrationBuilder.DropColumn(
                name: "BornDate",
                table: "Parents");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Parents");

            migrationBuilder.DropColumn(
                name: "JoinTime",
                table: "Parents");

            migrationBuilder.DropColumn(
                name: "BornDate",
                table: "Members");
        }
    }
}
