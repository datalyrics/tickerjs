/*
 * 
 * (c) 2013 Eric Herrmann
 * MIT License
 * to start: e.g. onload event: dlTicker.start()
 * needs divs with class="ticket" and style="display:none;"
 * 
 */

var dlTicker = {

    /*
     * 
     */
    allTicker: null,

    /*
     * 
     */
    currTicker: 0,

    /*
     * 
     */
    myY: 0,

    /*
     * 
     */
    myTimer: null,

    /*
     * 
     */
    speed: 10,

    /*
     * 
     */
    getElementsByClassName: function(className) {
        var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)"),
            all     = document.getElementsByTagName("div"),
            found   = new Array(),
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
     * 
     */
    init: function(divId) {
        var initDiv           = document.getElementById(divId);
        var initText          = initDiv.innerHTML;
        initText = initText.replace(/(\r\n)|(\r)|(\n)/g, '');
        var initLength        = initText.length;
        initDiv.innerHTML     = '';
        initDiv.style.display = 'block';
        this.myY              = 0;
        this.myTimer          = setInterval(function() {
            dlTicker.loop(divId, initText, initLength);
        }, this.speed);
    },

    /*
     * 
     */
    loop: function(divId, initText, initLength) {
        var charToAdd = '';
        
        if(this.myY > (initLength - 1)) {
            clearInterval(this.myTimer);
            
            if(this.currTicker+1 < this.allTicker.length) {
                this.currTicker++;
                this.init(this.allTicker[this.currTicker].id);
            }
            return;
        }
        
        charToAdd = initText.substring(this.myY, this.myY + 1);
        document.getElementById(divId).innerHTML = document.getElementById(divId).innerHTML + charToAdd;
        this.myY++;
    }
   
  };
