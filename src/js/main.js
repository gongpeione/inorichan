/**
 * Created by Gong on 2016/4/1.
 */
(function(document, window, undefined) {

    function G(value) {
        return new G.prototype.init(value);
    }

    G.prototype = {

        constructor : G,
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

            if(value.nodeType) {
                this.selector = value;

                return this;
            }

            if(typeof value === 'string') {

                this.selectorVal = value;

                var valueArray = value.split(' ');
                if(valueArray.length === 1 && value.indexOf('#') >= 0) {
                    this.selector = document.getElementById(valueArray[0].replace('#', ''));

                    return this;
                }

                this.selector    = document.querySelectorAll(value.trim());
                //NodeList to Array
                this.selector    = Array.prototype.slice.call(this.selector);

                return this;
            }
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
                        nodeList = document.querySelectorAll(self.selectorVal);

                    for(i in nodeList) {
                        if(nodeList[i] === event.target) {
                            handler.call(nodeList[i]);
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

        css : function(property, value) {

            if(typeof property === 'string') {

                if(arguments.length === 1) {
                    if(!Array.isArray(this.selector)) {
                        return window.getComputedStyle(this.selector, null)[property];
                    } else {
                        return window.getComputedStyle(this.selector[this.selectorPointer], null)[property];
                    }
                } else {
                    if(!Array.isArray(this.selector)) {
                        this.selector.style.cssText += ';' + property + ':' + value;
                    } else {
                        this.selector.forEach(function(item) {
                            item.style.cssText += ';' + property + ':' + value;
                        });
                    }
                }

                return this;

            } else if(typeof property === 'object') {

                var cssText = '';

                for(var key in property) {
                    cssText += ';' + key + ':' + property[key];
                }
                if(!Array.isArray(this.selector)) {
                    this.selector.style.cssText += cssText;
                } else {
                    this.selector.forEach(function(item) {
                        item.style.cssText += cssText;
                    });
                }

                return this;
            }

        },

        append : function(value) {
            //TODO
        },

        prepend : function(value) {
            //TODO
        },

        parent : function() {
            if(!Array.isArray(this.selector)) {
                this.selector = this.selector.parentNode;

                return this;
            } else {
                var parentList = [];
                this.selector.forEach(function(item) {
                    parentList.push(item);
                });

                this.selector = parentList;

                return this;
            }
        },

        text : function(value) {
            if(!value) {

                if(!Array.isArray(this.selector)) {
                    return this.selector.innerText;
                } else {
                    return this.selector[this.selectorPointer].innerText;
                }

            } else {

                if(!Array.isArray(this.selector)) {
                    this.selector.innerText = value;
                } else {
                    this.selector[this.selectorPointer].innerText = value;
                }
            }
        },

        remove : function() {
            //TODO
        },

        height : function() {
            //TODO
        },

        width : function() {
            //TODO
        },

        offset : function() {
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
        Object.defineProperty(G, 'constructor', {
            enumerable: false,
            value: G
        });
    }

    G.prototype.init.prototype = G.prototype;
    window.G = G;

})(document, window);