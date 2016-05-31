describe('The Tracker add method', function() {

    it('adds an item to the tracking queue', function() {
        const tracker = new arewedone.Tracker();
        tracker.add('testitem');
        expect(tracker.trackingQueue.testitem).toBeDefined();
    });

    it('adds an item to the events map/queue', function() {
        const tracker = new arewedone.Tracker();
        tracker.add('testitem');
        expect(tracker.events.testitem).toBeDefined();
    });
});

describe('The Tracker _eventListener method', function() {

    it('removes an item from the loaderQueue (if present) when called', function() {
        const tracker = new arewedone.Tracker();
        tracker.trackingQueue.testitem = 1;

        const mockEvent = { type: 'testitem'};
        tracker._eventListener(mockEvent);

        expect(Object.keys(tracker.trackingQueue).length).toEqual(0);
    });

    it('calls the callback function (when there are no more items in the loaderQueue)', function() {
        const mockCallback = function() {};

        const tracker = new arewedone.Tracker(mockCallback);

        spyOn(tracker, 'callback');

        const mockEvent = { type: 'testitem'};
        tracker._eventListener(mockEvent);

        expect(tracker.callback).toHaveBeenCalled();
    });

});

// The tests below are more integration in nature as the Tracker API is used to setup and
// manipulate state.
describe('The Tracker performs as expected when', function() {

    it('an asset is done loading resulting in the main callback being called', function() {
        const mockCallback = function() {};

        const tracker = new arewedone.Tracker(mockCallback);
        spyOn(tracker, 'callback');

        tracker.add('testitem');
        tracker.notify('testitem');

        expect(tracker.callback).toHaveBeenCalled();
    });

    it('multiple assets are done loading (after delays) resulting in the main callback being called', function(done) {
        const mockCallback = function() {};

        const tracker = new arewedone.Tracker(mockCallback);
        spyOn(tracker, 'callback');

        tracker.add('testitem1');
        tracker.add('testitem2');

        tracker.notify('testitem2');

        // TODO: Use Jasmine's clock functions to mock setTimeout
        window.setTimeout(function() {
            tracker.notify('testitem1');
            expect(tracker.callback).toHaveBeenCalled();
            done();
        }, 250);
    });

    it('no assets are done loading - ensuring the callback is not called', function() {
        const mockCallback = function() {};

        const tracker = new arewedone.Tracker(mockCallback);
        spyOn(tracker, 'callback');

        tracker.add('testitem1');

        expect(tracker.callback).not.toHaveBeenCalled();
    });

    it('only some assets in the queue are done loading - ensuring the callback is not called', function() {
        const mockCallback = function() {};

        const tracker = new arewedone.Tracker(mockCallback);
        spyOn(tracker, 'callback');

        tracker.add('testitem1');
        tracker.add('testitem2');

        tracker.notify('testitem2');

        expect(tracker.callback).not.toHaveBeenCalled();
    });

});
