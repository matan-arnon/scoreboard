function prepareInningIcon(isTop) {
    var inningIcon = document.createElement("i");
    inningIcon.setAttribute("style", "display:inline;font-size:20px;color:black");
    inningIcon.setAttribute("class", "material-icons");
    if (isTop) {
        inningIcon.textContent = "arrow_drop_up";
    }
    else {
        inningIcon.textContent = "arrow_drop_down";
    }
    return inningIcon;
}

function prepareOutsIcon(isOut) {
    var outsIcon = document.createElement("i");
    outsIcon.setAttribute("style", "display:inline;font-size:15px;color:black");
    outsIcon.setAttribute("class", "material-icons");
    if (isOut) {
        outsIcon.textContent = "radio_button_checked";
    }
    else {
        outsIcon.textContent = "radio_button_unchecked";
    }
    return outsIcon;
}

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
            if (todays_game.game_status == "I") {
                var live_info = document.getElementById("gameday");
                if (todays_game.home) {
                    var score = `${todays_game.live_info.home.runs} - ${todays_game.live_info.away.runs}`;
                    live_info.textContent = score;
                }
                else {
                    var score = `${todays_game.live_info.away.runs} - ${todays_game.live_info.home.runs}`;
                    live_info.textContent = score;
                }
                var inningIcon = prepareInningIcon(todays_game.live_info.isTop);
                var inningOuts = document.getElementById("inning-outs")
                inningOuts.textContent = todays_game.live_info.inning;
                inningOuts.insertAdjacentElement("beforeend", inningIcon);
                var outsIcon;
                for (var i = 0; i < todays_game.live_info.outs; i++) {
                    outsIcon = prepareOutsIcon(true);
                    inningIcon.insertAdjacentElement("beforeend", outsIcon);
                }
                for (var i = 0; i < 3 - todays_game.live_info.outs; i++) {
                    if (todays_game.live_info.outs > 0) {
                        outsIcon.insertAdjacentElement("beforeend", prepareOutsIcon(false));
                    }
                    else {
                        inningOuts.insertAdjacentElement("beforeend", prepareOutsIcon(false));
                    }
                }
            }
            if (todays_game.game_status == "O" || todays_game.game_status == "F") {
                var score_element = document.getElementById("gameday");
                var inningOuts = document.getElementById("inning-outs")
                inningOuts.textContent = "Final"
                if (todays_game.home) {
                    var final_score = `${todays_game.final_info.home.runs} - ${todays_game.final_info.away.runs}`;
                }
                else {
                    var final_score = `${todays_game.final_info.away.runs} - ${todays_game.final_info.home.runs}`;
                }
                score_element.textContent = final_score;
            }
        }
    })
}