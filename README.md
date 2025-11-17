# SWAPI-Exercise

This is an ASP.NET Core MVC web application with a React frontend used for a technical interview exercise. The backend targets .NET 8 with Entity Framework Core, and the frontend uses React 18 with react-bootstrap for UI components.

## Prerequisites

- **.NET SDK 8.x** — verify with `dotnet --version` (should report `8.*`)
- **Node.js 18+** — verify with `node --version` and `npm --version`
- **Internet access** to restore NuGet and npm packages

## Project Structure

```
SWAPI-Exercise/
├── SWAPI-Exercise.csproj          # .NET project file
├── Program.cs                      # ASP.NET Core app setup
├── Controllers/                    # MVC controllers
│   └── HomeController.cs
├── Data/                           # EF Core
│   └── AppDbContext.cs
├── Models/                         # C# models
│   ├── starship.cs
│   └── ErrorViewModel.cs
├── Services/                       # Business logic
│   └── StarshipService.cs
├── Views/                          # Razor templates
├── src/                            # React/TypeScript frontend
│   ├── app.tsx
│   ├── index.tsx
│   ├── components/
│   │   ├── starshipForm.tsx
│   │   └── starshipTable.tsx
│   ├── services/
│   │   └── apiService.ts
│   └── styles/
├── package.json                    # npm dependencies
└── README.md                       # This file
```

## Backend (.NET) Setup

### Install NuGet Packages

The following packages are already added:
- `Microsoft.EntityFrameworkCore.Sqlite` (8.0.0)
- `Microsoft.EntityFrameworkCore.Tools` (8.0.0)
- `Microsoft.EntityFrameworkCore.Design` (8.0.0)
- `Newtonsoft.Json` (13.0.3)

To restore and build:

```powershell
cd SWAPI-Exercise
dotnet restore
dotnet build
```

### Run the Backend

```powershell
dotnet run
```

The ASP.NET Core app will start on `http://localhost:5000` (or the port configured in `launchSettings.json`).

### Optional: Run EF Migrations

If you modify models and want to apply migrations:

```powershell
dotnet tool install --global dotnet-ef --version 8.0.0
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Frontend (React) Setup

### Install npm Dependencies

The following packages are already in `package.json`:
- `react` (18.2.0)
- `react-bootstrap` (2.10.0)
- `bootstrap` (5.3.0)
- `axios` (1.13.2)
- Build tools: webpack, TypeScript, loaders

To install:

```powershell
cd SWAPI-Exercise
npm install
```

### Build the Frontend

```powershell
npm run build
```

This runs webpack and outputs bundled files (typically to a `dist/` or similar folder configured in webpack config).

### Development Mode (Watch)

```powershell
npm run dev
```

Webpack will watch for changes and rebuild automatically.

## Running the Full Application

### Terminal 1: Start the Backend

```powershell
cd SWAPI-Exercise
dotnet run
```

### Terminal 2: Build/Watch the Frontend

```powershell
cd SWAPI-Exercise
npm run build
# or for watch mode:
npm run dev
```

The backend serves the built React app at `http://localhost:5000`.

## Notes & Assumptions

### Backend (C#)
- **Target Framework:** net8.0
- **EF Core Version:** 8.0.0 — matches .NET 8. Installing incompatible versions (e.g., 10.x) will cause restore errors.
- **Nullable Warnings:** `Data/AppDbContext.cs` may show CS8625 (nullable reference) warnings. Use `??` operator or initialize properties to resolve.
- **IDE:** If OmniSharp shows missing assembly errors after restore, reload the VS Code window or restart the language server.

### Frontend (React/TypeScript)
- **React Bootstrap Integration:** Use `<Form.Control as="textarea">` for textarea elements (not `type="textarea"`).
- **API Service:** `src/services/apiService.ts` uses axios for HTTP calls. Configure the base URL for your backend API endpoint.
- **Unused Imports:** Remove unused imports (Button, Spinner, etc.) to clear TypeScript warnings.
- **Type Safety:** Ensure Starship model properties are non-nullable in the state initializer (use `??` for defaults).

### Database
- **SQLite:** The app uses SQLite by default. The database file will be created in the project directory (e.g., `app.db`).
- **Connection String:** Configured in `Program.cs` or `appsettings.json`. Adjust the path if needed.

## Common Issues & Fixes

| Error | Fix |
|-------|-----|
| "The type or namespace name 'EntityFrameworkCore' does not exist" | Restore NuGet: `dotnet restore` |
| Package incompatibility (NU1202) | Ensure EF Core 8.x packages match net8.0 target |
| npm packages not found | Run `npm install` in the SWAPI-Exercise folder |
| React component type errors | Use `??` for optional fields; ensure state defaults match the Starship type |
| "rows does not exist on Form.Control" | Use `as="textarea"` instead of `type="textarea"` |
| Build fails; OmniSharp errors persist | Reload VS Code window (`Ctrl+R` or Cmd+R) |

## Environment Configuration

- **.NET Environment:** Development (set in `launchSettings.json`)
- **CORS:** If frontend and backend run on different ports, enable CORS in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// In app setup:
app.UseCors("AllowFrontend");
```

## Next Steps

- **Seed Data:** Add sample starship data to the database for testing.
- **API Endpoints:** Ensure Controllers return JSON and are accessible from the React frontend.
- **Authentication:** If needed, add identity/auth middleware.
- **Testing:** Add unit tests for services and components.
- **Deployment:** Configure for production (publish .NET app, build React bundle).

---

**Last Updated:** November 16, 2025

