var mlb_games_today_url = "http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1"
var baseball_teams_url = "https://statsapi.mlb.com/api/v1/teams"

function get_mlb_teams() {
    var mlb_teams = [];
    const teams_json = JSON.parse(httpGet(baseball_teams_url));
    for (var team of teams_json["teams"]) {
        if (team["league"]["name"] == "American League" || team["league"]["name"] == "National League") {
            mlb_teams.push(team["name"]);
        }
    }

    return mlb_teams
}

function get_team_record(team) {
    const games_json = JSON.parse(httpGet(mlb_games_today_url));
    for (var game of games_json["dates"][0]["games"]) {
        if (game["teams"]["away"]["team"]["name"] == team) {
            return `${game["teams"]["away"]["leagueRecord"]["wins"]}-${game["teams"]["away"]["leagueRecord"]["losses"]}`
        }
        if (game["teams"]["home"]["team"]["name"] == team) {
            return `${game["teams"]["home"]["leagueRecord"]["wins"]}-${game["teams"]["home"]["leagueRecord"]["losses"]}`
        }
    }

    return null;
}

function get_game_information(team) {
    const games_json = JSON.parse(httpGet(mlb_games_today_url));
    var key_game = null;
    for (var game of games_json["dates"][0]["games"]) {
        if (game["teams"]["away"]["team"]["name"] == team || game["teams"]["home"]["team"]["name"] == team) {
            key_game = game;
        }
    }
    if (key_game == null)
        return null;

    return {oponent: key_game["teams"]["away"]["team"]["name"] == team 
                ? key_game["teams"]["home"]["team"]["name"] : key_game["teams"]["away"]["team"]["name"],
            home: key_game["teams"]["home"]["team"]["name"] == team,
            time: key_game["gameDate"]
            }
}