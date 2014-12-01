/**
 * Self-invoking function for preserving scope.
 */
(function (Bowling) {

    /**
     * Self-invoking function for static private variables.
     */
    var Game = (function() {

        /**
         * Private static variables (defaults).
         */
        var defaultNumPlayers = 1,
              defaultFrames = 10,
              defaultPins = 10,
              defaultExtraShots = true;


        /**
         * Constructor. Overrides defaults if provided.
         */
        function Game(numPlayers, numFrames, numPins, extraShots) {
            this.numPlayers = numPlayers || defaultNumPlayers;
            this.numFrames = numFrames || defaultFrames;
            this.numPins = numPins || defaultPins;
            this.extraShots = extraShots !== 'undefined' ? extraShots : defaultExtraShots;
            this.players = [];
        }


        /**
         * Prototype.
         */
        Game.prototype = {

            /**
             * Init Players.
             */
            init: function(fn) {

                // Init players array.
                this.players = [];

                // Loop and create players.
                for (var i=0, j=this.numPlayers; i<j; i++) {

                    // Create a player.
                    this.players.push(
                        new Bowling.Player(
                            i+1, this.numFrames, this.numPins, this.extraShots
                        )
                    );

                    // Callback, if any, with game scope and player number.
                    if (fn && typeof(fn) === 'function') {
                        fn.call(self, i+1);
                    }
                }

                // Return this object.
                return this;
            },


            /**
             * Plays frames.
             */
            play: function(sync, fn) {
                
                // Return this object.
                return sync ? this.playSync(fn) : this.playAsync(fn);
            },


            /**
             * Plays frames.
             */
            playSync: function(fn) {
                
                // Init iterators, etc..
                var numFrames = this.numFrames,
                      numPlayer = 0,
                      self = this;

                // Definition and execution of recursive function for a player frame.
                (function playPlayerFrame() {

                    // Play player frame. Callback for every shot.
                    self.players[numPlayer].playFrame(function(frame) {

                        // Callback, if any, with game scope and player.
                        if (fn && typeof(fn) === 'function') {
                            fn.call(self, this);
                        }

                        // Now check if we're done with frame.
                        if (frame.isDone()) {

                            // Check if last player
                            if (numPlayer >= self.numPlayers - 1) {

                                // Check if not last frame yet.
                                if (--numFrames) {

                                    // Reset players.
                                    numPlayer = -1;

                                // Last frame and player, done.
                                } else {

                                    // Callback, if any, with game ended flag.
                                    if (fn && typeof(fn) === 'function') {
                                        fn.call(self, null);
                                    }

                                    // Return from invocation.
                                    return self;
                                }
                            }
                            // Increment Player num.
                            numPlayer++;

                            // Recurse.
                            playPlayerFrame.call(self);
                        }
                    });
                })();

                // Return this object.
                return this;
            },


            /**
             * Plays frames.
             */
            playAsync: function(fn) {
                
                // Init iterators, etc..
                var self = this,
                      finishedPlayers = 0;

                /**
                 * Inner function for async players playing.
                 */
                function playPlayerFrame(numPlayer, numFrames) {

                    // Play player frame. Callback for every shot.
                    self.players[numPlayer].playFrame(function(frame) {

                        // Callback, if any, with game scope and player.
                        if (fn && typeof(fn) === 'function') {
                            fn.call(self, this);
                        }

                        // Now check if we're done with frame.
                        if (frame.isDone()) {

                                // Check if not last frame yet.
                                if (--numFrames) {

                                    // Recurse.
                                    playPlayerFrame.call(self, numPlayer, numFrames);

                                // Last frame! Check if last player also.
                                } else if (++finishedPlayers >= self.numPlayers) {

                                    // Callback, if any, with game ended flag.
                                    if (fn && typeof(fn) === 'function') {
                                        fn.call(self, null);
                                    }
                                }
                        }
                    });
                }

                // Loop over players and play.
                for (k=0, l=this.numPlayers; k<l; k++) {
                    playPlayerFrame(k, this.numFrames);
                }

                // Return this object.
                return this;
            }
        };


        // Return constructor.
        return Game;

    })();

    // Assign definition into namespace.
    Bowling.Game = Game;

})(this.Bowling = this.Bowling || {});