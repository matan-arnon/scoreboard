function prepareInningIcon(isTop) {
    let inningIcon = document.createElement("i");
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
    let outsIcon = document.createElement("i");
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

function prepareTeamIcon(team) {
    let img = document.createElement('img');
    img.src = `../icons/${get_icon_path(team)}`;
    return img;
}

window.onload = function() {
    document.querySelector('#go-to-options').addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
    });

    chrome.storage.sync.get({favoriteMlbTeam:"nope", favoriteNbaTeam:"nope"}, (items) =>{
        if (items.favoriteMlbTeam !== "nope") {
            let mlb_team = document.getElementById("fav-mlb-team");
            mlb_team.textContent = `${items.favoriteMlbTeam} (${get_team_record(items.favoriteMlbTeam)})`;
            console.log("fav team", items.favoriteMlbTeam);
            const todays_game= get_game_information(items.favoriteMlbTeam);
            const location = todays_game.home ? "vs" : "@"
            mlb_team.textContent += ` ${location} ${todays_game.opponent} (${todays_game.opponent_record})`;

            const team_icon = prepareTeamIcon(items.favoriteMlbTeam);
            mlb_team.insertAdjacentElement("afterend", team_icon);
            const opponent_icon = prepareTeamIcon(todays_game.opponent);
            team_icon.insertAdjacentElement("afterend", opponent_icon);

            if (todays_game.game_status === "S" || todays_game.game_status === "P") {
                const start_time = document.getElementById("gameday");
                start_time.textContent = `Start time: ${new Date(todays_game.time).toLocaleString()}`;
            }
            if (todays_game.game_status === "I") {
                const live_info = document.getElementById("gameday");
                if (todays_game.home) {
                    live_info.textContent = `${todays_game.live_info.home.runs} - ${todays_game.live_info.away.runs}`;
                }
                else {
                    live_info.textContent = `${todays_game.live_info.away.runs} - ${todays_game.live_info.home.runs}`;
                }
                let inningIcon = prepareInningIcon(todays_game.live_info.isTop);
                let inningOuts = document.getElementById("inning-outs")
                inningOuts.textContent = todays_game.live_info.inning;
                inningOuts.insertAdjacentElement("beforeend", inningIcon);
                let outsIcon;
                for (let i = 0; i < todays_game.live_info.outs; i++) {
                    outsIcon = prepareOutsIcon(true);
                    inningIcon.insertAdjacentElement("beforeend", outsIcon);
                }
                for (let i = 0; i < 3 - todays_game.live_info.outs; i++) {
                    if (todays_game.live_info.outs > 0) {
                        outsIcon.insertAdjacentElement("beforeend", prepareOutsIcon(false));
                    }
                    else {
                        inningOuts.insertAdjacentElement("beforeend", prepareOutsIcon(false));
                    }
                }
            }
            if (todays_game.game_status === "O" || todays_game.game_status === "F") {
                let score_element = document.getElementById("gameday");
                let inningOuts = document.getElementById("inning-outs")
                inningOuts.textContent = "Final"
                let final_score;
                if (todays_game.home) {
                    final_score = `${todays_game.final_info.home.runs} - ${todays_game.final_info.away.runs}`;
                }
                else {
                    final_score = `${todays_game.final_info.away.runs} - ${todays_game.final_info.home.runs}`;
                }
                score_element.textContent = final_score;
            }
        }
        if (items.favoriteNbaTeam !== "nope") {
            let nba_team_header = document.getElementById("fav-nba-team");
            nba_team_header.textContent = items.favoriteNbaTeam;
        }
    })
}