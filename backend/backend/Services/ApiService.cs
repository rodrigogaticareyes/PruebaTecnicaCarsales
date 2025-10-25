using backend.External;
using backend.Models;
using backend.Services;
using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace backend.NewFolder
{
    public class ApiService: IApiService
    {

        private readonly IExternalApi _external;

        public ApiService(IExternalApi externalClient)
        {
            _external = externalClient;
        }
 
        async Task<EpisodeResponse?> IApiService.GetAsync<T>(string endpoint)
        {
            var response = await _external.ObtenerEpisodiosExternosAsync(endpoint);
                          
            return response;
        }
    }
}
