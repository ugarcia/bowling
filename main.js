/**
 * Self-invoking function for preserving scope.
 */
(function (Bowling) {

    // Set event on clicking button
    document.querySelector('.start').addEventListener('click', function(evt) {

        // Disable button until game is over.
        document.querySelector('.start').disabled = true;

        // Remove from DOM existing game.
        document.querySelector('.bowling-scores > thead').innerHTML = '<tr><th>Player</th></tr>';
        document.querySelector('.bowling-scores > tbody').innerHTML = '';

        // Instantiate the UI. And add basic stuff.
        var ui = new Bowling.UI(parseInt(document.querySelector('.num-frames').value, 10)).addBaseUI();

        // Is the game sync or async between players??
        var sync = document.querySelector('.sync').checked;

         // Instantiate a game with selected field values.
        new Bowling.Game(
            parseInt(document.querySelector('.num-players').value, 10),
            parseInt(document.querySelector('.num-frames').value, 10),
            parseInt(document.querySelector('.num-pins').value, 10),
            document.querySelector('.extra-shots').checked

        // Init, callback for every player created.
        ).init(function(numPlayer) {

            // Update UI. Add a Player row.
            ui.addPlayerUI(numPlayer);

        // Play, callback for every shot.
        }).play(sync, function(player) {

            // No player returned, game is over.
            if (!player) {
                return document.querySelector('.start').disabled = false;
            }

            // Update here Player UI, Game in scope.
            ui.updatePlayerUI(player);
        });

    }, false);

})(this.Bowling = this.Bowling || {});