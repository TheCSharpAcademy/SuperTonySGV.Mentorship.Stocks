using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StockDataAPI.Data;
using StockDataAPI.Dtos;
using StockDataAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StockDataAPI.Services;

public interface IUserService
{
    Task<User> RegisterUser(UserRegistrationDto userRegistrationDto);
    Task<User> AuthenticateUser(UserLoginDto userLoginDto);
    Task<User> GetUserById(int userId);
    Task<bool> UpdateUserProfile(int userId, UpdateProfileDto updateProfileDto);
    Task UpdateStockList(int userId, string stockList);

}

public class UserService : IUserService
{
    private readonly ApplicationDBContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IConfiguration _configuration;

    public UserService(ApplicationDBContext context, IPasswordHasher<User> passwordHasher, IConfiguration configuration)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    public async Task<User> RegisterUser(UserRegistrationDto userRegistrationDto)
    {
        var user = new User
        {
            Username = userRegistrationDto.Username,
            Email = userRegistrationDto.Email,
            PasswordHash = _passwordHasher.HashPassword(null, userRegistrationDto.Password),
            PolygonApiKey = userRegistrationDto.PolygonApiKey,
            SetRequestLimit = true,
            StockList = string.Empty
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, userRegistrationDto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User> AuthenticateUser(UserLoginDto userLoginDto)
    {
        var user = new User();
        
        try
        {
            user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userLoginDto.Email);

            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userLoginDto.Password) != PasswordVerificationResult.Success)
            {
                return null; // Authentication failed
            }

            // Authentication successful, generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Name, user.Id.ToString())
            }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user;
        } catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        return user;
    }

    public async Task<User> GetUserById(int userId)
    {
        return await _context.Users.FindAsync(userId);
    }

    public async Task<bool> UpdateUserProfile(int userId, UpdateProfileDto userProfileDto)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return false;
        }

        user.Email = userProfileDto.Email;
        user.PolygonApiKey = userProfileDto.PolygonApiKey;
        user.SetRequestLimit = userProfileDto.SetRequestLimit;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task UpdateStockList(int userId, string stockList)
    {
        var user = await GetUserById(userId);
        if (user != null)
        {
            user.StockList = stockList;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
