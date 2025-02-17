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