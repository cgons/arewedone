# arewedone.js
A simple mini-library that calls a callback when various (tracked) assets are done loading. 

### Why use arewedone.js?
If you need to load multiple assets (images, scripts, webfonts etc.. ) asynchronously and only proceed once 
all requried assets are loaded, arewedone.js can help. 

Essentially, arewedone.js is a queue that marks assets as loaded when notifed and then calls the provided callback when all assets
have been marked as done loading. 

Alternativey, instead of arewedone.js, one could use [native Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 
or a Promises library such as [bluebird](http://bluebirdjs.com/docs/getting-started.html). 


### Usage
If using Browserify, Webpack, etc... `npm install arewedone` OR, include the [arewedone.js](https://github.com/cgons/arewedone/blob/master/arewedone.js) 
file directly. 

Once arewedone.js is installed, using it in your project is simple:

```javascript
// arewedone.Tracker will call this callback when all assets have loaded
function mycallback() {
  console.log('All assets loaded!');
}


// Create a Tracker instance, initialized with our callback
const tracker = arewedone.Tracker(mycallback);

// Add an asset to be tracked
// Note: the asset being tracked is added by simply providing a unique string name 
tracker.add('jquery');


// (As an exmaple) Let's load jQuery
const jqScriptTag = document.createElement('script');
jqScriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js';

// When the jQuery script tag is loaded, the browser will execute the onload function below 
// In the onload function, we notify our tracker that jQuery is done loading
jqScriptTag.onload = function() { tracker.notify('jquery'); };
```

That's it!
Once jQuery has loaded, our tracker will be notified and if no other assets are waiting to load, it will call `mycallback`.

-

Please report any issues on Github.

_This project is MIT licenced._
