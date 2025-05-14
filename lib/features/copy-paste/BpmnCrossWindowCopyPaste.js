
/**
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 * @typedef {import('../../model/Types').Moddle} Moddle
 */

import { event } from 'min-dom';

/**
 * Cross-window copy-paste
 * 
 * @param {EventBus} eventBus
 * @param {Moddle} moddle
 * @param {Clipboard} clipboard
 */
export default function BpmnCrossWindowCopyPaste(
  eventBus,
  moddle,
  clipboard
) {
    eventBus.on('copyPaste.elementsCopied', event => {
        const { tree } = event;
  
        //console.log('Copying to system clipboard', tree);
        navigator.clipboard.writeText(JSON.stringify(tree))
      });

    eventBus.on('canvas.focus.changed', event => {
        const { focused } = event;
        if(focused) {
            navigator.clipboard.readText()
                .then(text => {
                //lacks check if clipboard contents is a vaild serialized diagram

                //console.log('Clipboard contents:', text);
                const parsedCopy = JSON.parse(text, createReviver(moddle));
                    clipboard.set(parsedCopy);
                })
                .catch(err => {
                    console.error('Failed to read clipboard contents: ', err);
                });
        }
    });


    /**
     * A factory function that returns a reviver to be
     * used with JSON#parse to reinstantiate moddle instances.
     *
     * @param  {Moddle} moddle
     *
     * @return {Function}
     */
    function createReviver(moddle) {

        var elCache = {};
    
        /**
         * The actual reviewer that creates model instances
         * for elements with a $type attribute.
         *
         * Elements with ids will be re-used, if already
         * created.
         *
         * @param  {String} key
         * @param  {Object} object
         *
         * @return {Object} actual element
         */
        return function(key, object) {
    
        if (typeof object === 'object' && typeof object.$type === 'string') {
    
            var objectId = object.id;
    
            if (objectId && elCache[objectId]) {
            return elCache[objectId];
            }
    
            var type = object.$type;
            var attrs = Object.assign({}, object);
    
            delete attrs.$type;
    
            var newEl = moddle.create(type, attrs);
    
            if (objectId) {
            elCache[objectId] = newEl;
            }
    
            return newEl;
        }
    
        return object;
        };
    }
}

BpmnCrossWindowCopyPaste.$inject = [
    'eventBus',
    'moddle',
    'clipboard'
    ];