using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockDataAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserModelAddRequestLimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SetRequestLimit",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SetRequestLimit",
                table: "Users");
        }
    }
}
