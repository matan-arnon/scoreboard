const nbaTeamsUrl = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams";

function getNbaTeams() {
    let nbaTeams = [];
    const teamsJson = JSON.parse(httpGet(nbaTeamsUrl));
    for (const team of teamsJson["sports"][0]["leagues"][0]["teams"]) {
        nbaTeams.push(team["team"]["displayName"]);
    }

    return nbaTeams
}