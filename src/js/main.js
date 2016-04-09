/**
 * Created by Gong on 2016/4/1.
 */

(function(global, factory) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {

        module.exports = global.document ?
            factory( global ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "jQuery requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

})(typeof window !== "undefined" ? window : this, function (window, undefined) {

    var document = window.document;

    function G(value) {
        return new G.prototype.init(value);
    }

    var version = '0.0.1';

    G.prototype = {

        constructor: G,
        selector: null,
        selectorVal: '',
        selectorPointer: 0,
        selectorIsArray : false,

        LOG_MESSAGE: {
            log: '[MESSAGE] ',
            info: '[INFO] ',
            error: '[ERROR] ',
            warn: '[WARN] '
        },

        log: function (value) {
            console.log(this.LOG_MESSAGE.log + value);
        },

        info: function (value) {
            console.info(this.LOG_MESSAGE.info + value);
        },

        error: function (value) {
            console.error(this.LOG_MESSAGE.error + value);
        },

        warn: function (value) {
            console.warn(this.LOG_MESSAGE.warn + value);
        },

        init: function (value) {

            if (value.nodeType) {
                this.selector = value;

                return this;
            }

            if (typeof value === 'string') {

                value = value.trim();

                this.selectorVal = value;

                var valueArray = value.split(' ');
                if (valueArray.length === 1 && value.indexOf('#') >= 0) {
                    this.selector = document.getElementById(valueArray[0].replace('#', ''));

                    return this;
                }

                this.selector = document.querySelectorAll(value.trim());
                //NodeList to Array
                this.selector = Array.prototype.slice.call(this.selector);
                this.selectorIsArray = true;

                return this;
            }
        },

        attr: function (name, value) {

            if (arguments.length > 1) {

                !this.selectorIsArray ?
                    this.selector.setAttribute(name, value) :
                    this.selector[this.selectorPointer].setAttribute(name, value);


                if (arguments.length > 2) {
                    this.warn('Too many arguments.');
                }
                return this;
            }

            return this.selector.getAttribute(name);
        },

        on: function (eventType, handler, useCapture) {

            var self = this;
            if (arguments.length < 2) {
                this.error('function requires at least two arguments.function on(eventType, handler, useCapture)');
                return;
            }

            useCapture = useCapture || false;
            eventType = eventType.replace(/^on/i, '');
            if (this.selector.length > 0) {

                this.selector.forEach(function (element) {
                    self._addEvent(element, eventType, handler, useCapture);
                });

            } else {

                this._addEvent(document, eventType, function (e) {

                    var event = window.event || e,
                        i = 0,
                        nodeList = document.querySelectorAll(self.selectorVal);

                    for (i in nodeList) {
                        if (nodeList[i] === event.target) {
                            handler.call(nodeList[i]);
                        }
                    }
                });
            }

        },

        _addEvent: function (element, eventType, handler, useCapture) {
            if (document.addEventListener) {
                element.addEventListener(eventType, handler, useCapture);
            } else {
                element.attachEvent('on' + eventType, handler);
            }
        },

        data: function (key, value) {

            if (arguments.length === 1) {
                //IE10- does not support dataset
                if(this.selector.dataset) {
                    return !this.selectorIsArray ?
                        this.selector.dataset[G.toCamel(key)] :
                        this.selector[this.selectorPointer].dataset[G.toCamel(key)];
                } else {

                    return !this.selectorIsArray ?
                        this.selector.getAttribute('data-' + key) :
                        this.selector[this.selectorPointer].getAttribute('data-' + key);

                }
            } else {

                if(this.selector.dataset) {
                    !this.selectorIsArray ?
                        this.selector.dataset[G.toCamel(key)] = value :
                        this.selector.forEach(function (item) {
                            item.dataset[G.toCamel(key)] = value;
                        });
                } else {
                    !this.selectorIsArray ?
                        this.selector.setAttribute('data-' + key, value) :
                        this.selector.forEach(function (item) {
                            item.setAttribute('data-' + key, value);
                        });
                }

            }
        },

        hasClass: function(value) {

            if(!this.selectorIsArray) {
                return !!(this.selector.className.indexOf(value) + 1);
            } else {

                this.selector.forEach(function(item) {
                    if(this.selector.className.indexOf(value) + 1) {
                        return true;
                    }
                });

                return false;
            }
        },

        addClass: function (className) {

            if(!this.selectorIsArray) {
                //if element does not have this class name;
                if(!(this.selector.className.indexOf(className) + 1)) {
                    this.selector.className += ' ' + className;
                }

            } else {

                this.selector.forEach(function(item) {
                    if(!(item.className.indexOf(className) + 1)) {
                        item.className += ' ' + className;
                    }
                });
            }

            return this;
        },

        rmClass: function (className) {
            if(!this.selectorIsArray) {

                this.selector.className.replace(className, '');

            } else {

                this.selector.forEach(function(item) {
                    item.className.replace(className, '');
                });
            }

            return this;
        },

        css: function (property, value) {

            if (typeof property === 'string') {

                if (arguments.length === 1) {

                    return !this.selectorIsArray ?
                        window.getComputedStyle(this.selector, null)[property] :
                        window.getComputedStyle(this.selector[this.selectorPointer], null)[property];

                } else {

                    !this.selectorIsArray ?
                        this.selector.style.cssText += ';' + property + ':' + value :
                        this.selector.forEach(function (item) {
                            item.style.cssText += ';' + property + ':' + value;
                        });

                }

                return this;

            } else if (typeof property === 'object') {

                var cssText = '';

                for (var key in property) {
                    cssText += ';' + key + ':' + property[key];
                }

                !this.selectorIsArray ?
                    this.selector.style.cssText += cssText :
                    this.selector.forEach(function (item) {
                        item.style.cssText += cssText;
                    });

                return this;
            }

        },

        append: function (value) {
            //TODO
        },

        prepend: function (value) {
            //TODO
        },

        parent: function () {
            if (!this.selectorIsArray) {
                this.selector = this.selector.parentNode;

                return this;
            } else {
                var parentList = [];
                this.selector.forEach(function (item) {
                    parentList.push(item);
                });

                this.selector = parentList;

                return this;
            }
        },

        find: function () {

        },

        text: function (value) {
            if (!value) {

                return !this.selectorIsArray ?
                    this.selector.innerText :
                    this.selector[this.selectorPointer].innerText;

            } else {

                !this.selectorIsArray ?
                    this.selector.innerText = value :
                    this.selector[this.selectorPointer].innerText = value;
            }
        },

        remove: function () {

            !this.selectorIsArray ?
                this.selector.parentNode.removeChild(this.selector) :
                this.selector.forEach(function (item) {
                    item.parentNode.removeChild(item);
                });
        },

        height: function () {
            //TODO
        },

        width: function () {
            //TODO
        },

        offset: function () {
            //TODO
        },

        html: function (value) {

            if (!value) {

                return !this.selectorIsArray ?
                    this.selector.innerHTML :
                    this.selector[this.selectorPointer].innerHTML;

            } else {

                !this.selectorIsArray ?
                    this.selector.innerHTML = value :
                    this.selector[this.selectorPointer].innerHTML = value;
            }
        },

        eq: function (orderNum) {
            this.selectorPointer = orderNum;

            return this;
        }

    };

    G.toCamel = function (value, splitChar) {

        var splitChar = splitChar || '-',
            splitArray = value.split(splitChar),
            fullName = '',
            firstItem = true;

        fullName = splitArray.reduce(function (prev, curr) {
            if (firstItem) {
                firstItem = false;
                return prev + curr[0].toUpperCase() + curr.slice(1);
            } else {
                return prev + curr[0].toUpperCase() + curr.slice(1);
            }
        });

        return fullName;

    };

    G.ajax = function (param) {

    };

    //Reset Function i's enumerable
    if (Object.defineProperty) {
        Object.defineProperty(G, 'constructor', {
            enumerable: false,
            value: G
        });
    }

    G.prototype.init.prototype = G.prototype;
    window.G = G;

    return G;

})