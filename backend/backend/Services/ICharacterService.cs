using backend.Models;

namespace backend.Services
{
    public interface ICharacterService
    {
        Task<EpisodioData?> GetCharactersByEpisodeAsync(int episodeId);
    }

}
