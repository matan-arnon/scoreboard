const nbaTeamsUrl = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams";

function getNbaTeams() {
    return getTeams(nbaTeamsUrl);
}