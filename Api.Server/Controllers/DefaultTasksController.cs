using Microsoft.AspNetCore.Mvc;
using Api.Server.Services;

namespace Api.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DefaultTasksController : ControllerBase
    {
        private readonly DefaultTasksService _defaultTasksService;

        public DefaultTasksController(DefaultTasksService defaultTasksService)
        {
            _defaultTasksService = defaultTasksService;
        }

        [HttpGet(Name = "DefaultTasks")]
        public async Task<string[]> Get()
        {
            return await _defaultTasksService.GetDefaultTasksAsync();
        }
    }
}