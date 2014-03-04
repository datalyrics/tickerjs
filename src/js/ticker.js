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
     * @method getElementsByClassName
     * @param {String} class name
     * @return {Array} of dom elements which has been found
     */
    var getElementsByClassName = function(className) {
        var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)"),
            all     = document.getElementsByTagName('div'),
            found   = [],
            i;
        
        var divCount = all.length;
        
        for (i = 0; i < divCount; i++) {
            if (all[i] && all[i].className && all[i].className !== '') {
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
     * @param {Integer} speed from 1..~100 in miliseconds
     * @param {function} optional callback
     */
    this.start = function(setSpeed, callback) {
        if (typeof setSpeed !== 'undefined') {
            speed = setSpeed;
        }
        if (typeof callback === 'function') {
            finishCallback = callback;
        }
        
        allTickers = getElementsByClassName('ticker');
        
        if (allTickers.length === 0) {
            return;
        }
            
        init(allTickers[currTicker].id);
    };

    /*
     * @method init
     * @param {String} id of current div
     */
    var init = function(divId) {
        var currDiv = document.getElementById(divId);
        allNodes    = currDiv.cloneNode().childNodes;

        if (allNodes.length === 0) {
            initNextTicker();
            return;
        }
        if (typeof that.soundstart === 'function') {
            that.soundstart();
        }
        
        currNode              = 0;
        currDiv.innerHTML     = '';
        currDiv.style.display = 'block';
        printNextNode(currDiv, currNode);
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
            var nodeText = allNodes[currNode].text;
            allNodes[currNode].text = '';
            var newNode  = currDiv.appendChild(allNodes[currNode].cloneNode());
            initPrintChar(currDiv, nodeText, newNode, 'text');
        } else {
            currDiv.appendChild(allNodes[currNode].cloneNode());
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
            if (typeof that.soundstop === 'function') {
                that.soundstop();
            }
            if (typeof finishCallback === 'function') {
                finishCallback();
            }
        }
    };
    
  };
