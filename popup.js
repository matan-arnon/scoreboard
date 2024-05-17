
window.onload = function() {
    document.querySelector('#go-to-options').addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
    });

    chrome.storage.sync.get({favoriteTeam:"nope"}, (items) =>{
        if (items.favoriteTeam != "nope") {
            var mlb_team = document.getElementById("fav-mlb-team");
            mlb_team.textContent = `${items.favoriteTeam} (${get_team_record(items.favoriteTeam)})`;
            console.log("fav team", items.favoriteTeam);
            var todays_game = get_game_information(items.favoriteTeam);
            var location = todays_game.home ? "vs" : "@"
            var game_information = `${location} ${todays_game.oponent} (${todays_game.oponent_record})`;
            var gameday = document.getElementById("gameday");
            gameday.textContent = game_information;
        }
    })
}