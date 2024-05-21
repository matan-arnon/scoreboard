var nba_teams_url = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams";

function get_nba_teams() {
    var nba_teams = [];
    const teams_json = JSON.parse(httpGet(nba_teams_url));
    for (var team of teams_json["sports"][0]["leagues"][0]["teams"]) {
        nba_teams.push(team["team"]["displayName"]);
    }

    return nba_teams
}