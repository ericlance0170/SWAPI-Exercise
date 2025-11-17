using Microsoft.EntityFrameworkCore;

public class AppDbContext: DbContext
{
    public DbSet<Starship> Starships { get; set; } = null!;
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
    protected void onModelCreation(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Starship>(b =>
        {
           b.HasKey(e => e.Id);
           b.Property(e => e. PilotsJson).HasColumnType("TEXT"); 
           b.Property(e => e. FilmsJson).HasColumnType("TEXT"); 
        });
    }
}