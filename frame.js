/**
 * Self-invoking function for preserving scope.
 */
(function (Bowling) {

    /**
     * Self-invoking function for static private variables.
     */
    var Frame = (function() {

        /**
         * Private static variables (defaults).
         */
        var defaultNumFrame = 1,
              defaultPins = 10,
              defaultExtraShots = true,
              defaultShots = 2;


        /**
         * Constructor. Overrides defaults if provided.
         */
        function Frame(numFrame, numPins, extraShots) {
            this.numFrame = numFrame || defaultNumFrame;
            this.numPins = numPins || defaultPins;
            this.extraShots = extraShots !== 'undefined' ? extraShots : defaultExtraShots;
            this.currShot = 1;
            this.shots = [];
            this.score = 0;
        }


        /**
         * Prototype.
         */
        Frame.prototype = {

            /**
             * Plays a single Shot.
             */
            playShot: function(fn) {
                
                // Generate a shot.
                var shot = new Bowling.Shot(
                  this.currShot++, this.getRemainingPins(), this.numPins
                );

                // Set into collection.
                this.shots.push(shot);

                // Self-reference.
                var self = this;

                // Play it and get Score.
                shot.play(function(score) {

                  // Sum to score.
                  self.score += score;

                  // Callback, if any.
                  if (fn && typeof(fn) === 'function') {
                      fn.call(shot, score);
                  }
                });

                // Return this Object.
                return this;
            },


            /**
             * Plays all shots (sequentially).
             */
            play: function(fn) {
                
                // Make a counter and a self-reference, we're going async.
                var count = defaultShots,
                      self = this;

                // Auto-calling function will handle callbacks.
                (function playFrame() {

                    // Play a shot.
                    self.playShot(function(score) {

                        // Callback, if any, with frame scope ans shot score.
                        if (fn && typeof(fn) === 'function') {
                            fn.call(self, score);
                        }

                        // Check if next shot applies.
                        if (!self.isDone()) {

                            // Call recursively;
                            playFrame.call(self);
                        }
                    });
                })();

                // Return this object.
                return this;
            },


            /**
             * Returns remaining pins for current Frame.
             */
            getRemainingPins: function() {
 
                // Check if strike or sparse so set max pins on last frame.
                if (this.extraShots && (this.isStrike() || this.isSpare())) {

                  // Return all pins.
                  return this.numPins;
                }

                // Just max minus scored.
                return this.numPins - this.score;
            },


            /**
             * Returns if strike or not.
             */
            isStrike: function() {
                
                // Return strike or not.
                return this.shots[0] && this.shots[0].isStrike();
            },


            /**
             * Returns if spare or not.
             */
            isSpare: function() {
                
                // Return strike or not.
                return this.shots[this.currShot-2] && this.shots[this.currShot-2].isSpare();
            },


            /**
             * Returns if done or not.
             */
            isDone: function() {
                
                // Check if it has extra shot.
                var hasExtraShot = this.extraShots && 
                          (this.isSpare() || this.isStrike()) && this.shots.length < defaultShots + 1;

                // Return if done or not, taking into account if it's extra shot or not.
                return !hasExtraShot && (this.score >= this.numPins || this.shots.length >= defaultShots);
            }
        };


        // Return constructor.
        return Frame;

    })();

    // Assign definition into namespace.
    Bowling.Frame = Frame;

})(this.Bowling = this.Bowling || {});