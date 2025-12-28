using System.Text;
using System.Text.Json;

namespace Api.Server.Repositories
{
    public class DefaultTasksRepository
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string OllamaBaseUrl = "http://localhost:11434";
        private const string OllamaModel = "gemma3:1b";

        public DefaultTasksRepository(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string[]?> GetTasksFromOllamaAsync()
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromSeconds(30);

            var requestBody = new
            {
                model = OllamaModel,
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = "Generate 10 default task management task titles as a JSON array of strings. Return only the JSON array, no other text. Example format: [\"Task 1\", \"Task 2\", \"Task 3\"]"
                    }
                },
                stream = false
            };

            var jsonContent = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync($"{OllamaBaseUrl}/api/chat", content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var ollamaResponse = JsonSerializer.Deserialize<OllamaResponse>(responseContent, jsonOptions);

            if (ollamaResponse?.Message?.Content != null)
            {
                var taskTitlesJson = ollamaResponse.Message.Content.Trim();

                // Remove markdown code blocks if present
                if (taskTitlesJson.StartsWith("```json"))
                {
                    taskTitlesJson = taskTitlesJson.Substring(7);
                }
                if (taskTitlesJson.StartsWith("```"))
                {
                    taskTitlesJson = taskTitlesJson.Substring(3);
                }
                if (taskTitlesJson.EndsWith("```"))
                {
                    taskTitlesJson = taskTitlesJson.Substring(0, taskTitlesJson.Length - 3);
                }
                taskTitlesJson = taskTitlesJson.Trim();

                // Try to extract JSON array from the response
                var startIndex = taskTitlesJson.IndexOf('[');
                var endIndex = taskTitlesJson.LastIndexOf(']');
                if (startIndex >= 0 && endIndex > startIndex)
                {
                    taskTitlesJson = taskTitlesJson.Substring(startIndex, endIndex - startIndex + 1);
                }

                // Try to parse as JSON array
                var taskTitles = JsonSerializer.Deserialize<string[]>(taskTitlesJson);
                if (taskTitles != null && taskTitles.Length > 0)
                {
                    return taskTitles;
                }
            }

            return null;
        }

        private class OllamaResponse
        {
            public OllamaMessage? Message { get; set; }
        }

        private class OllamaMessage
        {
            public string? Content { get; set; }
        }
    }
}

