namespace backend.Models
{
    public class EpisodioData
    {
        public int EpisodeId { get; set; }
        public string EpisodeName { get; set; } = string.Empty;
        public IEnumerable<Character> Characters { get; set; } = new List<Character>();
    }
}
