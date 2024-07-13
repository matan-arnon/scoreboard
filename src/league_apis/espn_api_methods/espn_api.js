function getTeams(leagueTeamsUrl) {
    let teams = [];
    const teamsJson = JSON.parse(httpGet(leagueTeamsUrl));
    for (const team of teamsJson["sports"][0]["leagues"][0]["teams"]) {
        teams.push(team["team"]["displayName"]);
    }

    return teams
}