import {
  inject
} from 'test/TestHelper';

// import EventBus from 'diagram-js/lib/core/EventBus';
// import BpmnCrossWindowCopyPaste from 'lib/features/copy-paste/BpmnCrossWindowCopyPaste';


describe('features/window-copy-paste', function() {

  // Test Reviver
  describe('revive string', function() {

    // False JSON
    it('should pass with valid JSON', inject(function(elementRegistry, BpmnCrossWindowCopyPaste, moddle) {

      // create event
      var startEvent = elementRegistry.get('StartEvent_1'),
          mockString = JSON.stringify(startEvent);

      // revive mock string
      var revivedEvent = JSON.parse(mockString, BpmnCrossWindowCopyPaste.createReviver(moddle));

      // checks that system copy is identical to the input string.
      expect(revivedEvent).to.equal(startEvent);
    }));

    // Invalid JSON
    it('should fail with invalid JSON', inject(function() {

      // create valid JSON

      // Check valid return
    }));

  });

  // Test copy/paste into system cliboard
  describe('copy/paste into system clipboard', function() {

    // Mock data into cliboard
    it('should copy into system clipboard', inject(function(elementRegistry, copyPaste) {

      // create mock JSON string
      var startEvent = elementRegistry.get('StartEvent_1'),
          mockString = JSON.stringify(startEvent);

      // triggers copy event, which triggers system copy.
      copyPaste.copy(startEvent);

      // checks that system copy is identical to the input string.
      navigator.clipboard.readText().then(text => { expect(text).to.equal(mockString); });
    }));

  });

  /*
  // Test Event catch for focus changee
  describe('focus change', function() {

    it('should catch focus change event', inject(function() {

      // Trigger Event of focus change
      EventBus.fire('canvas.focus.changed', { focused: true });

      // Check if caught
    }));

  });
  */

});

