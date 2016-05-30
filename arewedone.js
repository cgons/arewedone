function Tracker(callback) {
    this.trackingQueue = {}
    this.events = {}
    this.callback = callback
}

Tracker.prototype.add = function (name) {
    this.trackingQueue[name] = 1

    // Create custom event for client to dispatch when asset loaded
    var _event = new CustomEvent(name)

    // Add above event to internal map so we can reference and fire it later
    this.events[name] = _event

    // We listen for when the client fires the above custom event
    document.addEventListener(name, this._eventListener.bind(this))

    return _event
}

Tracker.prototype.notify = function(name) {
    document.dispatchEvent(this.events[name])
}

Tracker.prototype._eventListener = function(e) {
    // When we receive an event, pop it from the queue
    if (this.trackingQueue.hasOwnProperty(e.type)) {
        delete this.trackingQueue[e.type]
    }
    // If the queue is empty, we know all assets have been loaded and can
    // then fire the client provided callback
    if (Object.keys(this.trackingQueue).length === 0) {
        if (typeof this.callback === 'function') {
            this.callback()
        }
    }
    // Note: it is entirely up to the client to ensure they only fire an event
    // when their own conditions are met/their asset has loaded.
}

if (typeof window === 'undefined') {
    module.exports = {
        'Tracker': Tracker
    };
} else {
    window.arewedone = {};
    window.arewedone.Tracker = Tracker;
}
