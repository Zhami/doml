/*!
  * =======================================================
  * Ender: open module JavaScript framework
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * https://ender.no.de
  * License MIT
  * Module's individual licenses still apply
  * Build: ender build doml
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

  !function (context) {
  
  	var	contextDoc, createNode, doml, Doml, Domil_orig, env, getGlobal, isArray, isNode, procArgs, procTag;
  
  //	var sys = require('sys');
  //	var	eyes = require('eyes');
  
  
  	//----------------------------------------
  	// support
  	//----------------------------------------
  	getEnv = function () {
  		var	env, global;
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
  
  	isNode = function (node) {
  		return node && node.nodeName && node.nodeType == 1;
  	};
  
  	//----------------------------------------
  	// ops
  	//----------------------------------------
  
  	createNode = function () {
  		var	element, i, n, s, setAttr;
  
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
  
  		// create the element
  		element = this.document.createElement(this.tagName);
  
  		// set Attributes
  		s = this.attrs;
  		for (n in s) {
  			s.hasOwnProperty(n) && setAttr(element, n, s[n]);
  		}
  
  		// add text (but not to nodes that don't allow it)
  		s = !/^input$/.test(this.tagName.toLowerCase());
  		if (s && (s =  this.content)) {
  			element.innerHTML = s;
  		}
  		return element;
  	};
  
  	getText = function (elem) {
  		var node;
  
  	};
  
  	procArg = function (arg) {
  		var	i, n, ptr, t;
  		t = isArray(arg) ? 'array' : typeof arg;
  		switch (t) {
  		case 'string':
  			this.content += arg;
  			break;
  		case 'array':
  			// elements
  			n = arg.length;
  			ptr = this.elems;
  			for (i = 0; i < n; i += 1) {
  				ptr.push(arg[i]);
  			}
  			break;
  		case 'object':
  			// attributes
  			ptr = this.attrs;
  			for (n in arg) {
  				if (arg.hasOwnProperty(n)) {
  					ptr[n] = arg[n];
  				}
  			}
  			break;
  		case 'function':
  			t = arg.call(this);
  			if (t) {
  				procArg.call(this, t);
  			}
  			break;
  		}
  	};
  
  	procArgs = function (origArgs) {
  		var	arg, args, i, numArgs;
  
  		args = Array.prototype.slice.call(origArgs, 0);
  		numArgs = args.length;
  		if ((numArgs === 0) || (typeof args[0] !== 'string')) {
  			return;
  		}
  		this.tagName = args[0];
  		for (i = 1; i < numArgs; i += 1) {
  			arg = args[i];
  			procArg.call(this, arg);
  		}
  	};
  
  	//----------------------------------------
  	// Constructor
  	//----------------------------------------
  
  	Doml = function (doc) {
  		if (! doc && env.isBrowser) {
  			doc = env.global.window.document;
  		}
  		this.document = doc;
  		this.clear();
  	};
  
  
  	Doml.prototype = {
  		clear: function () {
  			this.tagName = undefined;
  			this.content = '';
  			this.attrs = {};
  			this.elems = [];
  		},
  
  		create: function () {
  			var	node, rootNode;
  
  			this.clear();
  
  			if ((arguments.length === 1) && isNode(node = arguments[0])) {
  				return node.cloneNode(true);
  			} else {
  				procArgs.call(this, arguments);
  
  				if (!this.document || !this.tagName) {
  					return null;
  				} else {
  					rootNode = createNode.call(this);
  					return rootNode;
  				}
  			}
  		},
  
  		setDocument: function (doc) {
  			this.document = doc;
  		},
  
  		verbose: false
  	};
  
  	//----------------------------------------
  	// init
  	//----------------------------------------
  	env = getEnv();
  	if (context.window) {
  		contextDoc = window.document;
  	}
  
  	//----------------------------------------
  	// setup environment
  	//----------------------------------------
  
  	Domil_orig = context.Doml;
  
  	if (env.isEnder) {
  		module.exports = new Doml();
  	} else if (env.isBrowser) {
  		Doml.noConflict = function () {
  			context.Doml = Domil_orig;
  			return Doml;
  		};
  		context.Doml = Doml;
  	} else if (env.isModule) {
  		module.exports = Doml;
  		Doml.noConflict = function () {};
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
  			this.forEach(function (el) {
  				var element = d.create.apply(d, arguments);
  				el.appendChild(element);
  			})
  		}
  	}, true);	
  
  	$.id = function (id) {
  		return $([document.getElementById(id)]);
  	};
  
  }(ender || $);

}();