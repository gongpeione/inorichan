/**
 * Created by Gong on 2016/4/1.
 */

(function(document, window, undefined) {

    function i(value) {
        return new i.prototype.init(value);
    }

    i.prototype = {

        constructor : i,
        selector    : null,
        selectorVal : '',
        selectorPointer : 0,

        LOG_MESSAGE : {
            log   : '[MESSAGE] ',
            info  : '[INFO] ',
            error : '[ERROR] ',
            warn  : '[WARN] '
        },

        log : function(value) {
            console.log(this.LOG_MESSAGE.log + value);
        },

        info : function(value) {
            console.info(this.LOG_MESSAGE.info + value);
        },

        error : function(value) {
            console.error(this.LOG_MESSAGE.error + value);
        },

        warn : function(value) {
            console.warn(this.LOG_MESSAGE.warn + value);
        },

        init : function(value) {

            var valueArray = value.split(' ');
            if(valueArray.length === 1 && value.indexOf('#') >= 0) {
                this.selector = document.getElementById(valueArray[0].replace('#', ''));

                return this;
            }

            this.selectorVal = value;
            this.selector    = document.querySelectorAll(value.trim());
            //NodeList to Array
            this.selector    = Array.prototype.slice.call(this.selector);

            return this;

        },

        attr : function(name, value) {

            if(arguments.length > 1) {

                if(!Array.isArray(this.selector)) {
                    this.selector.setAttribute(name, value);
                } else {
                    this.selector[this.selectorPointer].setAttribute(name, value);
                }


                if(arguments.length > 2) {
                    this.warn('Too many arguments.');
                }
                return this;
            }

            return this.selector.getAttribute(name);
        },

        on : function(eventType, handler, useCapture) {

            var self = this;
            if(arguments.length < 2) {
                this.error('function requires at least two arguments.function on(eventType, handler, useCapture)');
                return;
            }

            useCapture = useCapture || false;
            eventType  = eventType.replace(/^on/i, '');
            if(this.selector.length > 0) {

                this.selector.forEach(function(element) {
                    self._addEvent(element, eventType, handler, useCapture);
                });

            } else {

                this._addEvent(document, eventType, function(e) {

                    var event    = window.event || e,
                        i        = 0,
                        nodeList = document.querySelectorAll(this.selectorVal);

                    for(i in nodeList) {
                        if(nodeList[i] === event.target) {
                            console.log(true);
                        }
                    }
                });
            }

        },

        _addEvent : function(element, eventType, handler, useCapture) {
            if(document.addEventListener) {
                element.addEventListener(eventType, handler, useCapture);
            } else {
                element.attachEvent('on' + eventType, handler);
            }
        },

        data : function(key, value) {
            //TODO
        },

        addClass : function(className) {
            //TODO
        },

        rmClass : function(className) {
            //TODO
        },

        append : function(value) {
            //TODO
        },

        prepend : function(value) {
            //TODO
        },

        parent : function() {
            //TODO
        },

        text : function() {
            //TODO
        },

        remove : function() {
            //TODO
        },

        html : function(value) {

            if(!value) {

                if(!Array.isArray(this.selector)) {
                    return this.selector.innerHTML;
                } else {
                    return this.selector[this.selectorPointer].innerHTML;
                }

            } else {

                if(!Array.isArray(this.selector)) {
                    this.selector.innerHTML = value;
                } else {
                    this.selector[this.selectorPointer].innerHTML = value;
                }
            }
        },

        eq : function(orderNum) {
            this.selectorPointer = orderNum;

            return this;
        }

    };

    //Reset Function i's enumerable
    if(Object.defineProperty) {
        Object.defineProperty(i, 'constructor', {
            enumerable: false,
            value: i
        });
    }

    i.prototype.init.prototype = i.prototype;
    window.i = i;

})(document, window);