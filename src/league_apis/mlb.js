var base_url = "https://statsapi.mlb.com"

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

function get_record_from_team_item(team_json) {
    return `${team_json["leagueRecord"]["wins"]}-${team_json["leagueRecord"]["losses"]}`
}

function get_name_from_team_item(team_json) {
    return team_json["team"]["name"]
}

function get_team_record(team) {
    const games_json = JSON.parse(httpGet(mlb_games_today_url));
    for (var game of games_json["dates"][0]["games"]) {
        if (get_name_from_team_item(game["teams"]["away"]) == team) {
            return get_record_from_team_item(game["teams"]["away"]);
        }
        if (get_name_from_team_item(game["teams"]["home"]) == team) {
            return get_record_from_team_item(game["teams"]["home"]);
        }
    }

    return null;
}

function get_game_information(team) {
    const games_json = JSON.parse(httpGet(mlb_games_today_url));
    var key_game = null;
    for (var game of games_json["dates"][0]["games"]) {
        if (get_name_from_team_item(game["teams"]["away"]) == team || get_name_from_team_item(game["teams"]["home"]) == team) {
            key_game = game;
        }
    }
    if (key_game == null)
        return null;
    var home_team = key_game["teams"]["home"]["team"]["name"] == team;
    if (key_game["status"]["codedGameState"] == "I") {
        return {
            oponent: home_team 
                ? get_name_from_team_item(key_game["teams"]["away"]) : get_name_from_team_item(key_game["teams"]["home"]),
            home: home_team,
            oponent_record: get_record_from_team_item(home_team ? key_game["teams"]["away"] : key_game["teams"]["home"]),
            time: key_game["gameDate"],
            game_status: key_game["status"]["codedGameState"], 
            live_info: get_live_game_information(key_game)
        }
    }
    if (key_game["status"]["codedGameState"] == "O" || key_game["status"]["codedGameState"] == "F") {
        return {
            oponent: home_team 
                ? get_name_from_team_item(key_game["teams"]["away"]) : get_name_from_team_item(key_game["teams"]["home"]),
            home: home_team,
            oponent_record: get_record_from_team_item(home_team ? key_game["teams"]["away"] : key_game["teams"]["home"]),
            final_info: get_final_game_information(key_game),
            game_status: key_game["status"]["codedGameState"]
        }
    }
    return {
        oponent: home_team 
            ? get_name_from_team_item(key_game["teams"]["away"]) : get_name_from_team_item(key_game["teams"]["home"]),
        home: home_team,
        oponent_record: get_record_from_team_item(home_team ? key_game["teams"]["away"] : key_game["teams"]["home"]),
        time: key_game["gameDate"],
        game_status: key_game["status"]["codedGameState"]
    }
}

function get_live_game_information(game) {
    const liveData = JSON.parse(httpGet(base_url + game["link"]))["liveData"]
    const linescore = liveData["linescore"];

    return {
        inning: linescore["currentInningOrdinal"],
        isTop: linescore["isTopInning"],
        outs: liveData["plays"]["currentPlay"]["count"]["outs"],
        home: {
            runs: linescore["teams"]["home"]["runs"],
            hits: linescore["teams"]["home"]["hits"],
            errors: linescore["teams"]["home"]["errors"],
            LOB: linescore["teams"]["home"]["leftOnBase"]
          },
          away: {
            runs: linescore["teams"]["away"]["runs"],
            hits: linescore["teams"]["away"]["hits"],
            errors: linescore["teams"]["away"]["errors"],
            LOB: linescore["teams"]["away"]["leftOnBase"]
          }
    }
}

function get_final_game_information(game) {
    const liveData = JSON.parse(httpGet(base_url + game["link"]))["liveData"]
    const linescore = liveData["linescore"];

    return {
        home: {
            runs: linescore["teams"]["home"]["runs"],
            hits: linescore["teams"]["home"]["hits"],
            errors: linescore["teams"]["home"]["errors"],
            LOB: linescore["teams"]["home"]["leftOnBase"]
          },
          away: {
            runs: linescore["teams"]["away"]["runs"],
            hits: linescore["teams"]["away"]["hits"],
            errors: linescore["teams"]["away"]["errors"],
            LOB: linescore["teams"]["away"]["leftOnBase"]
          }
    }
}