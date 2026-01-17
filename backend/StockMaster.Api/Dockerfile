# Stage 1: Build using .NET 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["StockMaster.Api.csproj", "./"]
RUN dotnet restore "./StockMaster.Api.csproj"

# Copy the rest of the code and publish
COPY . .
RUN dotnet publish "StockMaster.Api.csproj" -c Release -o /out

# Stage 2: Runtime using ASP.NET 8
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Expose port 80 (standard for Azure App Service)
EXPOSE 80
ENTRYPOINT ["dotnet", "StockMaster.Api.dll"]