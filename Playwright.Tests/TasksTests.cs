using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class TasksTests : PageTest
{
    private string siteUrl = TestContext.Parameters.Get("webAppUrl", "Web app url not found!");    
     
    [Test]
    public async Task HasTitle()
    {
        await Page.GotoAsync(siteUrl);

        // Expect a title "to contain" a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("Local Task List"));
    }  

    [Test]
    public async Task EditTask()
    {
        var givenEditedTaskName = "Edit playwright tests";

        await Page.GotoAsync(siteUrl);

        var testTask = await AddNewTask();

        await Page.GetByText(testTask).ClickAsync();
        await Page.GetByRole(AriaRole.Textbox).ClickAsync();
        await Page.GetByRole(AriaRole.Textbox).FillAsync(givenEditedTaskName);
        await Page.GetByRole(AriaRole.Textbox).PressAsync("Enter");

        await Expect(Page.GetByText(givenEditedTaskName)).ToBeVisibleAsync();
    }

    [Test]
    public async Task SetDescriptionForDefaultTask()
    {
        var givenTaskDescription = "Today i have added my first playwright tests, which already identified a bug in my code.";

        await Page.GotoAsync(siteUrl);

        var testTask = await AddNewTask();
                
        await Page.GetByRole(AriaRole.Listitem).Filter(new() { HasText = testTask })
            .GetByTestId("EastIcon")
            .ClickAsync();
        
        await Page.Locator(".ql-editor").FillAsync(givenTaskDescription);
        await Expect(Page.GetByText(givenTaskDescription)).ToBeVisibleAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Save" }).ClickAsync();

        await Page.GetByRole(AriaRole.Listitem).Filter(new() { HasText = testTask })
            .GetByTestId("EastIcon")
            .ClickAsync();

        await Expect(Page.GetByText(givenTaskDescription)).ToBeVisibleAsync();
    }

    [SetUp]
    public async Task Setup()
    {        
        await Context.Tracing.StartAsync(new()
        {
            Title = $"{TestContext.CurrentContext.Test.ClassName}.{TestContext.CurrentContext.Test.Name}",
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    [TearDown]
    public async Task TearDown()
    {
        await Context.Tracing.StopAsync(new()
        {
            Path = Path.Combine(
                TestContext.CurrentContext.WorkDirectory,
                "playwright-traces",
                $"{TestContext.CurrentContext.Test.ClassName}.{TestContext.CurrentContext.Test.Name}.zip"
            )
        });
    }

    private async Task<string> AddNewTask() {
        var givenNewTaskName = "Add playwright tests" + Guid.NewGuid().ToString();        

        await Page.GetByRole(AriaRole.Main).GetByRole(AriaRole.Button).First.ClickAsync();
        await Page.GetByRole(AriaRole.Main).GetByRole(AriaRole.Textbox).ClickAsync();
        await Page.GetByRole(AriaRole.Main).GetByRole(AriaRole.Textbox).FillAsync(givenNewTaskName);
        await Page.GetByRole(AriaRole.Main).GetByRole(AriaRole.Textbox).PressAsync("Enter");        
        await Expect(Page.GetByText(givenNewTaskName)).ToBeVisibleAsync();

        return givenNewTaskName;
    }
}