
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
            mlb_team.textContent += ` ${location} ${todays_game.oponent} (${todays_game.oponent_record})`;
            if (todays_game.game_status == "S" || todays_game.game_status == "P") {
                var start_time = document.getElementById("gameday");
                start_time.textContent = `Start time: ${new Date(todays_game.time).toLocaleString()}`;
            }
            if (todays_game.game_status = "I") {
                var live_info = document.getElementById("gameday");
                if (todays_game.home) {
                    var score = `${todays_game.live_info.home.runs} - ${todays_game.live_info.away.runs}`;
                    live_info.textContent = score;
                }
                else {
                    var score = `${todays_game.live_info.away.runs} - ${todays_game.live_info.home.runs}\t${todays_game.live_info.inning}`;
                    live_info.textContent = score;
                }

                var icon = document.createElement("i");
                icon.setAttribute("style", "display:inline;font-size:24px;color:black");
                icon.setAttribute("class", "material-icons");
                if (todays_game.live_info.isTop) {
                    icon.textContent = "arrow_drop_up";
                }
                else {
                    icon.textContent = "arrow_drop_down";
                }
                live_info.insertAdjacentElement("beforeend", icon);
            }
        }
    })
}