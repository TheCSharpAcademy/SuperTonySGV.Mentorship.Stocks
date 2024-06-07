using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockDataAPI.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string PasswordHash { get; set; }
    [Required]
    public string PolygonApiKey { get; set; }
    [NotMapped]
    public string Token { get; set; }
    public string StockList { get; set; }
    public bool SetRequestLimit { get; set; } = true;
}
