using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StockDataAPI.Dtos;

public class UpdateProfileDto
{
    public string Email { get; set; }
    public string PolygonApiKey { get; set; }
    public bool SetRequestLimit { get; set; }
}