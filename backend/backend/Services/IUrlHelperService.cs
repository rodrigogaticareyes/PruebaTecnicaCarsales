using backend.Models;

namespace backend.Services
{
    public interface IUrlHelperService
    {
        (string? Prev, string? Next) GenerarUrlsPaginacion(Info info, string baseUrl, int pagina);

    }
}
