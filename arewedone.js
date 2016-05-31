// Tracker Constructor
// ----------------------------------------------

/**
 * Represents a tracker object that tracks the loading status of various assets.
 * @constructor
 * @param {function} callback - Function to be called when all assets have loaded.
 */
function Tracker(callback) {
    if (typeof callback !== 'function') {
        throw new Error('Please provide a valid function for your callback.')
    }
    this.trackingQueue = {};
    this.callback = callback;
}


// Public API Methods
// ----------------------------------------------

/**
 * Add an asset to be tracked.
 * @param {string} name - A unique string name to identify this asset.
 */
Tracker.prototype.add = function(name) {
    // Put the asset onto the queue
    // 0 -> Asset not loaded (pending)
    // 1 -> Asset loaded
    // -1 -> Asset failed to load
    var asset = {};
    asset.name = name;
    asset.status = 0;
    this.trackingQueue[name] = asset;

};

/**
 * Notify the tracker that the asset has completed loaded.
 * @param {string} name - The asset's string identifier (first provided by
 * {@link Tracker#add}).
 */
Tracker.prototype.markDone = function(name) {
    if (this._assetExists(name)) {
        // Set the asset's status to done.
        this.trackingQueue[name].status = 1;

        if (this._checkAllLoaded() === true) {
            this.callback();
        }
    }
};

/**
 * Notify the tracker that the specified asset failed to load.
 * Throws an exception if the asset name specified does not exist.
 * @param {string} name - The asset's string identifier (first provided by
 * {@link Tracker#add}).
 */
Tracker.prototype.markFailed = function(name) {
    if (this._assetExists(name)) {
        this.trackingQueue[name].status = -1;
    }
};

/**
 * Determines if any assets are pending (status)
 * @return {boolean} - Pending status
 */
Tracker.prototype.anyPending = function() {
    var keys = Object.keys(this.trackingQueue);
    for (var i = 0; i < keys.length;  i++) {
        var qitem = this.trackingQueue[keys[i]];
        if (qitem.status === 0) {
            return true;
        }
    }
    return false;
}


// Internal Functions
// ----------------------------------------------

// Ensure the asset (string name provided) exists in the trackingQueue.
Tracker.prototype._assetExists = function(name) {
    var asset = this.trackingQueue[name];
    if (asset === undefined) {
        throw new Error('Specified asset not found.')
    }
    return true;
};


// Checks the status of all tracked assets. If all assets have
// a status of "1" - indicating they are loaded, returns true. Otherwise, false.
Tracker.prototype._checkAllLoaded = function() {
    var keys = Object.keys(this.trackingQueue);
    for (var i = 0; i < keys.length;  i++) {
        var qitem = this.trackingQueue[keys[i]];
        if (qitem.status < 1) {
            return false;
        }
    }
    return true;
};


// Exports
// ----------------------------------------------

if (typeof window === 'undefined') {
    module.exports = {
        'Tracker': Tracker
    };
} else {
    window.arewedone = {};
    window.arewedone.Tracker = Tracker;
}
