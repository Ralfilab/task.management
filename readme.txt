Install: (https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/iis/?view=aspnetcore-8.0)
1) Install default IIS
2) Download and install:
https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-aspnetcore-8.0.8-windows-hosting-bundle-installer
3) Setup SSL Cert
https://www.win-acme.com/




Playwright integration tests debug mode:

Enable debug mode in .net env.
$env:PWDEBUG=1

Run all tests
dotnet test

Run only selected test:
dotnet test --filter "NameOfATest"

