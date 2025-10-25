using backend;
using backend.External;
using backend.NewFolder;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddScoped<IApiService, ApiService>();
builder.Services.AddScoped<IUrlHelperService, UrlHelperService>();
builder.Services.AddHttpClient<IExternalApi, ExternalApi>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["ApiSettings:ExternalApiUrl"]);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});
// Servicios
builder.Services.AddScoped<ICharacterService, CharacterService>();

builder.Services.AddRazorPages();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCors", policy =>
    {
        policy.WithOrigins("*")                    // Orígenes permitidos
              .AllowAnyHeader()                    // Permite cualquier header
              .AllowAnyMethod();                   // Permite GET, POST, PUT, DELETE, etc.
    });
});

builder.Services.Configure<ApiSettings>(builder.Configuration.GetSection("ApiSettings"));
var apiSettings = builder.Configuration.GetSection("ApiSettings").Get<ApiSettings>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}


// Habilitar CORS
app.UseCors("PoliticaCors");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();

app.Run();