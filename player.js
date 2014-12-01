/**
 * Self-invoking function for preserving scope.
 */
(function (Bowling) {

    /**
     * Self-invoking function for static private variables.
     */
    var Player = (function() {

        /**
         * Private static variables (defaults).
         */
        var defaultNumPlayer = 1,
              defaultFrames = 10,
              defaultPins = 10,
              defaultExtraShots = true;


        /**
         * Constructor. Overrides defaults if provided.
         */
        function Player(numPlayer, numFrames, numPins, extraShots) {
            this.numPlayer = numPlayer || defaultNumPlayer;
            this.numFrames = numFrames || defaultFrames;
            this.numPins = numPins || defaultPins;
            this.extraShots = extraShots !== 'undefined' ? extraShots : defaultExtraShots;
            this.currFrame = 1;
            this.frames = [];
        }


        /**
         * Prototype.
         */
        Player.prototype = {

            /**
             * Plays a single Frame.
             */
            playFrame: function(fn) {
                
                // Generate a frame.
                var frame = new Bowling.Frame(
                        this.currFrame, this.numPins, this.currFrame++ === this.numFrames && this.extraShots
                );

                // Set into collection.
                this.frames.push(frame);

                // Self - reference.
                var self = this;

                // Play it. We get callback with every shot. Scope is Frame.
                frame.play(function(score) {

                  // Update previous frames with shot score.
                  self.updateFramesScore(this.numFrame, score);

                  // Callback, if any, with player scope and frame.
                  if (fn && typeof(fn) === 'function') {
                      fn.call(self, this);
                  }
                });

                // Return this Object.
                return this;
            },


            /**
             * Updates the frames scores as a result of last shot score.
             */
            updateFramesScore: function(numFrame, score) {

                // If first frame, skip.
                if (numFrame < 2) {
                  return this;
                }

                // Reference to current frame.
                var currFrame =  this.frames[numFrame-1];

                // Reference to prev frame.
                var prevFrame =  this.frames[numFrame-2];

                // Condition for adding shot score to prev frame.
                var addToFrame =  prevFrame.isStrike() && currFrame.currShot <= 3 ||
                                                  prevFrame.isSpare() && currFrame.currShot <= 2;

                // Add to prev frame if needed.
                if (addToFrame) {
                     prevFrame.score += score;
                }

                // If second frame, skip.
                if (numFrame < 3) {
                  return this;
                }

                // Reference to prev to prev frame.
                var prevPrevFrame =  this.frames[numFrame-3];

                // Condition for adding shot score to prev frame.
                addToFrame =  prevFrame.isStrike() && prevPrevFrame.isStrike() && currFrame.currShot <= 2;

                // Add to prev frame if needed.
                if (addToFrame) {
                     prevPrevFrame.score += score;
                }

                // Return this object.
                return this;
            },


            /**
             * Get score accumulated to current/provided frame number.
             */
            getScore: function(numFrame) {

                // Init score;
                var score = 0;

                // Loop over all frames.
                for (var i=0, j=numFrame || this.currFrame-1; i<j; i++) {

                    // Sum to score.
                    score += this.frames[i].score;
                }

                // Return score.
                return score;
            }
        };


        // Return constructor.
        return Player;

    })();

    // Assign definition into namespace.
    Bowling.Player = Player;

})(this.Bowling = this.Bowling || {});