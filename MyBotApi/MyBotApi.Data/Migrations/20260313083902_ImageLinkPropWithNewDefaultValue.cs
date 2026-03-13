using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBotApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class ImageLinkPropWithNewDefaultValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImageLink",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImageLink",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "https://cdn-icons-png.flaticon.com/512/847/847969.png");
        }
    }
}
