!function (context) {

	var	contextDoc, createNode, doml, Doml, env, getGlobal, isArray, procArgs, procTag;

//	var sys = require('sys');
//	var	eyes = require('eyes');

	//----------------------------------------
	// support
	//----------------------------------------
	isArray = function (x) {
		return Boolean(x && (Object.prototype.toString.apply(x) === '[object Array]'));
	};

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
		env.isBowser = Boolean(typeof global.window !== 'undefined');
		env.isEnder = Boolean(typeof context.ender !== 'undefined');
		env.isModule = Boolean(typeof module !== 'undefined' && module.exports);
		env.hasRequire = Boolean(typeof require === 'function');
		return env;
	};

	//----------------------------------------
	// init
	//----------------------------------------
	env = getEnv();
	if (context.window) {
		contextDoc = window.document;
	}

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
		if (! doc && env.isBowser) {
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
			var	rootNode;

			this.clear();
			procArgs.call(this, arguments);

			if (!this.document || !this.tagName) {
				return null;
			} else {
				rootNode = createNode.call(this);
				return rootNode;
			}
		},

		setDocument: function (doc) {
			this.document = doc;
		},

		verbose: false
	};

	//----------------------------------------
	// setup environment
	//----------------------------------------

	if (env.isEnder) {
		module.exports = new Doml();
	} else if (env.isModule) {
		module.exports = Doml;
		Doml.noConflict = function () {};
	} else {
		!function () {
			var	old;
			old = context.Doml;
			Doml.noConflict = function () {
				context.Doml = old;
				return Doml;
			};
			return this;
		}();
		context.Doml = Doml;
	}


}(this);