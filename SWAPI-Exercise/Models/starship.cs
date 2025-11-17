using System.Text.Json;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json.Linq;

public class Starship
{
    public int Id;
    public string? Name;
    public string? Model;
    public string? Manufacturer;
    public string? CostInCredits;
    public string? Length;
    public string? MaxAtmospheringSpeed;
    public string? Crew;
    public string? Passengers;
    public string? CargoCapacity;
    public string? Consumables;
    public string? HyperdriveRating;
    public string? MGLT;
    public string? StarshipClass;
    public string? PilotsJson;

    [NotMapped]
    public List<string> Pilots
    {
        get => string.IsNullOrEmpty(PilotsJson) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(PilotsJson)!;
        set => PilotsJson = JsonSerializer.Serialize(value ?? new List<string>());
    }
    public string? FilmsJson;

    [NotMapped]
    public List<string> Films
    {
        get => string.IsNullOrEmpty(FilmsJson) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(FilmsJson)!;
        set => FilmsJson = JsonSerializer.Serialize(value ?? new List<string>());
    }
    public DateTime? Created;
    public DateTime? Edited;
    public string? Url;

    public Starship() {}

    public Starship(JObject json)
    {
        Name = json["name"]?.ToString();
        Model = json["model"]?.ToString();
        Manufacturer = json["manufacturer"]?.ToString();
        CostInCredits = json["cost_in_credits"]?.ToString();
        Length = json["length"]?.ToString();
        MaxAtmospheringSpeed = json["max_atmosphering_speed"]?.ToString();
        Crew = json["crew"]?.ToString();
        Passengers = json["passengers"]?.ToString();
        CargoCapacity = json["cargo_capacity"]?.ToString();
        Consumables = json["consumables"]?.ToString();
        HyperdriveRating = json["hyperdrive_rating"]?.ToString();
        MGLT = json["MGLT"]?.ToString();
        StarshipClass = json["starship_class"]?.ToString();
        
        Pilots = json["pilots"]?.ToObject<List<string>>() ?? new List<string>();
        Films = json["Films"]?.ToObject<List<string>>() ?? new List<string>();
        
        Created = DateTime.TryParse(json["created"]?.ToString(), out var createdDateTime) ? createdDateTime : (DateTime?)null;
        Edited = DateTime.TryParse(json["edited"]?.ToString(), out var editedDateTime) ? editedDateTime : (DateTime?)null;
        Url = json["url"]?.ToString();
    }

    public void updateShip(Starship updatedShip)
    {
        Name = updatedShip.Name;
        Model = updatedShip.Model;
        Manufacturer = updatedShip.Manufacturer;
        CostInCredits = updatedShip.CostInCredits;
        Length = updatedShip.Length;
        MaxAtmospheringSpeed = updatedShip.MaxAtmospheringSpeed;
        Crew = updatedShip.Crew;
        Passengers = updatedShip.Passengers;
        HyperdriveRating = updatedShip.HyperdriveRating;
        MGLT = updatedShip.MGLT;
        StarshipClass = updatedShip.StarshipClass;
        Pilots = updatedShip.Pilots;
        Films = updatedShip.Films;
        Edited = updatedShip.Edited;
    }
}