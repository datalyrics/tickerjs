/**
 * old school news ticker
 * @module dlSound
 * @author (c) 2014 Eric Herrmann, MIT License
 */

/**
 * Description for sound class.
 *
 * @class DLSound
 */


DLTicker.prototype.soundstart = function() {
    document.getElementById('writersound').play();
};

DLTicker.prototype.soundstop = function() {
    document.getElementById('writersound').pause();
};
