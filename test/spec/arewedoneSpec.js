// Testing publc methods
// ----------------------------------------------

describe('The Tracker constructor:', function() {

    it('throws an error if invalid callback function provided', function() {
        expect(arewedone.Tracker).toThrow();
    });

});

describe('The Tracker add() method:', function() {

    it('adds the specified item to the queue with required attrs.', function() {
        var tracker = new arewedone.Tracker(function(){});
        tracker.add('testasset');

        // Ensure the item was added to the queue
        expect(tracker.trackingQueue.testasset).toBeDefined();

        // Ensure the queue item has the requied attrs.
        var queueItem = tracker.trackingQueue.testasset;
        expect(queueItem.name).toEqual('testasset');
        expect(queueItem.status).toEqual(0);
    });

});

describe('The Tracker markDone() method:', function() {

    it('notifies the tracker that the specified asset is done loading.', function() {
        var tracker = new arewedone.Tracker(function(){});
        tracker.add('testasset');
        tracker.markDone('testasset');

        expect(tracker.trackingQueue.testasset.status).toEqual(1);
    });

    it('fires the user callback when all assets are loaded.', function() {
        function mockCallback() {}
        var tracker = new arewedone.Tracker(mockCallback);
        spyOn(tracker, 'callback');

        tracker.add('testasset');
        tracker.markDone('testasset');

        expect(tracker.callback).toHaveBeenCalled();
    });

});

describe('The Tracker markFailed() method:', function() {

    it('notifies the tracker that the specified asset has failed loading.', function() {
        var tracker = new arewedone.Tracker(function() {});
        tracker.add('testasset');
        tracker.markFailed('testasset');

        expect(tracker.trackingQueue.testasset.status).toEqual(-1);
    });

});


describe('The Tracker anyPending() method:', function() {

    it('returns true if any asset is in a pending state.', function() {
        var tracker = new arewedone.Tracker(function() {});
        tracker.add('testasset');
        tracker.add('testasset2');
        tracker.markDone('testasset');

        expect(tracker.anyPending()).toEqual(true);
    });

    it('returns false if no assets are in a penidng state.', function() {
        var tracker = new arewedone.Tracker(function() {});
        tracker.add('testasset');
        tracker.markDone('testasset');

        expect(tracker.anyPending()).toEqual(false);
    });
});


// Testing internal methods
// ----------------------------------------------

describe('The Tracker _assetExists() method:', function() {

    it('throws an error when the asset does not exist.', function() {
        var tracker = new arewedone.Tracker(function() {});
        expect(tracker._assetExists.bind(tracker, 'fake')).toThrow();
    });

    it('returns true when an asset exists.', function() {
        var tracker = new arewedone.Tracker(function() {});
        tracker.add('testasset');
        expect(tracker._assetExists('testasset')).toEqual(true);
    })
});

describe('The Tracker _checkAllLoaded() method:', function() {

    it('returns true when all tracked assets are loaded.', function() {
        var tracker = new arewedone.Tracker(function() {});
        tracker.add('testasset');
        tracker.markDone('testasset');
        expect(tracker._checkAllLoaded()).toEqual(true);
    });

    it('returns false when any tracked asset is pending/failed to load.', function() {
        var tracker = new arewedone.Tracker(function() {});
        tracker.add('testasset');
        expect(tracker._checkAllLoaded()).toEqual(false);
    });

});
