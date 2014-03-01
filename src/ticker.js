/**
 * old school news ticker
 * @module dlTicker
 * @author (c) 2014 Eric Herrmann, MIT License
 */

/**
 * Description for ticker class.
 *
 * @class DLTicker
 * @static
 */
var DLTicker = function() {

    /*
     * @property allTickers
     * @type {Array}
     */
    var allTickers = null;

    /*
     * @property currTicker
     * @type {Integer}
     */
    var currTicker = 0;

    /*
     * @property charPos
     * @type {Integer}
     */
    var charPos = 3;

    /*
     * @property dlTimer
     * @type {Object}
     */
    var dlTimer = null;

    /*
     * @property
     * @type {Integer}
     * @default 10
     */
    var speed = 10;

    /*
     * @method getElementsByClassName
     * @param {String} class name
     * @return {Array} of dom elements which has been found
     */
    var getElementsByClassName = function(className) {
        var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)"),
            all     = document.getElementsByTagName("div"),
            found   = [],
            i;
        
        var divCount = all.length;
        
        for (i = 0; i < divCount; i++) {
            if (all[i] && all[i].className && all[i].className !== "") {
                if (all[i].className.match(pattern) && all[i].id !== '') {
                    found[found.length] = all[i];
                }
            }
        }
        return found;
    };

    /*
     *
     * @method start
     * @param integer speed from 1..~100 in miliseconds
     * @return returns nothing 
     */
    this.start = function(setSpeed) {
        if (typeof setSpeed !== 'undefined') {
            speed = setSpeed;
        }
        
        allTickers = getElementsByClassName('ticker');
        
        if (allTickers.length === 0) {
            return;
        }
            
        init(allTickers[currTicker].id);
    };

    /*
     * @method init
     * @return returns nothing
     */
    var init = function(divId) {
        var currDiv           = document.getElementById(divId);
        var divText           = currDiv.innerHTML;
        divText               = divText.replace(/(\r\n)|(\r)|(\n)/g, '');
        var divTextLen        = divText.length;
        currDiv.innerHTML     = '';
        currDiv.style.display = 'block';
        charPos               = 0;
        dlTimer               = setInterval(function() {
            printChar(divId, divText, divTextLen);
        }, speed);
    };

    /*
     * @method: printChar
     * @return returns nothing
     */
    var printChar = function(divId, initText, initLength) {
        var charToAdd = '';
        
        if(charPos > (initLength - 1)) {
            clearInterval(dlTimer);
            
            if(currTicker+1 < allTickers.length) {
                currTicker++;
                init(allTickers[currTicker].id);
            }
            return;
        }
        
        charToAdd = initText.substring(charPos, charPos + 1);
        document.getElementById(divId).innerHTML = document.getElementById(divId).innerHTML + charToAdd;
        charPos++;
    };
   
  };
var dlTicker = new DLTicker();
dlTicker.start(10);
