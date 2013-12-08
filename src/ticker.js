/**
 * old school news ticker
 * @module dlTicker
 * @author (c) 2013 Eric Herrmann, MIT License
 */

/**
 * Description for ticker class.
 *
 * @class dlTicker
 * @static
 */
var dlTicker = {

    /*
     * @property allTicker
     * @type {Array}
     */
    allTicker: null,

    /*
     * @property currTicker
     * @type {Integer}
     */
    currTicker: 0,

    /*
     * @property charPos
     * @type {Integer}
     */
    charPos: 0,

    /*
     * @property dlTimer
     * @type {Object}
     */
    dlTimer: null,

    /*
     * @property
     * @type {Integer}
     * @default 10
     */
    speed: 10,

    /*
     * @method getElementsByClassName
     * @param {String} class name
     * @return {Array} of dom elements which has been found
     */
    getElementsByClassName: function(className) {
        var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)"),
            all     = document.getElementsByTagName("div"),
            found   = [],
            i;
        
        var divCount = all.length;
        
        for (i = 0; i < divCount; i++) {
            if (all[i] && all[i].className && all[i].className !== "") {
                if (all[i].className.match(pattern)) {
                    found[found.length] = all[i];
                }
            }
        }
        return found;
    },

    /*
     *
     * @method start
     * @param integer speed from 1..~100 in miliseconds
     * @return returns nothing 
     */
    start: function(speed) {
        this.speed     = speed;
        this.allTicker = this.getElementsByClassName('ticker');
        
        if (this.allTicker.length > 0) {
            if (this.allTicker[this.currTicker].id !== '') {
                this.init(this.allTicker[this.currTicker].id);
            } else {
                if(this.currTicker + 1 < this.allTicker.length) {
                    this.currTicker++;
                    this.init(this.allTicker[this.currTicker].id);
                }
            }
        }
    },

    /*
     * @method init
     * @return returns nothing
     */
    init: function(divId) {
        var initDiv           = document.getElementById(divId);
        var initText          = initDiv.innerHTML;
        initText = initText.replace(/(\r\n)|(\r)|(\n)/g, '');
        var initLength        = initText.length;
        initDiv.innerHTML     = '';
        initDiv.style.display = 'block';
        this.charPos              = 0;
        this.dlTimer          = setInterval(function() {
            dlTicker.loop(divId, initText, initLength);
        }, this.speed);
    },

    /*
     * @method: loop
     * @return returns nothing
     */
    loop: function(divId, initText, initLength) {
        var charToAdd = '';
        
        if(this.charPos > (initLength - 1)) {
            clearInterval(this.dlTimer);
            
            if(this.currTicker+1 < this.allTicker.length) {
                this.currTicker++;
                this.init(this.allTicker[this.currTicker].id);
            }
            return;
        }
        
        charToAdd = initText.substring(this.charPos, this.charPos + 1);
        document.getElementById(divId).innerHTML = document.getElementById(divId).innerHTML + charToAdd;
        this.charPos++;
    }
   
  };
