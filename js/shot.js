/**
 * Self-invoking function for preserving scope.
 */
(function (Bowling) {

    /**
     * Self-invoking function for static private variables.
     */
    var Shot = (function() {

        /**
         * Private static variables (defaults).
         */
        var defaultNumShot = 1,
              defaultPins = 10,
              defaultStrikeChar = 'X',
              defaultSpareChar = '/';


        /**
         * Constructor. Overrides defaults if provided.
         */
        function Shot(numShot, numPins, maxPins, strikeChar, spareChar) {
            this.numShot = numShot || defaultNumShot;
            this.numPins = numPins || defaultPins;
            this.maxPins = maxPins || defaultPins;
            this.strikeChar = strikeChar || defaultStrikeChar;
            this.spareChar = spareChar || defaultSpareChar;
            this.score = 0;
        }


        /**
         * Prototype.
         */
        Shot.prototype = {

            /**
             * Plays the shot.
             */
            play: function(fn) {
                
                // Launch the ball.
                // Randomly hits a number of pins between 1 and max available pins.
                var scored = Math.ceil(Math.random() * this.numPins);

                // Set real score. Signs for strike/spare.
                this.score = (scored === this.numPins) ?
                            (this.numPins === this.maxPins) ? this.strikeChar : this.spareChar : scored;

                // Callback, if any, with shot scope and numeric score.
                if (fn && typeof(fn) === 'function') {

                    // Self - reference.
                    var self = this;

                    // Make random time.
                    var timed = Math.random() * 100;

                    // Simulate asynchronous behavior.
                    setTimeout(function() {
                        fn.call(self, scored);
                    }, timed);
                    // fn.call(this, scored);
                }

                // Return this object.
                return this;
            },


            /**
             * Gets numeric score (for strikes/spares handling).
             */
            getNumericScore: function() {
                
                // Return numeric score.
                return this.isStrike() ? this.maxPins : this.isSpare() ? this.numPins : this.score;
            },


            /**
             * Returns if strike or not.
             */
            isStrike: function() {
                
                // Return strike or not.
                return this.score === this.strikeChar;
            },


            /**
             * Returns if spare or not.
             */
            isSpare: function() {
                
                // Return strike or not.
                return this.score === this.spareChar;
            }
        };

        // Return constructor.
        return Shot;

    })();

    // Assign definition into namespace.
    Bowling.Shot = Shot;

})(this.Bowling = this.Bowling || {});