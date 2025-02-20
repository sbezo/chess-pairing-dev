function generateBergerPairings(players) {
    const n = players.length;
    const pairings = [];
    for (let round = 1; round < n; round++) {
        const roundPairings = [];
        for (let i = 0; i < n / 2; i++) {
            const player1 = players[i];
            const player2 = players[n - 1 - i];
            roundPairings.push([player1, player2]);
        }
        players.splice(1, 0, players.pop());
        pairings.push(roundPairings);
    }
    console.log('pairing', pairings);
    console.log('players', players);
    return pairings;

}
