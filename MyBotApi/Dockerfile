FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MyBot/MyBotApi/MyBotApi/MyBotApi.csproj MyBot/MyBotApi/MyBotApi/

RUN dotnet restore MyBot/MyBotApi/MyBotApi/MyBotApi.csproj

COPY . .

WORKDIR /src/MyBot/MyBotApi/MyBotApi
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:$PORT

EXPOSE 8080

ENTRYPOINT ["dotnet", "MyBotApi.dll"]
