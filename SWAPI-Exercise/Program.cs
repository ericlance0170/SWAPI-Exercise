using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=starships.db";
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

// Add services to the container.
builder.Services.AddHttpClient<StarshipService>();

var app = builder.Build();

//Make sure we've created the database
using(var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.MapGet("/starships", async (AppDbContext db) => await db.Starships.ToListAsync());
app.MapPost("/starships", async (AppDbContext db, Starship ship) =>
{
    db.Starships.Add(ship);
    await db.SaveChangesAsync();
    return Results.Created($"/starships/{ship.Id}", ship);
});
app.MapPut("/starships/{id}", async (int id, AppDbContext db, Starship updatedShip) =>
{
   var ship = await db.Starships.FindAsync(id);
   if(ship == null)
    {
        return Results.NotFound($"I have you now!\nStarship with id {id} not found");
    }
    ship.updateShip(updatedShip);

    await db.SaveChangesAsync();
    return Results.Ok(ship);
});
app.MapDelete("/starships/{id}", async (int id, AppDbContext db) =>
{
   var ship = await db.Starships.FindAsync(id);
   if(ship == null)
    {
        return Results.NotFound($"I have you now!\nStarship with id {id} not found");
    }
    db.Starships.Remove(ship);
    await db.SaveChangesAsync();
    return Results.NoContent();    
});
app.MapGet("/api/swapi/starships", async (StarshipService service, int? page = null) =>
{
    var ships = await service.fetchStarshipListFromSwapi(page);
    return Results.Ok(ships);
});
app.MapGet("/api/swapi/starships/{id}", async (int id, StarshipService service) =>
{
    var ship = await service.fetchStarshipListFromSwapi(id);
    if(ship == null)
    {
        return Results.NotFound($"I have you now!\nStarship with id {id} not found");
    }
    return Results.Ok(ship);
});
app.MapPost("/api/swapi/starships/sync", async (AppDbContext db, StarshipService service, int? page = null) =>
{
    var swapiShips = await service.fetchStarshipListFromSwapi(page);
    int countAdded = 0;
    
    foreach(var ship in swapiShips)
    {
        if(!string.IsNullOrEmpty(ship.Url) && !db.Starships.Any(s => s.Url == ship.Url))
        {
            db.Starships.Add(ship);
            countAdded++;
        }
    }

    if(countAdded > 0)
    {
        await db.SaveChangesAsync();
    }
    return Results.Ok(new {added = countAdded, total = swapiShips.Count});
});

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();