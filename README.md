Doml
------
A DOM constructor. Because sometimes you're just wantn' something simple.

Designed for quick DOM node construction. Compare it to [Builder](https://github.com/syntacticx/builder)

Inspired by how I used to use jquery-haml.

=======

Doml works as native Javascript (i.e., <code>require</code> it into your node app), in the browser (i.e., use it in a <code>&lt;script&gt;</code> tag), and as an Ender library component (i.e., works in the <code>$()</code> chain).

It works like this as native Javascript:

``` js
doml = new Doml();
el = doml.create('script', {src:'http://freegeoip.net/json/?callback=cb'});
document.body.appendChild(el);
```

Set attributes:
``` 
elem = doml.create('input', 'input', {type:'checkbox', checked: true});
```

Embed other DOM nodes:
``` 
elem = doml.create('div', 'text1', ['p', 'p-text'], 'text2', ['span', 'span-text']);
```

Adaptive generation (pseudo-templating) with runtime computed args:

``` js
elem = doml.create('div', function (args) {
	var elems = [];
	elems.push(doml.create('p', args.text1));
	elems.push(doml.create('span', args.text2));
	return elems;
}, {text1: 'text1', text2: 'text2'});
```

See the tests for usage patterns, and how to use natively, in browser, and with Ender.

Install
-----
    npm install doml


Ender integration
-----
If you don't already have [Ender](http://ender.no.de) (an npm package) install it now (and don't look back)

    $ npm install ender -g

To combine Doml to your Ender build, you can add it as such:

	$ ender build doml[,modb, modc,...]

or, add it to your existing ender package

    $ ender add doml

Doml requires [Bonzo](https://github.com/ded/bonzo) be in your Ender lib.

Use it like this:

``` js
$(body).doml('div', 'hello'); // add a div with text "hello"
```

Build
-----
If you want to build from src:

    npm run-script boosh

TODO
-----
Make Doml [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) compatible


Contributors
-----

   * [Stuart Malin](https://github.com/zhami/doml/commits/master?author=zhami)
