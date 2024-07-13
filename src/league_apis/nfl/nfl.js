const nflBaseUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/";

const nflGamesUrl = `${nflBaseUrl}/scoreboard`;
const nflTeamsUrl = `${nflBaseUrl}/teams`;

function getNflTeams() {
    return getTeams(nflTeamsUrl);
}