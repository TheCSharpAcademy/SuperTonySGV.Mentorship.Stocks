using Microsoft.EntityFrameworkCore;
using StockDataAPI.Models;

namespace StockDataAPI.Data;

public class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => new { u.Username, u.Email })
            .IsUnique();
    }

}
