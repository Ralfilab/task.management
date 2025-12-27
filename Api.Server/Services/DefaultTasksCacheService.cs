using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace Api.Server.Services
{
    public class DefaultTasksCacheService
    {
        private readonly string _cacheFilePath;
        private readonly TimeSpan _cacheExpiration = TimeSpan.FromDays(7);
        private readonly IWebHostEnvironment _environment;

        public DefaultTasksCacheService(IWebHostEnvironment environment)
        {
            _environment = environment;
            
            // Store cache in a Data folder within the application directory
            // This ensures persistence across IIS restarts
            var dataDirectory = Path.Combine(_environment.ContentRootPath, "Data");
            if (!Directory.Exists(dataDirectory))
            {
                Directory.CreateDirectory(dataDirectory);
            }
            
            _cacheFilePath = Path.Combine(dataDirectory, "default-tasks-cache.json");
        }

        public async Task<string[]?> GetCachedTasksAsync()
        {
            if (!File.Exists(_cacheFilePath))
            {
                return null;
            }

            try
            {
                var jsonContent = await File.ReadAllTextAsync(_cacheFilePath);
                var cacheData = JsonSerializer.Deserialize<CacheData>(jsonContent);
                
                if (cacheData?.Tasks == null || cacheData.Tasks.Length == 0)
                {
                    return null;
                }

                return cacheData.Tasks;
            }
            catch
            {
                // If cache file is corrupted, return null to trigger refresh
                return null;
            }
        }

        public async Task SaveTasksAsync(string[] tasks)
        {
            try
            {
                var cacheData = new CacheData
                {
                    Tasks = tasks,
                    CachedAt = DateTime.UtcNow
                };

                var jsonContent = JsonSerializer.Serialize(cacheData, new JsonSerializerOptions
                {
                    WriteIndented = true
                });

                await File.WriteAllTextAsync(_cacheFilePath, jsonContent);
            }
            catch
            {
                // Silently fail if we can't write cache - not critical
            }
        }

        public bool IsCacheValid()
        {
            if (!File.Exists(_cacheFilePath))
            {
                return false;
            }

            try
            {
                var fileInfo = new FileInfo(_cacheFilePath);
                var age = DateTime.UtcNow - fileInfo.LastWriteTimeUtc;
                return age < _cacheExpiration;
            }
            catch
            {
                return false;
            }
        }

        private class CacheData
        {
            public string[] Tasks { get; set; } = Array.Empty<string>();
            public DateTime CachedAt { get; set; }
        }
    }
}

