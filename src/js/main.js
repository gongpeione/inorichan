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

            this.selector = document.querySelectorAll(value.trim());

            return this;

        },

        attr : function(name, value) {

            if(arguments.length > 1) {

                this.selector.setAttribute(name, value);

                if(arguments.length > 2) {
                    this.warn('Too many arguments.');
                }
                return this;
            }

            return this.selector.getAttribute(name);
        },

        on : function(eventType, handler, useCapture) {

            if(arguments.length < 2) {
                this.error('function requires at least two arguments.');
                return;
            }

            useCapture = useCapture || false;
            if(this.selector) {
                if(Array.isArray(this.selector)) {
                    this.selector.forEach(function(element) {
                        this._addEvent(element, eventType.replace(/^on/, ''), handler, useCapture);
                    })
                }
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

        _addEvent : function(element, eventType, handler, useCapture) {
             if(document.addEventListener) {
                element.addEventListener(eventType, handler, useCapture);
             } else {
                 element.attachEvent('on' + eventType, handler);
             }
        },

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