using Microsoft.Extensions.Caching.Memory;

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

        private const string CacheKey = "DefaultTasks";
        private readonly TimeSpan _cacheExpiration = TimeSpan.FromDays(7);
        private readonly TimeSpan _staleThreshold = TimeSpan.FromDays(1); // Consider stale after 1 day, but still return it        

        private readonly IMemoryCache _memoryCache;
        private readonly Repositories.DefaultTasksRepository _repository;
        private readonly static SemaphoreSlim _refreshSemaphore = new SemaphoreSlim(1, 1);

        public DefaultTasksService(IMemoryCache memoryCache, Repositories.DefaultTasksRepository repository)
        {
            _memoryCache = memoryCache;
            _repository = repository;
        }

        public async Task<string[]> GetDefaultTasksAsync()
        {
            // Stale-While-Revalidate pattern: Return stale data immediately, refresh in background
            
            // Try to get cached data (even if stale)
            if (_memoryCache.TryGetValue(CacheKey, out CacheEntry? cachedEntry) && 
                cachedEntry != null && 
                cachedEntry.Tasks != null && 
                cachedEntry.Tasks.Length > 0)
            {
                // Check if cache is stale and needs refresh
                var isStale = DateTime.UtcNow - cachedEntry.CachedAt > _staleThreshold;
                
                if (isStale)
                {
                    // Trigger background refresh without blocking
                    _ = Task.Run(async () => await RefreshCacheAsync());
                }

                // Return stale data immediately
                return cachedEntry.Tasks;
            }

            // No cache exists - return default tasks immediately and trigger background refresh
            _ = Task.Run(async () => await RefreshCacheAsync());
            return DefaultTaskTitles;
        }

        private async Task RefreshCacheAsync()
        {
            // Prevent concurrent refresh operations
            if (!await _refreshSemaphore.WaitAsync(0))
            {
                return; // Another refresh is already in progress
            }

            try
            {
                // Try to get fresh data from Ollama
                try
                {
                    var taskTitles = await _repository.GetTasksFromOllamaAsync();
                    if (taskTitles != null && taskTitles.Length > 0)
                    {
                        // Save to cache with expiration
                        var cacheEntry = new CacheEntry
                        {
                            Tasks = taskTitles,
                            CachedAt = DateTime.UtcNow
                        };

                        var cacheOptions = new MemoryCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = _cacheExpiration,
                            SlidingExpiration = null // Use absolute expiration only
                        };                        
                        _memoryCache.Set(CacheKey, cacheEntry, cacheOptions);
                    }
                }
                catch (Exception)
                {
                    // If Ollama fails, silently fail - we already returned stale/default data
                    // The cache will remain unchanged
                }
            }
            finally
            {
                _refreshSemaphore.Release();
            }
        }

        private class CacheEntry
        {
            public string[] Tasks { get; set; } = Array.Empty<string>();
            public DateTime CachedAt { get; set; }
        }
    }
}

