using backend.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace backend.Services
{
    public class UrlHelperService : IUrlHelperService
    {
        public (string? Prev, string? Next) GenerarUrlsPaginacion(Info info, string baseUrl, int page)
        {

            string? urlPrev = info?.Prev != null ? $"{baseUrl}episode?pagina={page - 1}" : null;

            string? urlNext = info?.Next != null ? $"{baseUrl}episode?pagina={page + 1}" : null;

            return (urlPrev, urlNext);
        }
    }
}
