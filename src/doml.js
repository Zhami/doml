!function (context) {

	var	Doml, env, isArray, isNode;

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

	isNode = function (node) {
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
		this.element = null;
		this.tagName = undefined;
		this.content = '';
		this.attrs = {};
		this.elems = [];	// will be made children
	};

	Element.prototype = (function () {
		var	createElement, procArg, procArgs;

		//----------------------------------------
		// private methods
		//----------------------------------------

		createElement = function () {
			var	element, i, n, ptr, s, setAttr;

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
			this.element = element = this.document.createElement(this.tagName);

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
			
			// add children elements
			ptr = this.elems;
			n = ptr.length;
			for (i = 0; i < n; i += 1) {
				element.appendChild(ptr[i]);
			}
		};

		procArg = function (arg) {
			var	i, n, ptr, t;
			t = isArray(arg) ? 'array' : typeof arg;
			if (t === 'object' && isNode(arg)) {
				t = 'node';
			}
			switch (t) {
			case 'node':
				this.elems.push(arg);
				break;
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
		// public methods
		//----------------------------------------
		return {
			create: function () {
				if ((arguments.length === 1) && isNode(node = arguments[0])) {
					this.element = node.cloneNode(true);
				} else {
					procArgs.call(this, arguments);
					if (this.tagName) {
						createElement.apply(this);
					}
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
	};

	Doml.prototype = {

		create: function () {
			var	node;
			node = new Element(this.document);
			node.create.apply(node, arguments);
			return node.getElement();
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