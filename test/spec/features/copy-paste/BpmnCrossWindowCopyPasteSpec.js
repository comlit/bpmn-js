import {
  inject,
  bootstrapModeler,
} from 'test/TestHelper';

import EventBus from 'diagram-js/lib/core/EventBus';
import bpmnCrossWindowCopyPasteModule from 'lib/features/copy-paste/';
import bpmnCopyPasteModule from 'lib/features/copy-paste';
import copyPasteModule from 'diagram-js/lib/features/copy-paste';
import coreModule from 'lib/core';
import modelingModule from 'lib/features/modeling';


describe.only('features/window-copy-paste', function () {

  var testModules = [
    bpmnCrossWindowCopyPasteModule,
    bpmnCopyPasteModule,
    copyPasteModule,
    coreModule,
    modelingModule
  ];

  var basicXML = require('./basic.bpmn')

  beforeEach(bootstrapModeler(basicXML, {
    modules: testModules
  }));

  describe('revive string', function () {

    // False JSON
    it('should pass with valid JSON', inject(function (elementRegistry, bpmnCrossWindowCopyPaste, moddle, copyPaste) {

      // create event
      var startEvent = elementRegistry.get('StartEvent_1'),
        mockString = JSON.stringify(startEvent);

      copyPaste.copy(startEvent);

      var reviver = bpmnCrossWindowCopyPasteModule.createReviver(moddle)

      console.log(typeof copyPaste);

      var revivedEvent = JSON.parse(mockString, reviver);

      // checks that system copy is identical to the input string.
      expect(revivedEvent).to.equal(startEvent);
    }));

    // Invalid JSON
    it('should fail with invalid JSON', inject(function (bpmnCrossWindowCopyPaste, moddle) {
      var mockString = 'invalid JSON string';

      expect(function () {
        JSON.parse(mockString, bpmnCrossWindowCopyPaste.createReviver(moddle));
      }).to.throw('Unexpected token i in JSON at position 0');

    }));

  });

  // Test copy/paste into system cliboard
  describe('copy/paste into system clipboard', function () {

    // Mock data into cliboard
    it('should copy into system clipboard', inject(function (elementRegistry, copyPaste) {

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

