using System.ComponentModel.DataAnnotations;

namespace StockDataAPI.Dtos
{
    public class UserLoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
