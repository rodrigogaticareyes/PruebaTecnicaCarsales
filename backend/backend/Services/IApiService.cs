using backend.Models;

namespace backend.Services
{
    public interface IApiService
    {
        Task<EpisodeResponse?> GetAsync<T>(string endpoint);
    }
}
