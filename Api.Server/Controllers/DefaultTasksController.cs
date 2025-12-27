using Microsoft.AspNetCore.Mvc;

namespace Api.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DefaultTasksController : ControllerBase
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

        [HttpGet(Name = "DefaultTasks")]
        public string[] Get()
        {
            return DefaultTaskTitles;
        }
    }
}