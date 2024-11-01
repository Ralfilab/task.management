using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class TasksTests : PageTest
{
    private static string siteUrl = "https://localhost:5173";
    private static string defaultTaskName = "Sample Item";

    [Test]
    public async Task HasTitle()
    {
        await Page.GotoAsync(siteUrl);

        // Expect a title "to contain" a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("To-Do List"));
    }

    [Test]
    public async Task HasDefaultTask()
    {
        await Page.GotoAsync(siteUrl);        

        // Expects page to have a paragraph with Sample Item text.
        await Expect(Page.GetByText(new Regex(defaultTaskName))).ToBeVisibleAsync();
    }

    [Test]
    public async Task AddNewTask()
    {
        var givenNewTaskName = "Add playwright tests";

        await Page.GotoAsync(siteUrl);        

        await Page.GetByRole(AriaRole.Button).First.ClickAsync();
        await Page.GetByRole(AriaRole.Textbox).FillAsync(givenNewTaskName);        
        await Page.GetByRole(AriaRole.Textbox).PressAsync("Enter");
        await Page.GetByRole(AriaRole.Main).ClickAsync();
        await Expect(Page.GetByText(givenNewTaskName)).ToBeVisibleAsync();        
    }

    [Test]
    public async Task EditDefaultTask()
    {
        var givenEditedTaskName = "Edit playwright tests";

        await Page.GotoAsync(siteUrl);

        await Page.GetByText(defaultTaskName).ClickAsync();
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

        await Page.GetByRole(AriaRole.Button).Nth(2).ClickAsync();        
        await Page.Locator(".ql-editor").FillAsync(givenTaskDescription);
        await Expect(Page.GetByText(givenTaskDescription)).ToBeVisibleAsync();

        await Page.GetByLabel("close").ClickAsync();

        await Page.GetByRole(AriaRole.Main).ClickAsync();

        await Page.GetByRole(AriaRole.Button).Nth(2).ClickAsync();

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
}