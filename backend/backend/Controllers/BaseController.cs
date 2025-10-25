using backend.Models;
using backend.NewFolder;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        private readonly IApiService _apiService;
        private readonly IUrlHelperService _urlHelperService;
        private readonly ApiSettings _apiSettings;


        public BaseController(IApiService apiService, IUrlHelperService urlHelperService, IOptions<ApiSettings> apiSettings)
        {
            _apiService = apiService;
            _urlHelperService = urlHelperService;
            _apiSettings = apiSettings.Value;
        }

        [HttpGet("episode")]
        public async Task<IActionResult> GetEpisode([FromQuery] int page)
        {

            string consulta = "episode";

            if (page != 0)
            {
                consulta = "episode?page=" + page;
            }

            var data = await _apiService.GetAsync<object>(consulta);
            string baseUrl = _apiSettings.BaseUrl;

            var urls = _urlHelperService.GenerarUrlsPaginacion(data.Info, baseUrl, page);

            var infoActualizada = new Info
            {
                Count = data.Info.Count,
                Pages = data.Info.Pages,
                Next = urls.Next,
                Prev = urls.Prev
            };

            return Ok(new EpisodeResponse
            {
                Info = infoActualizada,
                Results = data.Results
            });
        }


    }
}