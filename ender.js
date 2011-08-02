/*!
  * =======================================================
  * Ender: open module JavaScript framework
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * https://ender.no.de
  * License MIT
  * Module's individual licenses still apply
  * Build: ender build .
  * =======================================================
  */

/*!
  * Ender-JS: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * https://ender.no.de
  * License MIT
  */
!function (context) {

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {};

  function require (identifier) {
    var module = modules[identifier] || window[identifier];
    if (!module) throw new Error("Requested module has not been defined.");
    return module;
  }

  function provide (name, what) {
    return modules[name] = what;
  }

  context['provide'] = provide;
  context['require'] = require;

  // Implements Ender's $ global access object
  // =========================================

  function aug(o, o2) {
    for (var k in o2) {
      k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k]);
    }
    return o;
  }

  function boosh(s, r, els) {
                          // string || node || nodelist || window
    if (ender._select && (typeof s == 'string' || s.nodeName || s.length && 'item' in s || s == window)) {
      els = ender._select(s, r);
      els.selector = s;
    } else {
      els = isFinite(s.length) ? s : [s];
    }
    return aug(els, boosh);
  }

  function ender(s, r) {
    return boosh(s, r);
  }

  aug(ender, {
    _VERSION: '0.2.5',
    ender: function (o, chain) {
      aug(chain ? boosh : ender, o);
    },
    fn: context.$ && context.$.fn || {} // for easy compat to jQuery plugins
  });

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) {
        i in this && fn.call(scope || this[i], this[i], i, this);
      }
      // return self for chaining
      return this;
    },
    $: ender // handy reference to self
  });

  var old = context.$;
  ender.noConflict = function () {
    context.$ = old;
    return this;
  };

  (typeof module !== 'undefined') && module.exports && (module.exports = ender);
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender;

}(this);

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Doml - a DOM constructor
    * copyright Stuart Malin 2011
    * https://github.com/zhami/doml
    * MIT License
    */
  !function (context) {
  
  	var	Doml, env, isArray, isElementNode;
  
  //	var sys = require('sys');
  //	var	eyes = require('eyes');
  
  
  	//----------------------------------------
  	// support
  	//----------------------------------------
  	getEnv = function () {
  		var	env;
  		env = {
  			global: undefined,
  			isAMD: false,
  			isBrowser: false,
  			isModule: false,
  			isEnder: false,
  			hasRequire: false
  		};
  		// http://www.nczonline.net/blog/2008/04/20/get-the-javascript-global/
  		env.global = global = (function () {
  			return this;
  		})();
  		env.isAMD = Boolean(typeof define !== 'undefined' && define.AMD);
  		env.isBrowser = Boolean(typeof global.window !== 'undefined');
  		env.isEnder = Boolean(typeof context.ender !== 'undefined');
  		env.isModule = Boolean(typeof module !== 'undefined' && module.exports);
  		env.hasRequire = Boolean(typeof require === 'function');
  		return env;
  	};
  
  	isArray = function (x) {
  		return Boolean(x && (Object.prototype.toString.apply(x) === '[object Array]'));
  	};
  
  	isElementNode = function (node) {
  		return node && node.nodeName && node.nodeType == 1;
  	};
  
  	//----------------------------------------
  	// Element Constructor & Prototype
  	//----------------------------------------
  
  	Element = function (doc) {
  		if (!doc) {
  			return null;
  		}
  		this.document = doc;
  		this.element = null;			// the HTML element
  		this.allowTextNodes = false;	// true if the tag can have text
  		this.pendingFunc = null;		// holds a ref to a func that is pending execution awaiting its argument
  	};
  
  	Element.prototype = (function () {
  		var	handleAttrs, procArg;
  
  		//----------------------------------------
  		// private methods
  		//----------------------------------------
  
  		handleAttrs = function (attrs) {
  			var	element, n, setAttr;
  
  			setAttr = function (elem, name, value) {
  				switch (name) {
  				case "checked":
  				case "selected":
  					elem[name] = Boolean(value);
  					break;
  				case "className":
  				case "class":
  					elem.className = value;
  					break;
  				default:
  					elem.setAttribute(name, value);
  				}
  			};
  
  			element = this.element;
  
  			// set Attributes
  			for (n in attrs) {
  				attrs.hasOwnProperty(n) && setAttr(element, n, attrs[n]);
  			}
  		};
  
  		handleTag = function (tagName) {
  			// create the element
  			this.element = this.document.createElement(tagName);
  
  			// set flag if tag allows text nodes
  			this.allowTextNodes = Boolean(!/^input$/.test(tagName.toLowerCase()));
  		};
  
  		procArg = function (arg) {
  			var	i, n, node, subArg, t;
  
  			if ((t = this.pendingFunc)) {
  				// inoke the pending function with this argument and process the results
  				// the result is processed as if it were the present arg
  				this.pendingFunc = null;	// clear pending state
  				arg = t.call(this, arg);
  			}
  
  			t = isArray(arg) ? 'array' : typeof arg;
  			if (t === 'object' && isElementNode(arg)) {
  				t = 'node';
  			}
  			switch (t) {
  			case 'node':
  				this.element.appendChild(arg);
  				break;
  			case 'string':
  				// add a text node (if the element supports text)
  				this.allowTextNodes && this.element.appendChild(document.createTextNode(arg));
  				break;
  			case 'array':
  				subArg = arg[0];
  				if (typeof subArg === 'string') {
  					// treat the array content as arguments for a child
  					node = new Element(this.document);
  					node.create.apply(node, arg);
  					node = node.getElement();
  					this.element.appendChild(node);
  				} else if (isArray(subArg)) {
  					// recurse
  					n = arg.length;
  					for (i = 0; i < n; i += 1) {
  						subArg = arg[i];
  						node = new Element(this.document);
  						if (isArray(subArg)) {
  							node.create.apply(node, subArg);
  							node = node.getElement();
  							this.element.appendChild(node);
  						} else {
  							// treat as an argument of the current element
  							procArg.call(this, subArg);
  						}
  					}
  				} else {
  					// treat array elements as further arguments of the current element
  					n = arg.length;
  					for (i = 0; i < n; i += 1) {
  						procArg.call(this, arg[i]);
  					}
  				}
  				break;
  			case 'object':
  				// attributes
  				handleAttrs.call(this, arg);
  				break;
  			case 'function':
  				// the next arg is passed to the function, so for now, just capture the function
  				this.pendingFunc = arg;
  				break;
  			}
  		};
  
  
  		//----------------------------------------
  		// public methods
  		//----------------------------------------
  		return {
  			create: function () {
  				var	arg, args, i, numArgs;
  
  				// transform arguments into a real array
  				args = Array.prototype.slice.call(arguments, 0);
  				numArgs = args.length;
  				if ((numArgs === 0) || (typeof args[0] !== 'string')) {
  					return;
  				}
  
  				// create the Element from the tagName
  				handleTag.call(this, args[0]);
  
  				//process rest of arguments
  				for (i = 1; i < numArgs; i += 1) {
  					arg = args[i];
  					procArg.call(this, arg);
  				}
  			},
  			getElement: function () {
  				return this.element;
  			}
  		};
  	})();
  
  	//----------------------------------------
  	// Constructor
  	//----------------------------------------
  
  	Doml = function (doc) {
  		if (! doc && env.isBrowser) {
  			doc = env.global.window.document;
  		}
  		this.document = doc;
  		this.verbose = false;
  	};
  
  	Doml.prototype = {
  
  		create: function () {
  			var	node;
  			if ((arguments.length === 1) && isElementNode(node = arguments[0])) {
  				return node.cloneNode(true);
  			} else {
  				node = new Element(this.document);
  				node.create.apply(node, arguments);
  				return node.getElement();
  			}
  		},
  
  		noConflict: function () {},
  
  		setDocument: function (doc) {
  			this.document = doc;
  		},
  
  		verbose: false
  	};
  
  	//----------------------------------------
  	// init
  	//----------------------------------------
  	env = getEnv();
  
  	//----------------------------------------
  	// setup environment
  	//----------------------------------------
  
  
  	if (env.isEnder) {
  		module.exports = new Doml();
  	} else if (env.isBrowser) {
  		// use immediate annonymous function to create closure
  		!function (context) {
  			var	Domil_orig = context.Doml;
  			context.Doml = Doml;
  			Doml.noConflict = function () {
  				context.Doml = Domil_orig;
  				return Doml;
  			};
  		}(context);
  	} else if (env.isModule) {
  		module.exports = Doml;
  	} else {
  		throw new Error('Doml: can not determine the environment!');
  	}
  
  }(this);

  provide("doml", module.exports);

  // Ender "bridge"
  
  !function ($) {
  	
    	var	d = require('doml');
  	
  	$.ender({
  		doml: function () {
  			return $([d.create.apply(d, arguments)]);
  		}
  	});
  
  	$.ender({
   		doml: function () {
  			var element = d.create.apply(d, arguments);		// a shiny new element
    			this.forEach(function (el, index) {
  				if (index) {
  					// if we are appending to more than one element, then clone a new copy
  					element = d.create.call(d, element);
  				}
    				el.appendChild(element);
    			})
    		}
  	}, true);	
  
  	$.id = function (id) {
  		return $([document.getElementById(id)]);
  	};
  
  }(ender || $);

}();