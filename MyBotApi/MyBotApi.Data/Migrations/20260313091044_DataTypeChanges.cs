using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBotApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class DataTypeChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_ApplicationForms_ApplicationFormId",
                table: "Members");

            migrationBuilder.AddColumn<Guid>(
                name: "ApplicationFormId",
                table: "Parents",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ApplicationFormId",
                table: "Members",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Members_ApplicationForms_ApplicationFormId",
                table: "Members",
                column: "ApplicationFormId",
                principalTable: "ApplicationForms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_ApplicationForms_ApplicationFormId",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "ApplicationFormId",
                table: "Parents");

            migrationBuilder.AlterColumn<Guid>(
                name: "ApplicationFormId",
                table: "Members",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Members_ApplicationForms_ApplicationFormId",
                table: "Members",
                column: "ApplicationFormId",
                principalTable: "ApplicationForms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
