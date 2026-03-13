using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBotApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class DataTypeChangesMainlyAgain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_Groups_GroupId",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "MembersCount",
                table: "Groups");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "SMSHistory",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "Members",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "ApplicationForms",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Members_Groups_GroupId",
                table: "Members",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_Groups_GroupId",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "SMSHistory");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "ApplicationForms");

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "Members",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MembersCount",
                table: "Groups",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Members_Groups_GroupId",
                table: "Members",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
