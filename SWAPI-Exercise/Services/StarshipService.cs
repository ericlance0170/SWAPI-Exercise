using System.Net.Mime;
using Newtonsoft.Json.Linq;

public class StarshipService
{
    private readonly HttpClient httpClient;

    public StarshipService(HttpClient client)
    {
        httpClient = client;
    }

    public async Task<List<Starship>> fetchStarshipListFromSwapi(int? pageNumber = null)
    {
        try
        {
            List<Starship> ships = new List<Starship>();
            string url = pageNumber.HasValue ? $"https://swapi.dev/api/starships/?page={pageNumber}" : "https://swapi.dev/api/starships";

            var response = await httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                return ships;
            }

            var content = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(content);
            var results = data["results"] as JArray;

            if(results != null)
            {
                foreach(var ship in results)
                {
                    Starship newShip = new Starship(ship as JObject ?? new JObject());
                    ships.Add(newShip);
                }
            }
            return ships;
        }
        catch(Exception e)
        {
            Console.WriteLine($"There has been a disturbance in the Force...\nError fetching starships list from SWAPI: {e.Message}");
            return new List<Starship>();
        }
    }

    public async Task<Starship?> fetchStarshipsById(int id)
    {
        try
        {
            string url = $"https://swapi.dev/api/starships/{id}";
            var response = await httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var result = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(result);
            return new Starship(data);
        }
        catch(Exception e)
        {
            Console.WriteLine($"I've got a bad feeling about this... \nError fetching starship {id} from SWAPI: {e.Message}");
            return null;
        }
    }
}