/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright 2019 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/**
 * This is a workaround for scene events.
 *
 * Objects of scene support only one event handler with the same source code.
 * Also, event listeners looks like cannot be deleted from scene.
 */
'use strict'
px.import({
  events: './events.js',
}).then(function importsAreReady(imports) {

  var EventEmitter = imports.events;

  /**
   * Return event emitter for scene
   *
   * It cache event emitter and return for the scene same event emitter.
   *
   * @param {Object} scene scene
   *
   * @returns {EventEmitter} eventEmitter
   */
  function getSceneEventEmitter(scene) {
    var cachedScene = getSceneEventEmitter.cache.find((cacheItem) => {
      return cacheItem.scene === scene;
    });

    if (!cachedScene) {
      cachedScene = {
        scene: scene,
        ee: new EventEmitter(),
      }
      cachedScene.ee.setMaxListeners(10000);

      getSceneEventEmitter.supportedEvents.forEach((eventName) => {
        scene.on(eventName, (evt) => {
          cachedScene.ee.emit(eventName, evt);
        });
      });

      getSceneEventEmitter.cache.push(cachedScene);
    }

    return cachedScene.ee;
  }

  // the full list of the events supported by scene
  getSceneEventEmitter.supportedEvents = [
    'onMouseDown',
    'onMouseUp',
    'onMouseMove',
    'onMouseEnter',
    'onMouseLeave',
    'onFocus',
    'onBlur',
    'onKeyDown',
    'onKeyUp',
    'onChar',
    'onResize',
  ]

  getSceneEventEmitter.cache = [];

  module.exports.getSceneEventEmitter = getSceneEventEmitter;

}).catch(function importFailed(err) {
  console.error("Import failed: " + err);
});
