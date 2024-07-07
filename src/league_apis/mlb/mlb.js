const baseUrl = "https://statsapi.mlb.com";

const mlbGamesUrl = `${baseUrl}/api/v1/schedule/games/?sportId=1`;
const mlbTeamsUrl = `${baseUrl}/api/v1/teams`;

function getMlbTeams() {
    let mlbTeams = [];
    const teamsJson = JSON.parse(httpGet(mlbTeamsUrl));
    for (const team of teamsJson["teams"]) {
        if (team["league"]["name"] === "American League" || team["league"]["name"] === "National League") {
            mlbTeams.push(team["name"]);
        }
    }

    return mlbTeams
}

function getGameFromJson(team, gameJson) {
    for (const game of gameJson["dates"][0]["games"]) {
        if (getNameFromTeamItem(game["teams"]["away"]) === team || getNameFromTeamItem(game["teams"]["home"]) === team) {
            return game;
        }
    }

    return null;
}

function getNextGame(team) {
    const currentGame = getGameFromJson(team, JSON.parse(httpGet(mlbGamesUrl)));
    if(currentGame != null) {
        return currentGame;
    }

    const nextDate = new Date();
    for (let i=0; i<5; i++){
        nextDate.setDate(nextDate.getDate()+1);
        const nextDateString = nextDate.toISOString().split('T')[0];
        const game = getGameFromJson(team,
            JSON.parse(httpGet(`${mlbGamesUrl}&startDate=${nextDateString}&endDate=${nextDateString}`)));
        if (game != null) {
            return game;
        }
    }

    return null;
}

function getRecordFromTeamItem(teamJson) {
    return `${teamJson["leagueRecord"]["wins"]}-${teamJson["leagueRecord"]["losses"]}`
}

function getNameFromTeamItem(teamJson) {
    return teamJson["team"]["name"]
}

function getTeamRecord(team) {
    const game = getNextGame(team);
    if (game == null) {
        return null;
    }
    if (getNameFromTeamItem(game["teams"]["away"]) === team) {
        return getRecordFromTeamItem(game["teams"]["away"]);
    }
    if (getNameFromTeamItem(game["teams"]["home"]) === team) {
        return getRecordFromTeamItem(game["teams"]["home"]);
    }
}

function getGameInformation(team) {
    const keyGame = getNextGame(team);
    if (keyGame == null)
        return null;
    const homeTeam = keyGame["teams"]["home"]["team"]["name"] === team;
    let gameInfo = {
        opponent: homeTeam ? getNameFromTeamItem(keyGame["teams"]["away"]) : getNameFromTeamItem(keyGame["teams"]["home"]),
        home: homeTeam,
        gameStatus: keyGame["status"]["codedGameState"],
        opponentRecord: getRecordFromTeamItem(homeTeam ? keyGame["teams"]["away"] : keyGame["teams"]["home"]),
    };
    if (keyGame["status"]["codedGameState"] === "I") {
        gameInfo.liveInfo = getLiveGameInformation(keyGame);
        gameInfo.time = keyGame["gameDate"];
    } else if (keyGame["status"]["codedGameState"] === "O" || keyGame["status"]["codedGameState"] === "F") {
        gameInfo.finalInfo = getFinalGameInformation(keyGame);
    } else {
        gameInfo.time = keyGame["gameDate"];
    }
    return gameInfo;
}

function getLiveGameInformation(game) {
    const liveData = JSON.parse(httpGet(baseUrl + game["link"]))["liveData"]
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

function getFinalGameInformation(game) {
    const liveData = JSON.parse(httpGet(baseUrl + game["link"]))["liveData"]
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

function getIconPath(team) {
    return `mlb/${iconPaths[team]}`;
}