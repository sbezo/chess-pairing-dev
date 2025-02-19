function generateCrossTable() {
    let table = document.getElementById("crossTable");

    // Create the header row
    let headerRow = table.insertRow();
    headerRow.insertCell().outerHTML = "<th></th>"; // Empty top-left corner
    players.forEach(player => {
        let th = document.createElement("th");
        th.textContent = player.name;
        headerRow.appendChild(th);
    });

    // Create rows for players
    players.forEach((player, rowIndex) => {
        let row = table.insertRow();
        let nameCell = row.insertCell();
        nameCell.textContent = player.name; // Player name in the first column
        nameCell.style.fontWeight = "bold";

        players.forEach((opponent, colIndex) => {
            let cell = row.insertCell();
            if (rowIndex === colIndex) {
                cell.classList.add("empty"); // Empty cell for self-match
                cell.textContent = "X";
            } else {
                cell.textContent = "-"; // Placeholder for match results
            }
        });
    });
}

function lookupPlayerIndex(name) {
    // return index of requested player
    return players.findIndex(player => player.name === name);
}

function updateCrosstable(player1, player2, result) {
    // two coresponding fields in the table are updated
    let ind1 = lookupPlayerIndex(player1)
    let ind2 = lookupPlayerIndex(player2)
    let table = document.getElementById("crossTable");
    let cell = table.rows[ind1 + 1].cells[ind2 + 1];
    cell.innerText = result;
    let reverseCell = table.rows[ind2 + 1].cells[ind1 + 1];
    if (result == "0.5") {
        reverseCell.innerText = result;
    } else {
        reverseCell.innerText = (result + 1) % 2;
    }
}

function saveResults() {
    console.log('Saving rounds:', rounds);
    const jsonContent = JSON.stringify(rounds);
    const blob = new Blob([jsonContent], { type: "application/json" }); //vytvori binarny objekt, ktory bude obsahovat json data
    const url = URL.createObjectURL(blob); //vytvori temporrary URL pre tento objekt
    const link = document.createElement("a"); //vytvori anchor element, ktory bude pouzity na ulozenie Blob contentu

    link.href = url;
    link.download = "results.json";
    document.body.appendChild(link); //vlozi link do body dokumentu, neskor sa nan programom klikne
    link.click(); //simuluje click to anchor element
    document.body.removeChild(link); // odstrani element z body dokumentu
    URL.revokeObjectURL(url); // Clean up the URL object
}

function loadResults(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        try {
            const loadedRounds = JSON.parse(text); // Parse the JSON content
            rounds = loadedRounds; // Save results to the rounds variable
            console.log('Loaded rounds:', rounds);
            clearExistingResults(); // Clear existing results in pairing tabs
            generateCrossTable(); // Generate empty cross table
            showLoadedResults(); // Show the loaded results
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };
    reader.readAsText(file);
}

function clearExistingResults() {
    const roundTabs = document.getElementById("roundTabs");
    const roundContents = document.getElementById("roundContents");

    // Clear existing round tabs and contents
    roundTabs.innerHTML = "";
    roundContents.innerHTML = "";
}

function showLoadedResults() {
    // Recreate round tabs and contents based on loaded rounds data
    for (let i = 1; i <= rounds.length; i++) {
        createRoundTab(i);
    }

    // Update the result values based on the loaded rounds data
    rounds.forEach((round, roundIndex) => {
        round.forEach((pair, pairIndex) => {
            let result = rounds[roundIndex][pairIndex][2].player1Score.toString();            
            console.log("roundIndex:", roundIndex, "pairIndex:", pairIndex, "result:", result, 'typeof:', typeof result);
            let fullResult;
            if (result == "1") {
                fullResult = "1-0";
            } else if (result == "0") {
                fullResult = "0-1";
            } else if (result == "0.5") {
                fullResult = "0.5-0.5";
            } else {
                fullResult = "";
            }
            console.log("fullResult:", fullResult);
            let selectElement = document.querySelector(`#round${roundIndex + 1} select[onchange="updateResult(${roundIndex}, ${pairIndex}, this.value)"]`);
            if (selectElement) {
                selectElement.value = fullResult;
            }
            updateCrosstable(rounds[roundIndex][pairIndex][0].name, rounds[roundIndex][pairIndex][1].name, result)
        });
    });

    // Make round 1 active tab
    openRound(1);
}