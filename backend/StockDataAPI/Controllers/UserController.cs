using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockDataAPI.Data;
using StockDataAPI.Dtos;
using StockDataAPI.Services;
using System.Security.Claims;

namespace StockDataAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ApplicationDBContext _context;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ApplicationDBContext context, ILogger<UsersController> logger)
    {
        _userService = userService;
        _context = context;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegistrationDto userRegistrationDto)
    {
        try
        {
            var user = await _userService.RegisterUser(userRegistrationDto);
            return Ok(user);
        }
        catch (Exception ex)
        {
            // Log the exception
            _logger.LogError(ex, "Registration failed");
            return StatusCode(500, "Internal server error");
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto userLoginDto)
    {
        var user = await _userService.AuthenticateUser(userLoginDto);

        if (user == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(new 
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Token = user.Token
        });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.Name));
        var user = await _userService.GetUserById(userId);

        if (user == null)
        {
            return NotFound();
        }

        var userProfileDto = new UpdateProfileDto
        {
            Email = user.Email,
            PolygonApiKey = user.PolygonApiKey,
            SetRequestLimit = user.SetRequestLimit
        };

        return Ok(userProfileDto);
    }

    [HttpPost("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(int.Parse(userId));
        if (user == null)
        {
            return NotFound();
        }

        user.Email = updateProfileDto.Email;
        user.PolygonApiKey = updateProfileDto.PolygonApiKey;
        user.SetRequestLimit = updateProfileDto.SetRequestLimit; // Update the new property

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpGet("stocks")]
    public async Task<IActionResult> GetStockList()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
        if (userIdClaim == null)
        {
            return Unauthorized("User ID claim not found in token.");
        }

        var userId = int.Parse(userIdClaim.Value);
        var user = await _userService.GetUserById(userId);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        return Ok(user.StockList);
    }

    [HttpPost("stocks")]
    public async Task<IActionResult> UpdateStockList([FromBody] UpdateStockListDto updateStockListDto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(updateStockListDto.StockList))
            {
                return BadRequest("Stock list cannot be empty.");
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found in token.");
            }

            var userId = int.Parse(userIdClaim.Value);
            await _userService.UpdateStockList(userId, updateStockListDto.StockList);

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

}
