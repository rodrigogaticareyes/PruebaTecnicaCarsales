using backend.Models;

namespace backend.External
{
    public class ExternalApi : IExternalApi
    {

        private readonly HttpClient _httpClient;
        private readonly ILogger<ExternalApi> _logger;

        public ExternalApi(HttpClient httpClient, ILogger<ExternalApi> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<EpisodeResponse> ObtenerEpisodiosExternosAsync(string endpoint)
        {
            try
            {
                var response = await _httpClient.GetAsync(endpoint);

                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var episodes = System.Text.Json.JsonSerializer.Deserialize<EpisodeResponse>(json,
                    new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                return episodes ?? new EpisodeResponse();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consumir la API de episodios");
                throw;
            }
        }
        public async Task<Episode?> GetEpisodeAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"episode/{id}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var episode = System.Text.Json.JsonSerializer.Deserialize<Episode>(
                    json,
                    new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                return episode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener episodio con ID {Id}", id);
                return null;
            }
        }

        public async Task<Character?> GetCharacterByUrlAsync(string url)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var character = System.Text.Json.JsonSerializer.Deserialize<Character>(
                    json,
                    new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                return character;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener personaje desde {Url}", url);
                return null;
            }
        }
    }
}
