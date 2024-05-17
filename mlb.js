var mlb_games_today_url = "http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1"
var baseball_teams_url = "https://statsapi.mlb.com/api/v1/teams"

function get_mlb_teams() {
    var mlb_teams = [];
    var json_string = httpGet(baseball_teams_url);
    const teams_json = JSON.parse(json_string)
    for (var team of teams_json["teams"]) {
        if (team["league"]["name"] == "American League" || team["league"]["name"] == "National League") {
            mlb_teams.push(team["name"])
        }
    }

    return mlb_teams
}