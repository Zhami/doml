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

Decorate with CSS attributes:
``` 
elem = doml.create('p', 'hello', {css: "color:red; border:2px solid green;"});
Set attributes:
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

Use it like this:

``` js
// create an Ender element set
enderSet = $.doml('div', 'hello');

// clone an element to create an Ender element set
elem = document.getElementById('the-span');
enderSet = $.doml(elem);

// chain
body = document.getElementsByTagName('BODY')[0];
$(body).doml('div', 'hello');  // appends new DIV (with text "hello" to BODY)

// construct and append a DOM sub-tree
$(body).doml('div', ['p', 'hello', {id: "p-hello"}], ['span', 'there', {css: "color:red;"}]);
$(body).doml('div', $.doml('p')[0], $.doml('span')[0]);
```

Doml does not require that [Bonzo](https://github.com/ded/bonzo) be in your Ender lib.
(But that doesn't mean you shouldn't use it.)


Build
-----
If you want to build from src:

    npm run-script boosh

Tests
-----

Test native: <code>$ node test/tests.js</code>

Test in browser: point your browser to <code>test/test.html</code>

Test in browser with Ender: point your browser to <code>test/ender-test.html</code>


TODO
-----
Make Doml [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) compatible


Contributors
-----

   * [Stuart Malin](https://github.com/zhami/doml/commits/master?author=zhami) [@Zhami](http://twitter.com/#!/zhami)
