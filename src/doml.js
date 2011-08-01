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
			var	i, n, ptr, t;
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
				// elements
				n = arg.length;
				for (i = 0; i < n; i += 1) {
// FIXME: need to recurse					
				}
				break;
			case 'object':
				// attributes
				handleAttrs.call(this,arg);
				break;
			case 'function':
				t = arg.call(this);
				if (t) {
					procArg.call(this, t);
				}
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