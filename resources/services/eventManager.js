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

let BaseEventManager = {
    _listeners: {},

    //events
    ON_FOCUS_CHANGE: "ON_FOCUS_CHANGE",

    /**
    * Add listener to specified event
    */
    on: function (event_name, callback) {
        if (!this._listeners[event_name]) {
            this._listeners[event_name] = [];
        }
        if (this._listeners[event_name].indexOf(callback) === -1) {
            this._listeners[event_name].push(callback);
        }
    },

    /**
     * Remove specified event listener
     */
    delListener: function (event_name, callback) {
        if (!this._listeners[event_name]) {
            return;
        }

        let pos = this._listeners[event_name].indexOf(callback);

        if (pos >= 0) {
            delete this._listeners[event_name][pos];
        }
    },

    /**
     * Clears listeners (remove all listeners for all events)
     */
    clearListeners: function () {
        this._listeners = {};
    },

    /**
     * Fire specified event
     */
    fireEvent: function (event_name, original_event) {
        var list = [];

        list.push({
            event_name: event_name,
            original_event: original_event
        });

        this._processEvents(list);
    },

    /**
     * Processing events from specified list
     */
    _processEvents: function (list) {
        if (!this._listeners) {
            return;
        }

        for (var e of list) {
            if (!this._listeners[e.event_name]) {
                continue;
            }

            for (let i in this._listeners[e.event_name]) {
                this._listeners[e.event_name][i](e.original_event);
            }
        }
    }
};


module.exports = BaseEventManager;