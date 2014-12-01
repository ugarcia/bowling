/**
 * Self-invoking function for preserving scope.
 */
(function (Bowling) {

    /**
     * Self-invoking function for static private variables.
     */
    var UI = (function() {

        /**
         * Private static variables (defaults).
         */
        var defaultFrames = 10;


        /**
         * Constructor. Overrides defaults if provided.
         */
        function UI(numFrames) {
            this.numFrames = numFrames || defaultFrames;
        }


        /**
         * Prototype.
         */
        UI.prototype = {

            /**
             * Add Base UI.
             */
            addBaseUI: function() {
                
                // Local variables.
                var th, txt,i, j;

                // Loop over all frames.
                for (i=0, j=this.numFrames; i<j; i++) {

                    // Create frame headers into table.
                    th = document.createElement("th");
                    txt = document.createTextNode(i+1);
                    th.appendChild(txt);
                    document.querySelector(".bowling-scores thead tr").appendChild(th);
                }

                // Return this object.
                return this;
            },


            /**
             * Add Player UI.
             */
            addPlayerUI: function(numPlayer) {
                
                // Local variables.
                var table, itd1, itd2, itd3, itr1, itr2, td, tr,txt, i, j;

                // Create user entries.
                tr = document.createElement("tr");
                td = document.createElement("td");
                txt = document.createTextNode(numPlayer);
                td.appendChild(txt);
                tr.appendChild(td);

                // Loop over all frames.
                for (i=0, j=this.numFrames; i<j; i++) {

                    // Create frame/player cell.
                    td = document.createElement("td");

                    // Create frame/player table.
                    table = document.createElement("table");

                    // Append shot cells.
                    itr1 = document.createElement('tr');
                    itd1 = document.createElement('td');
                    itd2 = document.createElement('td');
                    itr1.appendChild(itd1);
                    itr1.appendChild(itd2);
                    table.appendChild(itr1);

                    // Append frame score cell.
                    itr2 = document.createElement('tr');
                    itd3 = document.createElement('td');
                    itd3.setAttribute('colspan', 2);
                    itr2.appendChild(itd3);
                    table.appendChild(itr2);

                    // Append frame/player table to cell.
                    td.appendChild(table);

                    // Append frame cell to player row.
                    tr.appendChild(td);
                }

                // Append player rows to table body.
                document.querySelector(".bowling-scores tbody").appendChild(tr);

                // Return this object.
                return this;
            },


            /**
             * Update Player UI.
             */
            updatePlayerUI: function(player) {
                
                // Get player, frame, shot numbers/instances, DOM elements ....
                var p = player.numPlayer-1,
                      f = player.currFrame-2,
                      frame = player.frames[f],
                      s = player.frames[f].currShot-2,
                      shot = player.frames[f].shots[s],
                      playerEl = document.querySelectorAll('.bowling-scores > tbody > tr')[p],
                      frameEl = playerEl.querySelectorAll('td table')[f],
                      shotEl = frameEl.querySelectorAll('tr:first-child > td')[s],
                      scoreEl = frameEl.querySelector('tr:last-child > td'),
                      shotText = document.createTextNode(shot.score);

                // Check if missing shotEl, so it would be the extra one.
                if (!shotEl) {

                  // Create a new cell for extra shot.
                  var shotsRow = frameEl.querySelector('tr:first-child');
                        shotEl = document.createElement('td');

                  // Append cell to row.
                  shotsRow.appendChild(shotEl);

                  // Span another cell the frame score.
                  scoreEl.setAttribute('colspan', 3);
                }

                // Append shot score text to its element.
                shotEl.appendChild(shotText);

                // Update frame score with shot.
                this.updateFrameScoreUI(scoreEl, player.getScore(frame.numFrame));

                // Look into previous frames here.
                // Check if at least a previous one.
                if (player.currFrame > 2) {

                    // Get frame and DOM element.
                    var pf = player.currFrame-3,
                          prevFrame = player.frames[pf],
                          prevFrameEl = playerEl.querySelectorAll('td table')[pf],
                          prevScoreEl = prevFrameEl.querySelector('tr:last-child > td');

                    // Update previous frame score with shot.
                    this.updateFrameScoreUI(prevScoreEl, player.getScore(prevFrame.numFrame));

                    // Now check if a pre-previous one.
                    if (player.currFrame > 3) {

                        // Get frame and DOM element.
                        pf = player.currFrame-4;
                        prevFrame = player.frames[pf];
                        prevFrameEl = playerEl.querySelectorAll('td table')[pf];
                        prevScoreEl = prevFrameEl.querySelector('tr:last-child > td');

                        // Update pre-previous frame score with shot.
                        this.updateFrameScoreUI(prevScoreEl, player.getScore(prevFrame.numFrame));
                    }
                }

                // Return this object.
                return this;
            },

            /**
             * Update Player UI.
             */
            updateFrameScoreUI: function(el, score) {

                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
                var scoreText = document.createTextNode(score);
                el.appendChild(scoreText);

                // Return this object.
                return this;
            }
        };


        // Return constructor.
        return UI;

    })();

    // Assign definition into namespace.
    Bowling.UI = UI;

})(this.Bowling = this.Bowling || {});