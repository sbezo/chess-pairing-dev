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
    let ind1 = lookupPlayerIndex(player1)
    let ind2 = lookupPlayerIndex(player2)
    let table = document.getElementById("crossTable");
    let cell = table.rows[ind1 + 1].cells[ind2 + 1];
    cell.innerText = result;
    let reverseCell = table.rows[ind2 + 1].cells[ind1 + 1];
    if (result === "0.5") {
        reverseCell.innerText = result;
    } else {
        reverseCell.innerText = (result + 1) % 2;
    }
}
