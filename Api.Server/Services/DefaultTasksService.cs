using System.Text;
using System.Text.Json;

namespace Api.Server.Services
{
    public class DefaultTasksService
    {
        private static readonly string[] DefaultTaskTitles = new[]
        {
            "Review today's open tasks and overdue items",
            "Define the top 3 priorities for the team today",
            "Follow up on tasks currently blocked or at risk",
            "Check progress on critical bug fixes and hotfixes",
            "Review and merge pending pull requests",
            "Plan and schedule time for focused work blocks",
            "Update task statuses after team standup",
            "Capture and break down new work items from meetings",
            "Clean up old or low-priority tasks from the board",
            "Review completed tasks and add notes for retrospectives"
        };

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly DefaultTasksCacheService _cacheService;
        private const string OllamaBaseUrl = "http://localhost:11434";
        private const string OllamaModel = "gemma3:1b";

        public DefaultTasksService(IHttpClientFactory httpClientFactory, DefaultTasksCacheService cacheService)
        {
            _httpClientFactory = httpClientFactory;
            _cacheService = cacheService;
        }

        public async Task<string[]> GetDefaultTasksAsync()
        {
            // Always check cache first - if valid cache exists, return it immediately
            if (_cacheService.IsCacheValid())
            {
                var cachedTasks = await _cacheService.GetCachedTasksAsync();
                if (cachedTasks != null && cachedTasks.Length > 0)
                {
                    return cachedTasks;
                }
            }

            // Cache is missing or expired - try to get fresh data from Ollama
            try
            {
                var taskTitles = await GetTasksFromOllamaAsync();
                if (taskTitles != null && taskTitles.Length > 0)
                {
                    // Save to cache for future use
                    await _cacheService.SaveTasksAsync(taskTitles);
                    return taskTitles;
                }
            }
            catch (Exception)
            {
                // If Ollama fails, try to return cached data even if expired
                var cachedTasks = await _cacheService.GetCachedTasksAsync();
                if (cachedTasks != null && cachedTasks.Length > 0)
                {
                    return cachedTasks;
                }
            }

            // Fall back to hardcoded default tasks if everything else fails
            return DefaultTaskTitles;
        }

        private async Task<string[]?> GetTasksFromOllamaAsync()
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
            var ollamaResponse = JsonSerializer.Deserialize<OllamaResponse>(responseContent);

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

