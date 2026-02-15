FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MyBotApi/MyBotApi.csproj MyBotApi/
RUN dotnet restore MyBotApi/MyBotApi.csproj

COPY . .
WORKDIR /src/MyBotApi
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:$PORT

ENTRYPOINT ["dotnet", "MyBotApi.dll"]
