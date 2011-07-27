Doml
------
A DOM constructor. Because sometimes you're just wantn' something simple.

Designed for quick DOM node construction. Compare it to [Builder](https://github.com/syntacticx/builder)

SLOW DOWN -- still under much development -- not an accurate README yet
=======

It works like this:

``` js
if (bowser.msie && bowser.version <= 6) {
  alert('Hello Doml');
}
```

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
if ($.browser.chrome) {
  alert('Hello Silicon Valley');
}
```

Build
-----
If you want to build from src:

    npm run-script boosh

Contributors
-----

   * [Stuart Malin](https://github.com/zhami/doml/commits/master?author=zhami)
