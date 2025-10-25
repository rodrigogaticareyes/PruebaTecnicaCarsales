using backend.External;
using backend.Models;

namespace backend.Services
{
    public class CharacterService : ICharacterService
    {
        private readonly IExternalApi _client;
        private readonly ILogger<CharacterService> _logger;

        public CharacterService(IExternalApi client, ILogger<CharacterService> logger)
        {
            _client = client;
            _logger = logger;
        }

        public async Task<EpisodioData?> GetCharactersByEpisodeAsync(int episodeId)
        {
            var episode = await _client.GetEpisodeAsync(episodeId);
            if (episode == null)
            {
                _logger.LogWarning("Episodio {Id} no encontrado.", episodeId);
                return null;
            }

            var characters = new List<Character>();

            // Paralelizar la carga de personajes
            var tasks = episode.Characters.Select(async url =>
            {
                var character = await _client.GetCharacterByUrlAsync(url);
                if (character != null)
                    characters.Add(character);
            });

            await Task.WhenAll(tasks);

            return new EpisodioData
            {
                EpisodeId = episode.Id,
                EpisodeName = episode.Name,
                Characters = characters
            };
        }
    }

}
