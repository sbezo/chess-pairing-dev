let players = []; // Store input data
let rounds = []; // Store rounds data

function addToTable() {
    let name = document.getElementById("name").value;
    let Elo = document.getElementById("Elo").value;
    if (!Elo) {
        Elo = 1400; // Default Elo value
    }
    if (name && Elo) {
        let table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
        let newRow = table.insertRow();

        let nameCell = newRow.insertCell(0);
        let EloCell = newRow.insertCell(1);
        let actionCell = newRow.insertCell(2);

        nameCell.textContent = name;
        EloCell.textContent = Elo;
        actionCell.innerHTML = '<button onclick="deleteRow(this)">Delete</button>';

        // Store in variable
        players.push({ name: name, Elo: Number(Elo) });

        // Clear input fields
        document.getElementById("name").value = "";
        document.getElementById("Elo").value = "";

    } else {
        alert("Please enter both name and Elo.");
    }
}

function deleteRow(button) {
    let row = button.parentNode.parentNode;
    let rowIndex = row.rowIndex - 1; // Adjust for header row
    players.splice(rowIndex, 1); // Remove from players array
    row.parentNode.removeChild(row); // Remove row from table

}

function sortPlayers() {
    players.sort((a, b) => b.Elo - a.Elo); // Sort players by Elo in descending order
    updateTable();
}

function randomizePlayers() {
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }
    updateTable();
}

function clearTable() {
    let table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear all rows
    players = []; // Clear players array
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Name,Elo\n";
    players.forEach(player => {
        csvContent += `${player.name},${player.Elo}\n`;
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "players.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link); // Clean up
}

function importFromCSV(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').slice(1); // Skip header row
        rows.forEach(row => {
            const [name, Elo] = row.split(',');
            if (name && Elo) {
                players.push({ name: name.trim(), Elo: Number(Elo.trim()) });
            }
        });
        updateTable();
    };
    reader.readAsText(file);
}

function lockAndPairing() {
    // Disable input fields
    document.getElementById("name").disabled = true;
    document.getElementById("Elo").disabled = true;

    // Disable buttons
    document.querySelectorAll('.button-container button').forEach(button => {
        button.disabled = true;
    });

    // Optionally, add a visual indication that the table is locked
    document.getElementById("dataTable").classList.add('locked');
    
    // Add a "Bye" player if the number of players is odd
    if (players.length % 2 !== 0) {
        players.push({ name: "Bye", Elo: 1400 });
    }
    updateTable();

    // Generate pairings
    rounds = generateBergerPairings(players);
    //createRoundTab();

    // Create tabs for all rounds
    for (let i = 1; i <= (rounds.length - 1); i++) {
        createRoundTab(i);
    }

    // Make round 1 active tab
    openRound(1);

    // Generate empty cross table
    generateCrossTable();
}

function createRoundTab(roundNumber) {
    const roundTabs = document.getElementById("roundTabs");
    const roundContents = document.getElementById("roundContents");

    // Create round tab
    const roundTab = document.createElement("div");
    roundTab.className = "round-tab";
    roundTab.innerText = `Round ${roundNumber}`;
    roundTab.onclick = () => openRound(roundNumber); // Use captured round number
    roundTabs.appendChild(roundTab);

    // Create round content
    const roundContent = document.createElement("div");
    roundContent.className = "round-content";
    roundContent.id = `round${roundNumber}`;
    roundContent.innerHTML = `<h3>Round ${roundNumber}</h3>`;
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Result</th>
            </tr>
        </thead>
        <tbody>
            ${rounds[roundNumber - 1].map((pair, index) => `
                <tr>
                    <td>${pair[0].name}</td>
                    <td>${pair[1].name}</td>
                    <td>
                        <select onchange="updateResult(${roundNumber - 1}, ${index}, this.value)">
                            <option value="" selected> - </option>
                            <option value="1-0">1-0</option>
                            <option value="0-1">0-1</option>
                            <option value="0.5-0.5">Draw</option>
                        </select>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    roundContent.appendChild(table);
    roundContents.appendChild(roundContent);
    
    openRound(roundNumber);
}

function updateResult(roundIndex, pairIndex, result) {
    const [player1Score, player2Score] = result.split('-').map(Number);
    rounds[roundIndex][pairIndex].result = { player1Score, player2Score };
    updateCrosstable(rounds[roundIndex][pairIndex][0].name, rounds[roundIndex][pairIndex][1].name, player1Score);
}

function openRound(roundNumber) {
    const roundTabs = document.querySelectorAll(".round-tab");
    const roundContents = document.querySelectorAll(".round-content");

    roundTabs.forEach(tab => tab.classList.remove("active"));
    roundContents.forEach(content => content.classList.remove("active"));

    document.querySelector(`.round-tab:nth-child(${roundNumber})`).classList.add("active");
    document.getElementById(`round${roundNumber}`).classList.add("active");
}

function updateTable() {
    let table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear existing rows

    players.forEach(player => {
        let newRow = table.insertRow();

        let nameCell = newRow.insertCell(0);
        let EloCell = newRow.insertCell(1);
        let actionCell = newRow.insertCell(2);

        nameCell.textContent = player.name;
        EloCell.textContent = player.Elo;
        actionCell.innerHTML = '<button onclick="deleteRow(this)">Delete</button>';
    });
}

function openTab(tabId) {
    let tabs = document.querySelectorAll('.tab-content');
    let tabButtons = document.querySelectorAll('.tab');

    tabs.forEach(tab => tab.classList.remove('active'));
    tabButtons.forEach(tab => tab.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-container .tab[onclick="openTab('${tabId}')"]`).classList.add('active');
}

function importDemo() {
    players = [
        {"name": "Magnus", "Elo": 2833},
        {"name": "Fabiano", "Elo": 2803},
        {"name": "Hikaru", "Elo": 2802},
        {"name": "Arjun", "Elo": 2801},
        {"name": "Gukesh", "Elo": 2777},
        {"name": "Nodirbek", "Elo": 2766},
        {"name": "Alireza", "Elo": 2760},
        {"name": "Yi", "Elo": 2755},
        {"name": "Ian", "Elo": 2754},
        {"name": "Anand", "Elo": 2750}
    ]
    updateTable();
}