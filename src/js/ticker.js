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
     * @property allNodes
     * @type {Array}
     */
    var allNodes = null;

    /*
     * @property currNode
     * @type {Integer}
     */
    var currNode = 0;

    /*
     * @property charPos
     * @type {Integer}
     */
    var charPos = 0;

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
     * @property
     * @type {function}
     */
    var finishCallback;

    /*
     * @property
     * @type {object} saves the reference to the object created with new
     */
    var that = this;
    
     /*
      * @property
      * @type {array} ids of ticker classes which should be tickered
      */
    var tickerIds = [];
    
     /*
      * @property
      * @type {integer} used to detect how many tickers are still running
      */
    var animStackCount = 0;

     /*
      * @property
      * @type {boolean} used to set global sound on or off
      */
    var soundSwitch = true;
    
    /*
     * @method getElementsByClassName
     * @param {String} class name
     * @return {Array} of dom elements which has been found
     */
    var getElementsByClassName = function(className) {
        var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)"),
            all     = document.getElementsByTagName('div'),
            found   = [],
            i,
            j;
        
        var divCount = all.length;
        var tiIdsLen = tickerIds.length;

        // no user defined tickers, so take all of them
        if (tiIdsLen === 0) {
            for (i = 0; i < divCount; i++) {
                if (all[i] && all[i].className && all[i].className !== '') {
                    if (all[i].className.match(pattern) && all[i].id !== '') {
                        found[found.length] = all[i];
                    }
                }
            }
            return found;
        }
        
        // user defined tickers
        for (j = 0; j < tiIdsLen; j++) {
            for (i = 0; i < divCount; i++) {
                if (all[i] && all[i].className && all[i].className !== '') {
                    if (all[i].className.match(pattern) && all[i].id !== '') {
                        if (tickerIds[j] === all[i].id) {
                            found[found.length] = all[i];
                        }
                    }
                }
            }
        }
        return found;
    };

    /*
     *
     * @method start
     * @param {Integer} speed from 1..~100 in miliseconds
     * @param {function} optional callback routine
     * @param {Array} optional ticker ids
     */
    this.start = function(setSpeed, callback, setTickerIds) {
        if (typeof setSpeed !== 'undefined') {
            speed = setSpeed;
        }
        
        if (typeof callback === 'function') {
            finishCallback = callback;
        }

        if (setTickerIds !== null && typeof setTickerIds === 'object' && setTickerIds.length !== null) {
            tickerIds = setTickerIds;
        }        

        allTickers = getElementsByClassName('ticker');

        if (allTickers.length === 0) {
            return;
        }

        animStackCount++;
        init(allTickers[currTicker].id);
    };

    /*
     *
     * @method toggleSound
     */
    this.toggleSound = function() {
        if (soundSwitch === true) {
            soundSwitch = false;
            that.soundstop();
        } else {
            if (animStackCount > 0) {
                soundSwitch = true;
                that.soundstart();
            }
        }
    };

    /*
     * @method init
     * @param {String} id of current div
     */
    var init = function(divId) {
        var currDiv = document.getElementById(divId);
        allNodes    = currDiv.cloneNode(true).childNodes;
        
        // start ticker sound if available
        if (typeof that.soundstart === 'function' && soundSwitch === true) {
            that.soundstart();
        }

        // identify animation
        if (currDiv.getAttribute('data-dl-anim') !== null) {
            drawAnim(currDiv.getAttribute('data-dl-anim'), currDiv);
            animStackCount++;
            return;
        }

        // ensure that there are nodes in this div
        if (allNodes.length === 0) {
            initNextTicker();
            return;
        }
        
        // draw nodes
        currNode                 = 0;
        currDiv.innerHTML        = '';
        currDiv.style.visibility = 'visible';
        printNextNode(currDiv, currNode);
    };

    /*
     * @method drawAnim
     * @param {String} sprite data e.g. "270-119-40" "width-imagecount-interval"
     * @param {Object}
     */
    var drawAnim = function(spriteData, currDiv) {
        var thatDiv     = currDiv;
        var data        = spriteData.split('-');
        var picWidth    = data[0];
        var left        = 0;
        var interations = data[1] - 1;
        var interval    = data[2];
        var maxValue    = interations * picWidth * -1;
        var spriteTimer;
        initNextTicker();

        spriteTimer = setInterval(function() {
          thatDiv.style.backgroundPosition = ( left -= picWidth ) + "px 0px";
          if ( left <= maxValue ) {
            clearInterval( spriteTimer );
            aTickerHasStopped();
          }
        }, interval);
        
    };

    /*
     * @method initPrintChar
     * @param {Object} current DOM div
     * @param {String}
     * @param {Object} DOM node
     * @param {String} content attribute
     */
    var initPrintChar = function(currDiv, nodeText, newNode, content_attribute) {
        nodeText        = nodeText.replace(/(\r\n)|(\r)|(\n)/g, '');
        var nodeTextLen = nodeText.length;
        charPos         = 0;
        dlTimer         = setInterval(function() {
            printChar(currDiv, nodeText, nodeTextLen, newNode, content_attribute);
        }, speed);
    };

    /*
     * @method printNextNode
     * @param {Object} current DOM div
     */
    var printNextNode = function(currDiv) {
        if (allNodes[currNode].nodeName === '#text') {
            var nodeText = allNodes[currNode].nodeValue;
            var newNode  = document.createTextNode('');
            currDiv.appendChild(newNode);
            initPrintChar(currDiv, nodeText, newNode, 'nodeValue');
        } else if (allNodes[currNode].nodeName === 'A') {
            var nodeText = allNodes[currNode].textContent;
            allNodes[currNode].textContent = '';
            var newNode  = currDiv.appendChild(allNodes[currNode].cloneNode(true));
            initPrintChar(currDiv, nodeText, newNode, 'textContent');
        } else {
            currDiv.appendChild(allNodes[currNode].cloneNode(true));
            initNextNode(currDiv);
        }
    };

    /*
     * @method initNextNode
     * @param {Object} current DOM div
     */
    var initNextNode = function(currDiv) {
        if (currNode+1 < allNodes.length) {
            currNode++;
            printNextNode(currDiv);
        } else {
            currNode = 0;
            initNextTicker();
        }
    };

    /*
     * @method printChar
     * @param {Object} current DOM div
     * @param {String}
     * @param {Integer}
     * @param {Object} DOM node
     * @param {String} content attribute
     */
    var printChar = function(currDiv, nodeText, nodeTextLen, newNode, content_attribute) {
        if (charPos > (nodeTextLen - 1)) {
            clearInterval(dlTimer);
            initNextNode(currDiv);
            return;
        }
        newNode[content_attribute] = newNode[content_attribute] + nodeText.substring(charPos, charPos + 1);
        charPos++;
    };
    
    /*
     * @method initNextTicker
     */
    var initNextTicker = function() {
        if(currTicker+1 < allTickers.length) {
            currTicker++;
            init(allTickers[currTicker].id);
        } else {
            aTickerHasStopped();
        }
    };
    
    /*
     * @method aTickerHasStopped
     */
    var aTickerHasStopped = function() {
        animStackCount--;
        if (animStackCount === 0) {
            if (typeof that.soundstop === 'function') {
                that.soundstop();
            }
            if (typeof finishCallback === 'function') {
                finishCallback();
            }
        }
    };
    
  };
