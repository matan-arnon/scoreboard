function prepareInningIcon(isTop) {
    let inningIcon = document.createElement("i");
    inningIcon.setAttribute("style", "display:inline;font-size:20px;color:black");
    inningIcon.setAttribute("class", "material-icons");
    if (isTop) {
        inningIcon.textContent = "arrowDropUp";
    }
    else {
        inningIcon.textContent = "arrowDropDown";
    }
    return inningIcon;
}

function prepareOutsIcon(isOut) {
    let outsIcon = document.createElement("i");
    outsIcon.setAttribute("style", "display:inline;font-size:15px;color:black");
    outsIcon.setAttribute("class", "material-icons");
    if (isOut) {
        outsIcon.textContent = "radioButtonChecked";
    }
    else {
        outsIcon.textContent = "radioButtonUnchecked";
    }
    return outsIcon;
}

function prepareTeamIcon(team) {
    let img = document.createElement('img');
    img.src = `../icons/${getIconPath(team)}`;
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
            let mlbTeam = document.getElementById("fav-mlb-team");
            mlbTeam.textContent = `${items.favoriteMlbTeam} (${getTeamRecord(items.favoriteMlbTeam)})`;
            console.log("fav team", items.favoriteMlbTeam);
            const todaysGame= getGameInformation(items.favoriteMlbTeam);
            const location = todaysGame.home ? "vs" : "@"
            mlbTeam.textContent += ` ${location} ${todaysGame.opponent} (${todaysGame.opponentRecord})`;

            const teamIcon = prepareTeamIcon(items.favoriteMlbTeam);
            mlbTeam.insertAdjacentElement("afterend", teamIcon);
            const opponentIcon = prepareTeamIcon(todaysGame.opponent);
            teamIcon.insertAdjacentElement("afterend", opponentIcon);

            if (todaysGame.gameStatus === "S" || todaysGame.gameStatus === "P") {
                const startTime = document.getElementById("gameday");
                startTime.textContent = `Start time: ${new Date(todaysGame.time).toLocaleString()}`;
            }
            if (todaysGame.gameStatus === "I") {
                const liveInfo = document.getElementById("gameday");
                if (todaysGame.home) {
                    liveInfo.textContent = `${todaysGame.liveInfo.home.runs} - ${todaysGame.liveInfo.away.runs}`;
                }
                else {
                    liveInfo.textContent = `${todaysGame.liveInfo.away.runs} - ${todaysGame.liveInfo.home.runs}`;
                }
                let inningIcon = prepareInningIcon(todaysGame.liveInfo.isTop);
                let inningOuts = document.getElementById("inning-outs")
                inningOuts.textContent = todaysGame.liveInfo.inning;
                inningOuts.insertAdjacentElement("beforeend", inningIcon);
                let outsIcon;
                for (let i = 0; i < todaysGame.liveInfo.outs; i++) {
                    outsIcon = prepareOutsIcon(true);
                    inningIcon.insertAdjacentElement("beforeend", outsIcon);
                }
                for (let i = 0; i < 3 - todaysGame.liveInfo.outs; i++) {
                    if (todaysGame.liveInfo.outs > 0) {
                        outsIcon.insertAdjacentElement("beforeend", prepareOutsIcon(false));
                    }
                    else {
                        inningOuts.insertAdjacentElement("beforeend", prepareOutsIcon(false));
                    }
                }
            }
            if (todaysGame.gameStatus === "O" || todaysGame.gameStatus === "F") {
                let scoreElement = document.getElementById("gameday");
                let inningOuts = document.getElementById("inning-outs")
                inningOuts.textContent = "Final"
                let finalScore;
                if (todaysGame.home) {
                    finalScore = `${todaysGame.finalInfo.home.runs} - ${todaysGame.finalInfo.away.runs}`;
                }
                else {
                    finalScore = `${todaysGame.finalInfo.away.runs} - ${todaysGame.finalInfo.home.runs}`;
                }
                scoreElement.textContent = finalScore;
            }
        }
    });
}