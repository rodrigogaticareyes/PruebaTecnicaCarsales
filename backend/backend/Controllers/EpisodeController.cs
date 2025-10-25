using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EpisodeController : ControllerBase
    {
        private readonly ICharacterService _characterService;

        public EpisodeController(ICharacterService characterService)
        {
            _characterService = characterService;
        }

        [HttpGet("{id}/characters")]
        public async Task<IActionResult> GetCharactersByEpisode(int id)
        {
            var result = await _characterService.GetCharactersByEpisodeAsync(id);
            if (result == null)
                return NotFound(new { Message = "Episodio no encontrado" });

            return Ok(result);
        }
    }
}