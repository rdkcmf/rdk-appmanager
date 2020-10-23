/**
 * App version: 1.0.0
 * SDK version: 2.6.0
 * CLI version: 2.0.2
 *
 * Generated: Thu, 03 Dec 2020 22:41:15 GMT
 */

var APP_com_comcast_FactoryApp = (function () {
	'use strict';

	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function getMergeFunction(key, options) {
		if (!options.customMerge) {
			return deepmerge
		}
		var customMerge = options.customMerge(key);
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function(symbol) {
				return target.propertyIsEnumerable(symbol)
			})
			: []
	}

	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	}

	function propertyIsOnObject(object, property) {
		try {
			return property in object
		} catch(_) {
			return false
		}
	}

	// Protects from prototype poisoning and unexpected merging up the prototype chain.
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
			&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
				&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
	}

	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) {
			getKeys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			});
		}
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) {
				return
			}

			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
				destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			} else {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			}
		});
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
		// implementations can use it. The caller may not replace it.
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	};

	var deepmerge_1 = deepmerge;

	var cjs = deepmerge_1;

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	var Lightning = window.lng;

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	const settings = {};
	const subscribers = {};

	const initSettings = (appSettings, platformSettings) => {
	  settings['app'] = appSettings;
	  settings['platform'] = platformSettings;
	  settings['user'] = {};
	};

	const publish = (key, value) => {
	  subscribers[key] && subscribers[key].forEach(subscriber => subscriber(value));
	};

	const dotGrab = (obj = {}, key) => {
	  const keys = key.split('.');
	  for (let i = 0; i < keys.length; i++) {
	    obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {};
	  }
	  return typeof obj === 'object' ? (Object.keys(obj).length ? obj : undefined) : obj
	};

	var Settings = {
	  get(type, key, fallback = undefined) {
	    const val = dotGrab(settings[type], key);
	    return val !== undefined ? val : fallback
	  },
	  has(type, key) {
	    return !!this.get(type, key)
	  },
	  set(key, value) {
	    settings['user'][key] = value;
	    publish(key, value);
	  },
	  subscribe(key, callback) {
	    subscribers[key] = subscribers[key] || [];
	    subscribers[key].push(callback);
	  },
	  unsubscribe(key, callback) {
	    if (callback) {
	      const index = subscribers[key] && subscribers[key].findIndex(cb => cb === callback);
	      index > -1 && subscribers[key].splice(index, 1);
	    } else {
	      if (key in subscribers) {
	        subscribers[key] = [];
	      }
	    }
	  },
	  clearSubscribers() {
	    for (const key of Object.getOwnPropertyNames(subscribers)) {
	      delete subscribers[key];
	    }
	  },
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	const prepLog = (type, args) => {
	  const colors = {
	    Info: 'green',
	    Debug: 'gray',
	    Warn: 'orange',
	    Error: 'red',
	  };

	  args = Array.from(args);
	  return [
	    '%c' + (args.length > 1 && typeof args[0] === 'string' ? args.shift() : type),
	    'background-color: ' + colors[type] + '; color: white; padding: 2px 4px; border-radius: 2px',
	    args,
	  ]
	};

	var Log = {
	  info() {
	    Settings.get('platform', 'log') && console.log.apply(console, prepLog('Info', arguments));
	  },
	  debug() {
	    Settings.get('platform', 'log') && console.debug.apply(console, prepLog('Debug', arguments));
	  },
	  error() {
	    Settings.get('platform', 'log') && console.error.apply(console, prepLog('Error', arguments));
	  },
	  warn() {
	    Settings.get('platform', 'log') && console.warn.apply(console, prepLog('Warn', arguments));
	  },
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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
	class Locale {
	  constructor() {
	    this.__enabled = false;
	  }

	  /**
	   * Loads translation object from external json file.
	   *
	   * @param {String} path Path to resource.
	   * @return {Promise}
	   */
	  async load(path) {
	    if (!this.__enabled) {
	      return
	    }

	    await fetch(path)
	      .then(resp => resp.json())
	      .then(resp => {
	        this.loadFromObject(resp);
	      });
	  }

	  /**
	   * Sets language used by module.
	   *
	   * @param {String} lang
	   */
	  setLanguage(lang) {
	    this.__enabled = true;
	    this.language = lang;
	  }

	  /**
	   * Returns reference to translation object for current language.
	   *
	   * @return {Object}
	   */
	  get tr() {
	    return this.__trObj[this.language]
	  }

	  /**
	   * Loads translation object from existing object (binds existing object).
	   *
	   * @param {Object} trObj
	   */
	  loadFromObject(trObj) {
	    const fallbackLanguage = 'en';
	    if (Object.keys(trObj).indexOf(this.language) === -1) {
	      Log.warn('No translations found for: ' + this.language);
	      if (Object.keys(trObj).indexOf(fallbackLanguage) > -1) {
	        Log.warn('Using fallback language: ' + fallbackLanguage);
	        this.language = fallbackLanguage;
	      } else {
	        const error = 'No translations found for fallback language: ' + fallbackLanguage;
	        Log.error(error);
	        throw Error(error)
	      }
	    }

	    this.__trObj = trObj;
	    for (const lang of Object.values(this.__trObj)) {
	      for (const str of Object.keys(lang)) {
	        lang[str] = new LocalizedString(lang[str]);
	      }
	    }
	  }
	}

	/**
	 * Extended string class used for localization.
	 */
	class LocalizedString extends String {
	  /**
	   * Returns formatted LocalizedString.
	   * Replaces each placeholder value (e.g. {0}, {1}) with corresponding argument.
	   *
	   * E.g.:
	   * > new LocalizedString('{0} and {1} and {0}').format('A', 'B');
	   * A and B and A
	   *
	   * @param  {...any} args List of arguments for placeholders.
	   */
	  format(...args) {
	    const sub = args.reduce((string, arg, index) => string.split(`{${index}}`).join(arg), this);
	    return new LocalizedString(sub)
	  }
	}

	var Locale$1 = new Locale();

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let sendMetric = (type, event, params) => {
	  Log.info('Sending metric', type, event, params);
	};

	const initMetrics = config => {
	  sendMetric = config.sendMetric;
	};

	// available metric per category
	const metrics = {
	  app: ['launch', 'loaded', 'ready', 'close'],
	  page: ['view', 'leave'],
	  user: ['click', 'input'],
	  media: [
	    'abort',
	    'canplay',
	    'ended',
	    'pause',
	    'play',
	    'suspend',
	    'volumechange',
	    'waiting',
	    'seeking',
	    'seeked',
	  ],
	};

	// error metric function (added to each category)
	const errorMetric = (type, message, code, visible, params = {}) => {
	  params = { params, ...{ message, code, visible } };
	  sendMetric(type, 'error', params);
	};

	const Metric = (type, events, options = {}) => {
	  return events.reduce(
	    (obj, event) => {
	      obj[event] = (name, params = {}) => {
	        params = { ...options, ...(name ? { name } : {}), ...params };
	        sendMetric(type, event, params);
	      };
	      return obj
	    },
	    {
	      error(message, code, params) {
	        errorMetric(type, message, code, params);
	      },
	      event(name, params) {
	        sendMetric(type, name, params);
	      },
	    }
	  )
	};

	const Metrics = types => {
	  return Object.keys(types).reduce(
	    (obj, type) => {
	      // media metric works a bit different!
	      // it's a function that accepts a url and returns an object with the available metrics
	      // url is automatically passed as a param in every metric
	      type === 'media'
	        ? (obj[type] = url => Metric(type, types[type], { url }))
	        : (obj[type] = Metric(type, types[type]));
	      return obj
	    },
	    { error: errorMetric, event: sendMetric }
	  )
	};

	var Metrics$1 = Metrics(metrics);

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	class VersionLabel extends Lightning.Component {
	  static _template() {
	    return {
	      rect: true,
	      color: 0xbb0078ac,
	      h: 40,
	      w: 100,
	      x: w => w - 50,
	      y: h => h - 50,
	      mount: 1,
	      Text: {
	        w: w => w,
	        h: h => h,
	        y: 5,
	        x: 20,
	        text: {
	          fontSize: 22,
	          lineHeight: 26,
	        },
	      },
	    }
	  }

	  _firstActive() {
	    this.tag('Text').text = `APP - v${this.version}\nSDK - v${this.sdkVersion}`;
	    this.tag('Text').loadTexture();
	    this.w = this.tag('Text').renderWidth + 40;
	    this.h = this.tag('Text').renderHeight + 5;
	  }
	}

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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
	class FpsIndicator extends Lightning.Component {
	  static _template() {
	    return {
	      rect: true,
	      color: 0xffffffff,
	      texture: Lightning.Tools.getRoundRect(80, 80, 40),
	      h: 80,
	      w: 80,
	      x: 100,
	      y: 100,
	      mount: 1,
	      Background: {
	        x: 3,
	        y: 3,
	        texture: Lightning.Tools.getRoundRect(72, 72, 36),
	        color: 0xff008000,
	      },
	      Counter: {
	        w: w => w,
	        h: h => h,
	        y: 10,
	        text: {
	          fontSize: 32,
	          textAlign: 'center',
	        },
	      },
	      Text: {
	        w: w => w,
	        h: h => h,
	        y: 48,
	        text: {
	          fontSize: 15,
	          textAlign: 'center',
	          text: 'FPS',
	        },
	      },
	    }
	  }

	  _setup() {
	    this.config = {
	      ...{
	        log: false,
	        interval: 500,
	        threshold: 1,
	      },
	      ...Settings.get('platform', 'showFps'),
	    };

	    this.fps = 0;
	    this.lastFps = this.fps - this.config.threshold;

	    const fpsCalculator = () => {
	      this.fps = ~~(1 / this.stage.dt);
	    };
	    this.stage.on('frameStart', fpsCalculator);
	    this.stage.off('framestart', fpsCalculator);
	    this.interval = setInterval(this.showFps.bind(this), this.config.interval);
	  }

	  _firstActive() {
	    this.showFps();
	  }

	  _detach() {
	    clearInterval(this.interval);
	  }

	  showFps() {
	    if (Math.abs(this.lastFps - this.fps) <= this.config.threshold) return
	    this.lastFps = this.fps;
	    // green
	    let bgColor = 0xff008000;
	    // orange
	    if (this.fps <= 40 && this.fps > 20) bgColor = 0xffffa500;
	    // red
	    else if (this.fps <= 20) bgColor = 0xffff0000;

	    this.tag('Background').setSmooth('color', bgColor);
	    this.tag('Counter').text = `${this.fps}`;

	    this.config.log && Log.info('FPS', this.fps);
	  }
	}

	var version = "2.6.0";

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let AppInstance;

	const defaultOptions = {
	  stage: { w: 1920, h: 1080, clearColor: 0x00000000, canvas2d: false },
	  debug: false,
	  defaultFontFace: 'RobotoRegular',
	  keys: {
	    8: 'Back',
	    13: 'Enter',
	    27: 'Menu',
	    37: 'Left',
	    38: 'Up',
	    39: 'Right',
	    40: 'Down',
	    174: 'ChannelDown',
	    175: 'ChannelUp',
	    178: 'Stop',
	    250: 'PlayPause',
	    191: 'Search', // Use "/" for keyboard
	    409: 'Search',
	  },
	};

	if (window.innerHeight === 720) {
	  defaultOptions.stage['w'] = 1280;
	  defaultOptions.stage['h'] = 720;
	  defaultOptions.stage['precision'] = 0.6666666667;
	}

	function Application(App, appData, platformSettings) {
	  return class Application extends Lightning.Application {
	    constructor(options) {
	      const config = cjs(defaultOptions, options);
	      super(config);
	      this.config = config;
	    }

	    static _template() {
	      return {
	        w: 1920,
	        h: 1080,
	        rect: true,
	        color: 0x00000000,
	      }
	    }

	    _setup() {
	      Promise.all([
	        this.loadFonts((App.config && App.config.fonts) || (App.getFonts && App.getFonts()) || []),
	        Locale$1.load((App.config && App.config.locale) || (App.getLocale && App.getLocale())),
	      ])
	        .then(() => {
	          Metrics$1.app.loaded();

	          AppInstance = this.stage.c({
	            ref: 'App',
	            type: App,
	            forceZIndexContext: !!platformSettings.showVersion || !!platformSettings.showFps,
	          });

	          this.childList.a(AppInstance);

	          Log.info('App version', this.config.version);
	          Log.info('SDK version', version);

	          if (platformSettings.showVersion) {
	            this.childList.a({
	              ref: 'VersionLabel',
	              type: VersionLabel,
	              version: this.config.version,
	              sdkVersion: version,
	            });
	          }

	          if (platformSettings.showFps) {
	            this.childList.a({
	              ref: 'FpsCounter',
	              type: FpsIndicator,
	            });
	          }

	          super._setup();
	        })
	        .catch(console.error);
	    }

	    _handleBack() {
	      this.closeApp();
	    }

	    _handleExit() {
	      this.closeApp();
	    }

	    closeApp() {
	      Log.info('Closing App');

	      Settings.clearSubscribers();

	      if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
	        platformSettings.onClose();
	      } else {
	        this.close();
	      }
	    }

	    close() {
	      Log.info('Closing App');
	      this.childList.remove(this.tag('App'));

	      // force texture garbage collect
	      this.stage.gc();
	      this.destroy();
	    }

	    loadFonts(fonts) {
	      return new Promise((resolve, reject) => {
	        fonts
	          .map(({ family, url, descriptors }) => () => {
	            const fontFace = new FontFace(family, 'url(' + url + ')', descriptors || {});
	            document.fonts.add(fontFace);
	            return fontFace.load()
	          })
	          .reduce((promise, method) => {
	            return promise.then(() => method())
	          }, Promise.resolve(null))
	          .then(resolve)
	          .catch(reject);
	      })
	    }

	    set focus(v) {
	      this._focussed = v;
	      this._refocus();
	    }

	    _getFocused() {
	      return this._focussed || this.tag('App')
	    }
	  }
	}

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let basePath;
	let proxyUrl;

	const initUtils = config => {
	  basePath = ensureUrlWithProtocol(makeFullStaticPath(window.location.pathname, config.path || '/'));

	  if (config.proxyUrl) {
	    proxyUrl = ensureUrlWithProtocol(config.proxyUrl);
	  }
	};

	var Utils = {
	  asset(relPath) {
	    return basePath + relPath
	  },
	  proxyUrl(url, options = {}) {
	    return proxyUrl ? proxyUrl + '?' + makeQueryString(url, options) : url
	  },
	  makeQueryString() {
	    return makeQueryString(...arguments)
	  },
	  // since imageworkers don't work without protocol
	  ensureUrlWithProtocol() {
	    return ensureUrlWithProtocol(...arguments)
	  },
	};

	const ensureUrlWithProtocol = url => {
	  if (/^\/\//.test(url)) {
	    return window.location.protocol + url
	  }
	  if (!/^(?:https?:)/i.test(url)) {
	    return window.location.origin + url
	  }
	  return url
	};

	const makeFullStaticPath = (pathname = '/', path) => {
	  // ensure path has traling slash
	  path = path.charAt(path.length - 1) !== '/' ? path + '/' : path;

	  // if path is URL, we assume it's already the full static path, so we just return it
	  if (/^(?:https?:)?(?:\/\/)/.test(path)) {
	    return path
	  }

	  if (path.charAt(0) === '/') {
	    return path
	  } else {
	    // cleanup the pathname (i.e. remove possible index.html)
	    pathname = cleanUpPathName(pathname);

	    // remove possible leading dot from path
	    path = path.charAt(0) === '.' ? path.substr(1) : path;
	    // ensure path has leading slash
	    path = path.charAt(0) !== '/' ? '/' + path : path;
	    return pathname + path
	  }
	};

	const cleanUpPathName = pathname => {
	  if (pathname.slice(-1) === '/') return pathname.slice(0, -1)
	  const parts = pathname.split('/');
	  if (parts[parts.length - 1].indexOf('.') > -1) parts.pop();
	  return parts.join('/')
	};

	const makeQueryString = (url, options = {}, type = 'url') => {
	  // add operator as an option
	  options.operator = 'metrological'; // Todo: make this configurable (via url?)
	  // add type (= url or qr) as an option, with url as the value
	  options[type] = url;

	  return Object.keys(options)
	    .map(key => {
	      return encodeURIComponent(key) + '=' + encodeURIComponent('' + options[key])
	    })
	    .join('&')
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	class ScaledImageTexture extends Lightning.textures.ImageTexture {
	  constructor(stage) {
	    super(stage);
	    this._scalingOptions = undefined;
	  }

	  set options(options) {
	    this.resizeMode = this._scalingOptions = options;
	  }

	  _getLookupId() {
	    return `${this._src}-${this._scalingOptions.type}-${this._scalingOptions.w}-${this._scalingOptions.h}`
	  }

	  getNonDefaults() {
	    const obj = super.getNonDefaults();
	    if (this._src) {
	      obj.src = this._src;
	    }
	    return obj
	  }
	}

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	const formatLocale = locale => {
	  if (locale && locale.length === 2) {
	    return `${locale.toLowerCase()}-${locale.toUpperCase()}`
	  } else {
	    return locale
	  }
	};

	const getLocale = defaultValue => {
	  if ('language' in navigator) {
	    const locale = formatLocale(navigator.language);
	    return Promise.resolve(locale)
	  } else {
	    return Promise.resolve(defaultValue)
	  }
	};

	const getLanguage = defaultValue => {
	  if ('language' in navigator) {
	    const language = formatLocale(navigator.language).slice(0, 2);
	    return Promise.resolve(language)
	  } else {
	    return Promise.resolve(defaultValue)
	  }
	};

	const getCountryCode = defaultValue => {
	  if ('language' in navigator) {
	    const countryCode = formatLocale(navigator.language).slice(3, 5);
	    return Promise.resolve(countryCode)
	  } else {
	    return Promise.resolve(defaultValue)
	  }
	};

	const hasOrAskForGeoLocationPermission = () => {
	  return new Promise(resolve => {
	    // force to prompt for location permission
	    if (Settings.get('platform', 'forceBrowserGeolocation') === true) resolve(true);
	    if ('permissions' in navigator && typeof navigator.permissions.query === 'function') {
	      navigator.permissions.query({ name: 'geolocation' }).then(status => {
	        resolve(status.state === 'granted' || status.status === 'granted');
	      });
	    } else {
	      resolve(false);
	    }
	  })
	};

	const getLatLon = defaultValue => {
	  return new Promise(resolve => {
	    hasOrAskForGeoLocationPermission().then(granted => {
	      if (granted === true) {
	        if ('geolocation' in navigator) {
	          navigator.geolocation.getCurrentPosition(
	            // success
	            result =>
	              result && result.coords && resolve([result.coords.latitude, result.coords.longitude]),
	            // error
	            () => resolve(defaultValue),
	            // options
	            {
	              enableHighAccuracy: true,
	              timeout: 5000,
	              maximumAge: 0,
	            }
	          );
	        } else {
	          return queryForLatLon().then(result => resolve(result || defaultValue))
	        }
	      } else {
	        return queryForLatLon().then(result => resolve(result || defaultValue))
	      }
	    });
	  })
	};

	const queryForLatLon = () => {
	  return new Promise(resolve => {
	    fetch('https://geolocation-db.com/json/')
	      .then(response => response.json())
	      .then(({ latitude, longitude }) =>
	        latitude && longitude ? resolve([latitude, longitude]) : resolve(false)
	      )
	      .catch(() => resolve(false));
	  })
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	const defaultProfile = {
	  ageRating: 'adult',
	  city: 'New York',
	  zipCode: '27505',
	  countryCode: () => getCountryCode('US'),
	  ip: '127.0.0.1',
	  household: 'b2244e9d4c04826ccd5a7b2c2a50e7d4',
	  language: () => getLanguage('en'),
	  latlon: () => getLatLon([40.7128, 74.006]),
	  locale: () => getLocale('en-US'),
	  mac: '00:00:00:00:00:00',
	  operator: 'Metrological',
	  platform: 'Metrological',
	  packages: [],
	  uid: 'ee6723b8-7ab3-462c-8d93-dbf61227998e',
	  stbType: 'Metrological',
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let getInfo = key => {
	  const profile = { ...defaultProfile, ...Settings.get('platform', 'profile') };
	  return Promise.resolve(typeof profile[key] === 'function' ? profile[key]() : profile[key])
	};

	let setInfo = (key, params) => {
	  if (key in defaultProfile) defaultProfile[key] = params;
	};

	const initProfile = config => {
	  getInfo = config.getInfo;
	  setInfo = config.setInfo;
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	const events = [
	  'timeupdate',
	  'error',
	  'ended',
	  'loadeddata',
	  'canplay',
	  'play',
	  'playing',
	  'pause',
	  'loadstart',
	  'seeking',
	  'seeked',
	  'encrypted',
	];

	let mediaUrl = url => url;

	const initMediaPlayer = config => {
	  if (config.mediaUrl) {
	    mediaUrl = config.mediaUrl;
	  }
	};

	class Mediaplayer extends Lightning.Component {
	  _construct() {
	    this._skipRenderToTexture = false;
	    this._metrics = null;
	    this._textureMode = Settings.get('platform', 'textureMode') || false;
	    Log.info('Texture mode: ' + this._textureMode);
	  }

	  static _template() {
	    return {
	      Video: {
	        VideoWrap: {
	          VideoTexture: {
	            visible: false,
	            pivot: 0.5,
	            texture: { type: Lightning.textures.StaticTexture, options: {} },
	          },
	        },
	      },
	    }
	  }

	  set skipRenderToTexture(v) {
	    this._skipRenderToTexture = v;
	  }

	  get textureMode() {
	    return this._textureMode
	  }

	  get videoView() {
	    return this.tag('Video')
	  }

	  _init() {
	    //re-use videotag if already there
	    const videoEls = document.getElementsByTagName('video');
	    if (videoEls && videoEls.length > 0) this.videoEl = videoEls[0];
	    else {
	      this.videoEl = document.createElement('video');
	      this.videoEl.setAttribute('id', 'video-player');
	      this.videoEl.style.position = 'absolute';
	      this.videoEl.style.zIndex = '1';
	      this.videoEl.style.display = 'none';
	      this.videoEl.setAttribute('width', '100%');
	      this.videoEl.setAttribute('height', '100%');

	      this.videoEl.style.visibility = this.textureMode ? 'hidden' : 'visible';
	      document.body.appendChild(this.videoEl);
	    }
	    if (this.textureMode && !this._skipRenderToTexture) {
	      this._createVideoTexture();
	    }

	    this.eventHandlers = [];
	  }

	  _registerListeners() {
	    events.forEach(event => {
	      const handler = e => {
	        if (this._metrics && this._metrics[event] && typeof this._metrics[event] === 'function') {
	          this._metrics[event]({ currentTime: this.videoEl.currentTime });
	        }
	        this.fire(event, { videoElement: this.videoEl, event: e });
	      };
	      this.eventHandlers.push(handler);
	      this.videoEl.addEventListener(event, handler);
	    });
	  }

	  _deregisterListeners() {
	    Log.info('Deregistering event listeners MediaPlayer');
	    events.forEach((event, index) => {
	      this.videoEl.removeEventListener(event, this.eventHandlers[index]);
	    });
	    this.eventHandlers = [];
	  }

	  _attach() {
	    this._registerListeners();
	  }

	  _detach() {
	    this._deregisterListeners();
	    this.close();
	  }

	  _createVideoTexture() {
	    const stage = this.stage;

	    const gl = stage.gl;
	    const glTexture = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, glTexture);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	    this.videoTexture.options = { source: glTexture, w: this.videoEl.width, h: this.videoEl.height };
	  }

	  _startUpdatingVideoTexture() {
	    if (this.textureMode && !this._skipRenderToTexture) {
	      const stage = this.stage;
	      if (!this._updateVideoTexture) {
	        this._updateVideoTexture = () => {
	          if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
	            const gl = stage.gl;

	            const currentTime = new Date().getTime();

	            // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
	            // We'll fallback to fixed 30fps in this case.
	            const frameCount = this.videoEl.webkitDecodedFrameCount;

	            const mustUpdate = frameCount
	              ? this._lastFrame !== frameCount
	              : this._lastTime < currentTime - 30;

	            if (mustUpdate) {
	              this._lastTime = currentTime;
	              this._lastFrame = frameCount;
	              try {
	                gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
	                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
	                this._lastFrame = this.videoEl.webkitDecodedFrameCount;
	                this.videoTextureView.visible = true;

	                this.videoTexture.options.w = this.videoEl.videoWidth;
	                this.videoTexture.options.h = this.videoEl.videoHeight;
	                const expectedAspectRatio = this.videoTextureView.w / this.videoTextureView.h;
	                const realAspectRatio = this.videoEl.videoWidth / this.videoEl.videoHeight;
	                if (expectedAspectRatio > realAspectRatio) {
	                  this.videoTextureView.scaleX = realAspectRatio / expectedAspectRatio;
	                  this.videoTextureView.scaleY = 1;
	                } else {
	                  this.videoTextureView.scaleY = expectedAspectRatio / realAspectRatio;
	                  this.videoTextureView.scaleX = 1;
	                }
	              } catch (e) {
	                Log.error('texImage2d video', e);
	                this._stopUpdatingVideoTexture();
	                this.videoTextureView.visible = false;
	              }
	              this.videoTexture.source.forceRenderUpdate();
	            }
	          }
	        };
	      }
	      if (!this._updatingVideoTexture) {
	        stage.on('frameStart', this._updateVideoTexture);
	        this._updatingVideoTexture = true;
	      }
	    }
	  }

	  _stopUpdatingVideoTexture() {
	    if (this.textureMode) {
	      const stage = this.stage;
	      stage.removeListener('frameStart', this._updateVideoTexture);
	      this._updatingVideoTexture = false;
	      this.videoTextureView.visible = false;

	      if (this.videoTexture.options.source) {
	        const gl = stage.gl;
	        gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
	        gl.clearColor(0, 0, 0, 1);
	        gl.clear(gl.COLOR_BUFFER_BIT);
	      }
	    }
	  }

	  updateSettings(settings = {}) {
	    // The Component that 'consumes' the media player.
	    this._consumer = settings.consumer;

	    if (this._consumer && this._consumer.getMediaplayerSettings) {
	      // Allow consumer to add settings.
	      settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
	    }

	    if (!Lightning.Utils.equalValues(this._stream, settings.stream)) {
	      if (settings.stream && settings.stream.keySystem) {
	        navigator
	          .requestMediaKeySystemAccess(
	            settings.stream.keySystem.id,
	            settings.stream.keySystem.config
	          )
	          .then(keySystemAccess => {
	            return keySystemAccess.createMediaKeys()
	          })
	          .then(createdMediaKeys => {
	            return this.videoEl.setMediaKeys(createdMediaKeys)
	          })
	          .then(() => {
	            if (settings.stream && settings.stream.src) this.open(settings.stream.src);
	          })
	          .catch(() => {
	            console.error('Failed to set up MediaKeys');
	          });
	      } else if (settings.stream && settings.stream.src) {
	        // This is here to be backwards compatible, will be removed
	        // in future sdk release
	        if (Settings.get('app', 'hls')) {
	          if (!window.Hls) {
	            window.Hls = class Hls {
	              static isSupported() {
	                console.warn('hls-light not included');
	                return false
	              }
	            };
	          }
	          if (window.Hls.isSupported()) {
	            if (!this._hls) this._hls = new window.Hls({ liveDurationInfinity: true });
	            this._hls.loadSource(settings.stream.src);
	            this._hls.attachMedia(this.videoEl);
	            this.videoEl.style.display = 'block';
	          }
	        } else {
	          this.open(settings.stream.src);
	        }
	      } else {
	        this.close();
	      }
	      this._stream = settings.stream;
	    }

	    this._setHide(settings.hide);
	    this._setVideoArea(settings.videoPos);
	  }

	  _setHide(hide) {
	    if (this.textureMode) {
	      this.tag('Video').setSmooth('alpha', hide ? 0 : 1);
	    } else {
	      this.videoEl.style.visibility = hide ? 'hidden' : 'visible';
	    }
	  }

	  open(url, settings = { hide: false, videoPosition: null }) {
	    // prep the media url to play depending on platform (mediaPlayerplugin)
	    url = mediaUrl(url);
	    this._metrics = Metrics$1.media(url);
	    Log.info('Playing stream', url);
	    if (this.application.noVideo) {
	      Log.info('noVideo option set, so ignoring: ' + url);
	      return
	    }
	    // close the video when opening same url as current (effectively reloading)
	    if (this.videoEl.getAttribute('src') === url) {
	      this.close();
	    }
	    this.videoEl.setAttribute('src', url);

	    // force hide, then force show (in next tick!)
	    // (fixes comcast playback rollover issue)
	    this.videoEl.style.visibility = 'hidden';
	    this.videoEl.style.display = 'none';

	    setTimeout(() => {
	      this.videoEl.style.display = 'block';
	      this.videoEl.style.visibility = 'visible';
	    });

	    this._setHide(settings.hide);
	    this._setVideoArea(settings.videoPosition || [0, 0, 1920, 1080]);
	  }

	  close() {
	    // We need to pause first in order to stop sound.
	    this.videoEl.pause();
	    this.videoEl.removeAttribute('src');

	    // force load to reset everything without errors
	    this.videoEl.load();

	    this._clearSrc();

	    this.videoEl.style.display = 'none';
	  }

	  playPause() {
	    if (this.isPlaying()) {
	      this.doPause();
	    } else {
	      this.doPlay();
	    }
	  }

	  get muted() {
	    return this.videoEl.muted
	  }

	  set muted(v) {
	    this.videoEl.muted = v;
	  }

	  get loop() {
	    return this.videoEl.loop
	  }

	  set loop(v) {
	    this.videoEl.loop = v;
	  }

	  isPlaying() {
	    return this._getState() === 'Playing'
	  }

	  doPlay() {
	    this.videoEl.play();
	  }

	  doPause() {
	    this.videoEl.pause();
	  }

	  reload() {
	    var url = this.videoEl.getAttribute('src');
	    this.close();
	    this.videoEl.src = url;
	  }

	  getPosition() {
	    return Promise.resolve(this.videoEl.currentTime)
	  }

	  setPosition(pos) {
	    this.videoEl.currentTime = pos;
	  }

	  getDuration() {
	    return Promise.resolve(this.videoEl.duration)
	  }

	  seek(time, absolute = false) {
	    if (absolute) {
	      this.videoEl.currentTime = time;
	    } else {
	      this.videoEl.currentTime += time;
	    }
	  }

	  get videoTextureView() {
	    return this.tag('Video').tag('VideoTexture')
	  }

	  get videoTexture() {
	    return this.videoTextureView.texture
	  }

	  _setVideoArea(videoPos) {
	    if (Lightning.Utils.equalValues(this._videoPos, videoPos)) {
	      return
	    }

	    this._videoPos = videoPos;

	    if (this.textureMode) {
	      this.videoTextureView.patch({
	        smooth: {
	          x: videoPos[0],
	          y: videoPos[1],
	          w: videoPos[2] - videoPos[0],
	          h: videoPos[3] - videoPos[1],
	        },
	      });
	    } else {
	      const precision = this.stage.getRenderPrecision();
	      this.videoEl.style.left = Math.round(videoPos[0] * precision) + 'px';
	      this.videoEl.style.top = Math.round(videoPos[1] * precision) + 'px';
	      this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
	      this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
	    }
	  }

	  _fireConsumer(event, args) {
	    if (this._consumer) {
	      this._consumer.fire(event, args);
	    }
	  }

	  _equalInitData(buf1, buf2) {
	    if (!buf1 || !buf2) return false
	    if (buf1.byteLength != buf2.byteLength) return false
	    const dv1 = new Int8Array(buf1);
	    const dv2 = new Int8Array(buf2);
	    for (let i = 0; i != buf1.byteLength; i++) if (dv1[i] != dv2[i]) return false
	    return true
	  }

	  error(args) {
	    this._fireConsumer('$mediaplayerError', args);
	    this._setState('');
	    return ''
	  }

	  loadeddata(args) {
	    this._fireConsumer('$mediaplayerLoadedData', args);
	  }

	  play(args) {
	    this._fireConsumer('$mediaplayerPlay', args);
	  }

	  playing(args) {
	    this._fireConsumer('$mediaplayerPlaying', args);
	    this._setState('Playing');
	  }

	  canplay(args) {
	    this.videoEl.play();
	    this._fireConsumer('$mediaplayerStart', args);
	  }

	  loadstart(args) {
	    this._fireConsumer('$mediaplayerLoad', args);
	  }

	  seeked() {
	    this._fireConsumer('$mediaplayerSeeked', {
	      currentTime: this.videoEl.currentTime,
	      duration: this.videoEl.duration || 1,
	    });
	  }

	  seeking() {
	    this._fireConsumer('$mediaplayerSeeking', {
	      currentTime: this.videoEl.currentTime,
	      duration: this.videoEl.duration || 1,
	    });
	  }

	  durationchange(args) {
	    this._fireConsumer('$mediaplayerDurationChange', args);
	  }

	  encrypted(args) {
	    const video = args.videoElement;
	    const event = args.event;
	    // FIXME: Double encrypted events need to be properly filtered by Gstreamer
	    if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
	      this._previousInitData = event.initData;
	      this._fireConsumer('$mediaplayerEncrypted', args);
	    }
	  }

	  static _states() {
	    return [
	      class Playing extends this {
	        $enter() {
	          this._startUpdatingVideoTexture();
	        }
	        $exit() {
	          this._stopUpdatingVideoTexture();
	        }
	        timeupdate() {
	          this._fireConsumer('$mediaplayerProgress', {
	            currentTime: this.videoEl.currentTime,
	            duration: this.videoEl.duration || 1,
	          });
	        }
	        ended(args) {
	          this._fireConsumer('$mediaplayerEnded', args);
	          this._setState('');
	        }
	        pause(args) {
	          this._fireConsumer('$mediaplayerPause', args);
	          this._setState('Playing.Paused');
	        }
	        _clearSrc() {
	          this._fireConsumer('$mediaplayerStop', {});
	          this._setState('');
	        }
	        static _states() {
	          return [class Paused extends this {}]
	        }
	      },
	    ]
	  }
	}

	class localCookie{constructor(e){return e=e||{},this.forceCookies=e.forceCookies||!1,!0===this._checkIfLocalStorageWorks()&&!0!==e.forceCookies?{getItem:this._getItemLocalStorage,setItem:this._setItemLocalStorage,removeItem:this._removeItemLocalStorage,clear:this._clearLocalStorage}:{getItem:this._getItemCookie,setItem:this._setItemCookie,removeItem:this._removeItemCookie,clear:this._clearCookies}}_checkIfLocalStorageWorks(){if("undefined"==typeof localStorage)return !1;try{return localStorage.setItem("feature_test","yes"),"yes"===localStorage.getItem("feature_test")&&(localStorage.removeItem("feature_test"),!0)}catch(e){return !1}}_getItemLocalStorage(e){return window.localStorage.getItem(e)}_setItemLocalStorage(e,t){return window.localStorage.setItem(e,t)}_removeItemLocalStorage(e){return window.localStorage.removeItem(e)}_clearLocalStorage(){return window.localStorage.clear()}_getItemCookie(e){var t=document.cookie.match(RegExp("(?:^|;\\s*)"+function(e){return e.replace(/([.*+?\^${}()|\[\]\/\\])/g,"\\$1")}(e)+"=([^;]*)"));return t&&""===t[1]&&(t[1]=null),t?t[1]:null}_setItemCookie(e,t){document.cookie=`${e}=${t}`;}_removeItemCookie(e){document.cookie=`${e}=;Max-Age=-99999999;`;}_clearCookies(){document.cookie.split(";").forEach(e=>{document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires=Max-Age=-99999999");});}}

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let namespace;
	let lc;

	const initStorage = () => {
	  namespace = Settings.get('platform', 'appId');
	  // todo: pass options (for example to force the use of cookies)
	  lc = new localCookie();
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	const isFunction = v => {
	  return typeof v === 'function'
	};

	const isObject = v => {
	  return typeof v === 'object' && v !== null
	};

	const isPage = v => {
	  if (v instanceof Lightning.Element || isLightningComponent(v)) {
	    return true
	  }
	  return false
	};

	const isLightningComponent = type => {
	  return type.prototype && 'isComponent' in type.prototype
	};

	const isArray = v => {
	  return Array.isArray(v)
	};

	const ucfirst = v => {
	  return `${v.charAt(0).toUpperCase()}${v.slice(1)}`
	};

	const isString = v => {
	  return typeof v === 'string'
	};

	const isPromise = (method, args) => {
	  let result;
	  if (isFunction(method)) {
	    try {
	      result = method.apply(null);
	    } catch (e) {
	      result = e;
	    }
	  } else {
	    result = method;
	  }
	  return isObject(result) && isFunction(result.then)
	};

	const incorrectParams = (cb, route) => {
	  const isIncorrect = /^\w*?\s?\(\s?\{.*?\}\s?\)/i;
	  if (isIncorrect.test(cb.toString())) {
	    console.warn(
	      [
	        `DEPRECATION: The data-provider for route: ${route} is not correct.`,
	        '"page" is no longer a property of the params object but is now the first function parameter: ',
	        'https://github.com/rdkcentral/Lightning-SDK/blob/feature/router/docs/plugins/router/dataproviding.md#data-providing',
	        "It's supported for now but will be removed in a future release.",
	      ].join('\n')
	    );
	    return true
	  }
	  return false
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	const fade = (i, o) => {
	  return new Promise(resolve => {
	    i.patch({
	      alpha: 0,
	      visible: true,
	      smooth: {
	        alpha: [1, { duration: 0.5, delay: 0.1 }],
	      },
	    });
	    // resolve on y finish
	    i.transition('alpha').on('finish', () => {
	      if (o) {
	        o.visible = false;
	      }
	      resolve();
	    });
	  })
	};

	const crossFade = (i, o) => {
	  return new Promise(resolve => {
	    i.patch({
	      alpha: 0,
	      visible: true,
	      smooth: {
	        alpha: [1, { duration: 0.5, delay: 0.1 }],
	      },
	    });
	    if (o) {
	      o.patch({
	        smooth: {
	          alpha: [0, { duration: 0.5, delay: 0.3 }],
	        },
	      });
	    }
	    // resolve on y finish
	    i.transition('alpha').on('finish', () => {
	      resolve();
	    });
	  })
	};

	const moveOnAxes = (axis, direction, i, o) => {
	  const bounds = axis === 'x' ? 1920 : 1080;
	  return new Promise(resolve => {
	    i.patch({
	      [`${axis}`]: direction ? bounds * -1 : bounds,
	      visible: true,
	      smooth: {
	        [`${axis}`]: [0, { duration: 0.4, delay: 0.2 }],
	      },
	    });
	    // out is optional
	    if (o) {
	      o.patch({
	        [`${axis}`]: 0,
	        smooth: {
	          [`${axis}`]: [direction ? bounds : bounds * -1, { duration: 0.4, delay: 0.2 }],
	        },
	      });
	    }
	    // resolve on y finish
	    i.transition(axis).on('finish', () => {
	      resolve();
	    });
	  })
	};

	const up = (i, o) => {
	  return moveOnAxes('y', 0, i, o)
	};

	const down = (i, o) => {
	  return moveOnAxes('y', 1, i, o)
	};

	const left = (i, o) => {
	  return moveOnAxes('x', 0, i, o)
	};

	const right = (i, o) => {
	  return moveOnAxes('x', 1, i, o)
	};

	var Transitions = {
	  fade,
	  crossFade,
	  up,
	  down,
	  left,
	  right,
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	class RoutedApp extends Lightning.Component {
	  static _template() {
	    return {
	      Pages: {
	        forceZIndexContext: true,
	      },
	      /**
	       * This is a default Loading page that will be made visible
	       * during data-provider on() you CAN override in child-class
	       */
	      Loading: {
	        rect: true,
	        w: 1920,
	        h: 1080,
	        color: 0xff000000,
	        visible: false,
	        zIndex: 99,
	        Label: {
	          mount: 0.5,
	          x: 960,
	          y: 540,
	          text: {
	            text: 'Loading..',
	          },
	        },
	      },
	    }
	  }

	  static _states() {
	    return [
	      class Loading extends this {
	        $enter() {
	          this.tag('Loading').visible = true;
	        }

	        $exit() {
	          this.tag('Loading').visible = false;
	        }
	      },
	      class Widgets extends this {
	        $enter(args, widget) {
	          // store widget reference
	          this._widget = widget;

	          // since it's possible that this behaviour
	          // is non-remote driven we force a recalculation
	          // of the focuspath
	          this._refocus();
	        }

	        _getFocused() {
	          // we delegate focus to selected widget
	          // so it can consume remotecontrol presses
	          return this._widget
	        }

	        // if we want to widget to widget focus delegation
	        reload(widget) {
	          this._widget = widget;
	          this._refocus();
	        }

	        _handleKey() {
	          restore();
	        }
	      },
	    ]
	  }

	  /**
	   * Return location where pages need to be stored
	   */
	  get pages() {
	    return this.tag('Pages')
	  }

	  /**
	   * Tell router where widgets are stored
	   */
	  get widgets() {
	    return this.tag('Widgets')
	  }

	  /**
	   * we MUST register _handleBack method so the Router
	   * can override it
	   * @private
	   */
	  _handleBack() {}

	  /**
	   * we MUST register _captureKey for dev quick-navigation
	   * (via keyboard 1-9)
	   */
	  _captureKey() {}

	  /**
	   * We MUST return Router.activePage() so the new Page
	   * can listen to the remote-control.
	   */
	  _getFocused() {
	    return getActivePage()
	  }
	}

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let getHash = () => {
	  return document.location.hash
	};

	let setHash = url => {
	  document.location.hash = url;
	};

	const initRouter = config => {
	  if (config.getHash) {
	    getHash = config.getHash;
	  }
	  if (config.setHash) {
	    setHash = config.setHash;
	  }
	};

	//instance of Lightning.Component
	let app;

	let stage;
	let widgetsHost;
	let pagesHost;

	const pages = new Map();
	const providers = new Map();
	const widgetsPerRoute = new Map();

	let register = new Map();
	let routerConfig;

	// widget that has focus
	let activeWidget;

	// page that has focus
	let activePage;
	const hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g;

	const create = type => {
	  const page = stage.c({ type, visible: false });

	  return page
	};

	/**
	 * The actual loading of the component
	 * @param {String} route - the route blueprint, used for data provider look up
	 * @param {String} hash - current hash we're routing to
	 * */
	const load = async ({ route, hash }) => {
	  const type = getPageByRoute(route);
	  let routesShareInstance = false;
	  let provide = false;
	  let page = null;
	  let isCreated = false;

	  // if page is instanceof Component
	  if (!isLightningComponent(type)) {
	    page = type;
	    // if we have have a data route for current page
	    if (providers.has(route)) {
	      // if page is expired or new hash is different
	      // from previous hash when page was loaded
	      // effectively means: page could be loaded
	      // with new url parameters
	      if (isPageExpired(type) || type[Symbol.for('hash')] !== hash) {
	        provide = true;
	      }
	    }

	    let currentRoute = activePage && activePage[Symbol.for('route')];

	    // if the new route is equal to the current route it means that both
	    // route share the Component instance and stack location / since this case
	    // is conflicting with the way before() and after() loading works we flag it,
	    // and check platform settings in we want to re-use instance
	    if (route === currentRoute) {
	      routesShareInstance = true;
	    }
	  } else {
	    page = create(type);
	    pagesHost.a(page);

	    // update stack
	    const location = getPageStackLocation(route);
	    if (!isNaN(location)) {
	      let stack = pages.get(route);
	      stack[location] = page;
	      pages.set(route, stack);
	    }

	    // test if need to request data provider
	    if (providers.has(route)) {
	      provide = true;
	    }

	    isCreated = true;
	  }

	  // we store hash and route as properties on the page instance
	  // that way we can easily calculate new behaviour on page reload
	  page[Symbol.for('hash')] = hash;
	  page[Symbol.for('route')] = route;

	  // if routes share instance we only update
	  // update the page data if needed
	  if (routesShareInstance) {
	    if (provide) {
	      try {
	        await updatePageData({ page, route, hash });
	        emit(page, ['dataProvided', 'changed']);
	      } catch (e) {
	        // show error page with route / hash
	        // and optional error code
	        handleError(e);
	      }
	    } else {
	      providePageData({ page, route, hash, provide: false });
	      emit(page, 'changed');
	    }
	  } else {
	    if (provide) {
	      const { type: loadType } = providers.get(route);
	      const properties = {
	        page,
	        old: activePage,
	        route,
	        hash,
	      };
	      try {
	        if (triggers[loadType]) {
	          await triggers[loadType](properties);
	          emit(page, ['dataProvided', isCreated ? 'mounted' : 'changed']);
	        } else {
	          throw new Error(`${loadType} is not supported`)
	        }
	      } catch (e) {
	        handleError(page, e);
	      }
	    } else {
	      const p = activePage;
	      const r = p && p[Symbol.for('route')];

	      providePageData({ page, route, hash, provide: false });
	      doTransition(page, activePage).then(() => {
	        // manage cpu/gpu memory
	        if (p) {
	          cleanUp(p, r);
	        }

	        emit(page, isCreated ? 'mounted' : 'changed');

	        // force focus calculation
	        app._refocus();
	      });
	    }
	  }

	  // store reference to active page, probably better to store the
	  // route in the future
	  activePage = page;

	  if (widgetsPerRoute.size && widgetsHost) {
	    updateWidgets(page);
	  }

	  Log.info('[route]:', route);
	  Log.info('[hash]:', hash);

	  return page
	};

	const triggerAfter = ({ page, old, route, hash }) => {
	  return doTransition(page, old).then(() => {
	    // if the current and previous route (blueprint) are equal
	    // we're loading the same page again but provide it with new data
	    // in that case we don't clean-up the old page (since we're re-using)
	    if (old) {
	      cleanUp(old, old[Symbol.for('route')]);
	    }

	    // update provided page data
	    return updatePageData({ page, route, hash })
	  })
	};

	const triggerBefore = ({ page, old, route, hash }) => {
	  return updatePageData({ page, route, hash })
	    .then(() => {
	      return doTransition(page, old)
	    })
	    .then(() => {
	      if (old) {
	        cleanUp(old, old[Symbol.for('route')]);
	      }
	    })
	};

	const triggerOn = ({ page, old, route, hash }) => {
	  const previousState = app.state || '';
	  app._setState('Loading');

	  if (old) {
	    cleanUp(old, old[Symbol.for('route')]);
	  }

	  return updatePageData({ page, route, hash })
	    .then(() => {
	      // @todo: fix zIndex for transition
	      return doTransition(page)
	    })
	    .then(() => {
	      // @todo: make state configurable
	      {
	        app._setState('');
	      }
	    })
	};

	const emit = (page, events = [], params = {}) => {
	  if (!isArray(events)) {
	    events = [events];
	  }
	  events.forEach(e => {
	    const event = `_on${ucfirst(e)}`;
	    if (isFunction(page[event])) {
	      page[event](params);
	    }
	  });
	};

	const handleError = (page, error = 'error unkown') => {
	  // force expire
	  page[Symbol.for('expires')] = Date.now();

	  if (pages.has('!')) {
	    load({ route: '!', hash: page[Symbol.for('hash')] }).then(errorPage => {
	      errorPage.error = { page, error };

	      // on() loading type will force the app to go
	      // in a loading state so on error we need to
	      // go back to root state
	      if (app.state === 'Loading') ;

	      // make sure we delegate focus to the error page
	      if (activePage !== errorPage) {
	        activePage = errorPage;
	        app._refocus();
	      }
	    });
	  } else {
	    Log.error(page, error);
	  }
	};

	const triggers = {
	  on: triggerOn,
	  after: triggerAfter,
	  before: triggerBefore,
	};

	const providePageData = ({ page, route, hash }) => {
	  const urlValues = getValuesFromHash(hash, route);
	  const pageData = new Map([...urlValues, ...register]);
	  const params = {};

	  // make dynamic url data available to the page
	  // as instance properties
	  for (let [name, value] of pageData) {
	    page[name] = value;
	    params[name] = value;
	  }

	  // check navigation register for persistent data
	  if (register.size) {
	    const obj = {};
	    for (let [k, v] of register) {
	      obj[k] = v;
	    }
	    page.persist = obj;
	  }

	  // make url data and persist data available
	  // via params property
	  page.params = params;

	  emit(page, ['urlParams'], params);

	  return params
	};

	const updatePageData = ({ page, route, hash, provide = true }) => {
	  const { cb, expires } = providers.get(route);
	  const params = providePageData({ page, route, hash });

	  if (!provide) {
	    return Promise.resolve()
	  }
	  /**
	   * In the first version of the Router, a reference to the page is made
	   * available to the callback function as property of {params}.
	   * Since this is error prone (named url parts are also being spread inside this object)
	   * we made the page reference the first parameter and url values the second.
	   * -
	   * We keep it backwards compatible for now but a warning is showed in the console.
	   */
	  if (incorrectParams(cb, route)) {
	    // keep page as params property backwards compatible for now
	    return cb({ page, ...params }).then(() => {
	      page[Symbol.for('expires')] = Date.now() + expires;
	    })
	  } else {
	    return cb(page, { ...params }).then(() => {
	      page[Symbol.for('expires')] = Date.now() + expires;
	    })
	  }
	};

	/**
	 * execute transition between new / old page and
	 * toggle the defined widgets
	 * @todo: platform override default transition
	 * @param pageIn
	 * @param pageOut
	 */
	const doTransition = (pageIn, pageOut = null) => {
	  const transition = pageIn.pageTransition || pageIn.easing;
	  const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || transition);
	  const transitionsDisabled = routerConfig.get('disableTransitions');

	  // default behaviour is a visibility toggle
	  if (!hasCustomTransitions || transitionsDisabled) {
	    pageIn.visible = true;
	    if (pageOut) {
	      pageOut.visible = false;
	    }
	    return Promise.resolve()
	  }

	  if (transition) {
	    let type;
	    try {
	      type = transition.call(pageIn, pageIn, pageOut);
	    } catch (e) {
	      type = 'crossFade';
	    }

	    if (isPromise(type)) {
	      return type
	    }

	    if (isString(type)) {
	      const fn = Transitions[type];
	      if (fn) {
	        return fn(pageIn, pageOut)
	      }
	    }

	    // keep backwards compatible for now
	    if (pageIn.smoothIn) {
	      // provide a smooth function that resolves itself
	      // on transition finish
	      const smooth = (p, v, args = {}) => {
	        return new Promise(resolve => {
	          pageIn.visible = true;
	          pageIn.setSmooth(p, v, args);
	          pageIn.transition(p).on('finish', () => {
	            resolve();
	          });
	        })
	      };
	      return pageIn.smoothIn({ pageIn, smooth })
	    }
	  }

	  return Transitions.crossFade(pageIn, pageOut)
	};

	/**
	 * update the visibility of the available widgets
	 * for the current page / route
	 * @param page
	 */
	const updateWidgets = page => {
	  const route = page[Symbol.for('route')];

	  // force lowercase lookup
	  const configured = (widgetsPerRoute.get(route) || []).map(ref => ref.toLowerCase());

	  widgetsHost.forEach(widget => {
	    widget.visible = configured.indexOf(widget.ref.toLowerCase()) !== -1;
	    if (widget.visible) {
	      emit(widget, ['activated'], page);
	    }
	  });

	  if (app.state === 'Widgets' ) ;
	};

	const cleanUp = (page, route) => {
	  let doCleanup = false;
	  const lazyDestroy = routerConfig.get('lazyDestroy');
	  const destroyOnBack = routerConfig.get('destroyOnHistoryBack');
	  const keepAlive = read('keepAlive');
	  const isFromHistory = read('@router:backtrack');

	  if (isFromHistory && (destroyOnBack || lazyDestroy)) {
	    doCleanup = true;
	  } else if (lazyDestroy && !keepAlive) {
	    doCleanup = true;
	  }

	  if (doCleanup) {
	    // in lazy create mode we store constructor
	    // and remove the actual page from host
	    const stack = pages.get(route);
	    const location = getPageStackLocation(route);

	    // grab original class constructor if statemachine routed
	    // else store constructor
	    stack[location] = page._routedType || page.constructor;
	    pages.set(route, stack);

	    // actual remove of page from memory
	    pagesHost.remove(page);

	    // force texture gc() if configured
	    // so we can cleanup textures in the same tick
	    if (routerConfig.get('gcOnUnload')) {
	      stage.gc();
	    }
	  }
	};

	/**
	 * Test if page passed cache-time
	 * @param page
	 * @returns {boolean}
	 */
	const isPageExpired = page => {
	  if (!page[Symbol.for('expires')]) {
	    return false
	  }

	  const expires = page[Symbol.for('expires')];
	  const now = Date.now();

	  return now >= expires
	};

	const getPageByRoute = route => {
	  return getPageFromStack(route).item
	};

	/**
	 * Returns the current location of a page constructor or
	 * page instance for a route
	 * @param route
	 */
	const getPageStackLocation = route => {
	  return getPageFromStack(route).index
	};

	const getPageFromStack = route => {
	  if (!pages.has(route)) {
	    return false
	  }

	  let index = -1;
	  let item = null;
	  let stack = pages.get(route);
	  if (!Array.isArray(stack)) {
	    stack = [stack];
	  }

	  for (let i = 0, j = stack.length; i < j; i++) {
	    if (isPage(stack[i])) {
	      index = i;
	      item = stack[i];
	      break
	    }
	  }

	  return { index, item }
	};

	/**
	 * Simple route length calculation
	 * @param route {string}
	 * @returns {number} - floor
	 */
	const getFloor = route => {
	  return stripRegex(route).split('/').length
	};

	/**
	 * Test if a route is part regular expressed
	 * and replace it for a simple character
	 * @param route
	 * @returns {*}
	 */
	const stripRegex = (route, char = 'R') => {
	  // if route is part regular expressed we replace
	  // the regular expression for a character to
	  // simplify floor calculation and backtracking
	  if (hasRegex.test(route)) {
	    route = route.replace(hasRegex, char);
	  }
	  return route
	};

	/**
	 * return all stored routes that live on the same floor
	 * @param floor
	 * @returns {Array}
	 */
	const getRoutesByFloor = floor => {
	  const matches = [];
	  // simple filter of level candidates
	  for (let [route] of pages.entries()) {
	    if (getFloor(route) === floor) {
	      matches.push(route);
	    }
	  }
	  return matches
	};

	/**
	 * return a matching route by provided hash
	 * hash: home/browse/12 will match:
	 * route: home/browse/:categoryId
	 * @param hash {string}
	 * @returns {string|boolean} - route
	 */
	const getRouteByHash = hash => {
	  const getUrlParts = /(\/?:?[@\w%\s-]+)/g;
	  // grab possible candidates from stored routes
	  const candidates = getRoutesByFloor(getFloor(hash));
	  // break hash down in chunks
	  const hashParts = hash.match(getUrlParts) || [];
	  // test if the part of the hash has a replace
	  // regex lookup id
	  const hasLookupId = /\/:\w+?@@([0-9]+?)@@/;
	  const isNamedGroup = /^\/:/;

	  // we skip wildcard routes
	  const skipRoutes = ['!', '*', '$'];

	  // to simplify the route matching and prevent look around
	  // in our getUrlParts regex we get the regex part from
	  // route candidate and store them so that we can reference
	  // them when we perform the actual regex against hash
	  let regexStore = [];

	  let matches = candidates.filter(route => {
	    let isMatching = true;

	    if (skipRoutes.indexOf(route) !== -1) {
	      return false
	    }

	    // replace regex in route with lookup id => @@{storeId}@@
	    if (hasRegex.test(route)) {
	      const regMatches = route.match(hasRegex);
	      if (regMatches && regMatches.length) {
	        route = regMatches.reduce((fullRoute, regex) => {
	          const lookupId = regexStore.length;
	          fullRoute = fullRoute.replace(regex, `@@${lookupId}@@`);
	          regexStore.push(regex.substring(1, regex.length - 1));
	          return fullRoute
	        }, route);
	      }
	    }

	    const routeParts = route.match(getUrlParts) || [];

	    for (let i = 0, j = routeParts.length; i < j; i++) {
	      const routePart = routeParts[i];
	      const hashPart = hashParts[i];

	      // Since we support catch-all and regex driven name groups
	      // we first test for regex lookup id and see if the regex
	      // matches the value from the hash
	      if (hasLookupId.test(routePart)) {
	        const routeMatches = hasLookupId.exec(routePart);
	        const storeId = routeMatches[1];
	        const routeRegex = regexStore[storeId];

	        // split regex and modifiers so we can use both
	        // to create a new RegExp
	        // eslint-disable-next-line
	        const regMatches = /\/([^\/]+)\/([igm]{0,3})/.exec(routeRegex);

	        if (regMatches && regMatches.length) {
	          const expression = regMatches[1];
	          const modifiers = regMatches[2];

	          const regex = new RegExp(`^/${expression}$`, modifiers);

	          if (!regex.test(hashPart)) {
	            isMatching = false;
	          }
	        }
	      } else if (isNamedGroup.test(routePart)) {
	        // we kindly skip namedGroups because this is dynamic
	        // we only need to the static and regex drive parts
	        continue
	      } else if (hashPart && routePart.toLowerCase() !== hashPart.toLowerCase()) {
	        isMatching = false;
	      }
	    }
	    return isMatching
	  });

	  if (matches.length) {
	    // we give prio to static routes over dynamic
	    matches = matches.sort(a => {
	      return isNamedGroup.test(a) ? -1 : 1
	    });
	    return matches[0]
	  }

	  return false
	};

	/**
	 * Extract dynamic values from location hash and return a namedgroup
	 * of key (from route) value (from hash) pairs
	 * @param hash {string} - the actual location hash
	 * @param route {string} - the route as defined in route
	 */
	const getValuesFromHash = (hash, route) => {
	  // replace the regex definition from the route because
	  // we already did the matching part
	  route = stripRegex(route, '');

	  const getUrlParts = /(\/?:?[\w%\s-]+)/g;
	  const hashParts = hash.match(getUrlParts) || [];
	  const routeParts = route.match(getUrlParts) || [];
	  const getNamedGroup = /^\/:([\w-]+)\/?/;

	  return routeParts.reduce((storage, value, index) => {
	    const match = getNamedGroup.exec(value);
	    if (match && match.length) {
	      storage.set(match[1], decodeURIComponent(hashParts[index].replace(/^\//, '')));
	    }
	    return storage
	  }, new Map())
	};

	const handleHashChange = override => {
	  const hash = override || getHash();
	  const route = getRouteByHash(hash);

	  if (route) {
	    // would be strange if this fails but we do check
	    if (pages.has(route)) {
	      let stored = pages.get(route);
	      if (!isArray(stored)) {
	        stored = [stored];
	      }
	      let n = stored.length;
	      while (n--) {
	        const type = stored[n];
	        if (isPage(type)) {
	          load({ route, hash }).then(() => {
	            app._refocus();
	          });
	        } else {
	          const urlParams = getValuesFromHash(hash, route);
	          const params = {};
	          for (const key of urlParams.keys()) {
	            params[key] = urlParams.get(key);
	          }
	          // invoke
	          type.call(null, app, { ...params });
	        }
	      }
	    }
	  } else {
	    if (pages.has('*')) {
	      load({ route: '*', hash }).then(() => {
	        app._refocus();
	      });
	    }
	  }
	};

	const read = flag => {
	  if (register.has(flag)) {
	    return register.get(flag)
	  }
	  return false
	};

	const getWidgetByName = name => {
	  name = ucfirst(name);
	  return widgetsHost.getByRef(name) || false
	};

	/**
	 * delegate app focus to a on-screen widget
	 * @param name - {string}
	 */
	const focusWidget = name => {
	  const widget = getWidgetByName(name);
	  if (name) {
	    // store reference
	    activeWidget = widget;
	    // somewhat experimental
	    if (app.state === 'Widgets') ; else {
	      app._setState('Widgets', [activeWidget]);
	    }
	  }
	};

	const handleRemote = (type, name) => {
	  if (type === 'widget') {
	    focusWidget(name);
	  } else if (type === 'page') {
	    restoreFocus();
	  }
	};

	const restore = () => {
	  if (routerConfig.get('autoRestoreRemote')) {
	    handleRemote('page');
	  }
	};

	const restoreFocus = () => {
	  activeWidget = null;
	  app._setState('');
	};

	const getActivePage = () => {
	  if (activePage && activePage.attached) {
	    return activePage
	  } else {
	    return app
	  }
	};

	// listen to url changes
	window.addEventListener('hashchange', () => {
	  handleHashChange();
	});

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	const defaultChannels = [
	  {
	    number: 1,
	    name: 'Metro News 1',
	    description: 'New York Cable News Channel',
	    entitled: true,
	    program: {
	      title: 'The Morning Show',
	      description: "New York's best morning show",
	      startTime: new Date(new Date() - 60 * 5 * 1000).toUTCString(), // started 5 minutes ago
	      duration: 60 * 30, // 30 minutes
	      ageRating: 0,
	    },
	  },
	  {
	    number: 2,
	    name: 'MTV',
	    description: 'Music Television',
	    entitled: true,
	    program: {
	      title: 'Beavis and Butthead',
	      description: 'American adult animated sitcom created by Mike Judge',
	      startTime: new Date(new Date() - 60 * 20 * 1000).toUTCString(), // started 20 minutes ago
	      duration: 60 * 45, // 45 minutes
	      ageRating: 18,
	    },
	  },
	  {
	    number: 3,
	    name: 'NBC',
	    description: 'NBC TV Network',
	    entitled: false,
	    program: {
	      title: 'The Tonight Show Starring Jimmy Fallon',
	      description: 'Late-night talk show hosted by Jimmy Fallon on NBC',
	      startTime: new Date(new Date() - 60 * 10 * 1000).toUTCString(), // started 10 minutes ago
	      duration: 60 * 60, // 1 hour
	      ageRating: 10,
	    },
	  },
	];

	const channels = () => Settings.get('platform', 'tv', defaultChannels);

	const randomChannel = () => channels()[~~(channels.length * Math.random())];

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let currentChannel;
	const callbacks = {};

	const emit$1 = (event, ...args) => {
	  callbacks[event] &&
	    callbacks[event].forEach(cb => {
	      cb.apply(null, args);
	    });
	};

	// local mock methods
	let methods = {
	  getChannel() {
	    if (!currentChannel) currentChannel = randomChannel();
	    return new Promise((resolve, reject) => {
	      if (currentChannel) {
	        const channel = { ...currentChannel };
	        delete channel.program;
	        resolve(channel);
	      } else {
	        reject('No channel found');
	      }
	    })
	  },
	  getProgram() {
	    if (!currentChannel) currentChannel = randomChannel();
	    return new Promise((resolve, reject) => {
	      currentChannel.program ? resolve(currentChannel.program) : reject('No program found');
	    })
	  },
	  setChannel(number) {
	    return new Promise((resolve, reject) => {
	      if (number) {
	        const newChannel = channels().find(c => c.number === number);
	        if (newChannel) {
	          currentChannel = newChannel;
	          const channel = { ...currentChannel };
	          delete channel.program;
	          emit$1('channelChange', channel);
	          resolve(channel);
	        } else {
	          reject('Channel not found');
	        }
	      } else {
	        reject('No channel number supplied');
	      }
	    })
	  },
	};

	const initTV = config => {
	  methods = {};
	  if (config.getChannel && typeof config.getChannel === 'function') {
	    methods.getChannel = config.getChannel;
	  }
	  if (config.getProgram && typeof config.getProgram === 'function') {
	    methods.getProgram = config.getProgram;
	  }
	  if (config.setChannel && typeof config.setChannel === 'function') {
	    methods.setChannel = config.setChannel;
	  }
	  if (config.emit && typeof config.emit === 'function') {
	    config.emit(emit$1);
	  }
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let ApplicationInstance;

	var Launch = (App, appSettings, platformSettings, appData) => {
	  initSettings(appSettings, platformSettings);

	  initUtils(platformSettings);
	  initStorage();

	  // Initialize plugins
	  if (platformSettings.plugins) {
	    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile);
	    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics);
	    platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer);
	    platformSettings.plugins.router && initRouter(platformSettings.plugins.router);
	    platformSettings.plugins.tv && initTV(platformSettings.plugins.tv);
	  }

	  const app = Application(App, appData, platformSettings);
	  ApplicationInstance = new app(appSettings);
	  return ApplicationInstance
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	class PinInput extends Lightning.Component {
	  static _template() {
	    return {
	      w: 120,
	      h: 150,
	      rect: true,
	      color: 0xff949393,
	      alpha: 0.5,
	      shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
	      Nr: {
	        w: w => w,
	        y: 24,
	        text: {
	          text: '',
	          textColor: 0xff333333,
	          fontSize: 80,
	          textAlign: 'center',
	          verticalAlign: 'middle',
	        },
	      },
	    }
	  }

	  set index(v) {
	    this.x = v * (120 + 24);
	  }

	  set nr(v) {
	    this._timeout && clearTimeout(this._timeout);

	    if (v) {
	      this.setSmooth('alpha', 1);
	    } else {
	      this.setSmooth('alpha', 0.5);
	    }

	    this.tag('Nr').patch({
	      text: {
	        text: (v && v.toString()) || '',
	        fontSize: v === '*' ? 120 : 80,
	      },
	    });

	    if (v && v !== '*') {
	      this._timeout = setTimeout(() => {
	        this._timeout = null;
	        this.nr = '*';
	      }, 750);
	    }
	  }
	}

	class PinDialog extends Lightning.Component {
	  static _template() {
	    return {
	      w: w => w,
	      h: h => h,
	      rect: true,
	      color: 0xdd000000,
	      alpha: 0.000001,
	      Dialog: {
	        w: 648,
	        h: 320,
	        y: h => (h - 320) / 2,
	        x: w => (w - 648) / 2,
	        rect: true,
	        color: 0xdd333333,
	        shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
	        Info: {
	          y: 24,
	          x: 48,
	          text: { text: 'Please enter your PIN', fontSize: 32 },
	        },
	        Msg: {
	          y: 260,
	          x: 48,
	          text: { text: '', fontSize: 28, textColor: 0xffffffff },
	        },
	        Code: {
	          x: 48,
	          y: 96,
	        },
	      },
	    }
	  }

	  _init() {
	    const children = [];
	    for (let i = 0; i < 4; i++) {
	      children.push({
	        type: PinInput,
	        index: i,
	      });
	    }

	    this.tag('Code').children = children;
	  }

	  get pin() {
	    if (!this._pin) this._pin = '';
	    return this._pin
	  }

	  set pin(v) {
	    if (v.length <= 4) {
	      const maskedPin = new Array(Math.max(v.length - 1, 0)).fill('*', 0, v.length - 1);
	      v.length && maskedPin.push(v.length > this._pin.length ? v.slice(-1) : '*');
	      for (let i = 0; i < 4; i++) {
	        this.tag('Code').children[i].nr = maskedPin[i] || '';
	      }
	      this._pin = v;
	    }
	  }

	  get msg() {
	    if (!this._msg) this._msg = '';
	    return this._msg
	  }

	  set msg(v) {
	    this._timeout && clearTimeout(this._timeout);

	    this._msg = v;
	    if (this._msg) {
	      this.tag('Msg').text = this._msg;
	      this.tag('Info').setSmooth('alpha', 0.5);
	      this.tag('Code').setSmooth('alpha', 0.5);
	    } else {
	      this.tag('Msg').text = '';
	      this.tag('Info').setSmooth('alpha', 1);
	      this.tag('Code').setSmooth('alpha', 1);
	    }
	    this._timeout = setTimeout(() => {
	      this.msg = '';
	    }, 2000);
	  }

	  _firstActive() {
	    this.setSmooth('alpha', 1);
	  }

	  _handleKey(event) {
	    if (this.msg) {
	      this.msg = false;
	    } else {
	      const val = parseInt(event.key);
	      if (val > -1) {
	        this.pin += val;
	      }
	    }
	  }

	  _handleBack() {
	    if (this.msg) {
	      this.msg = false;
	    } else {
	      if (this.pin.length) {
	        this.pin = this.pin.slice(0, this.pin.length - 1);
	      } else {
	        Pin.hide();
	        this.resolve(false);
	      }
	    }
	  }

	  _handleEnter() {
	    if (this.msg) {
	      this.msg = false;
	    } else {
	      Pin.submit(this.pin)
	        .then(val => {
	          this.msg = 'Unlocking ...';
	          setTimeout(() => {
	            Pin.hide();
	          }, 1000);
	          this.resolve(val);
	        })
	        .catch(e => {
	          this.msg = e;
	          this.reject(e);
	        });
	    }
	  }
	}

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	// only used during local development
	let unlocked = false;

	let submit = pin => {
	  return new Promise((resolve, reject) => {
	    if (pin.toString() === Settings.get('platform', 'pin', '0000').toString()) {
	      unlocked = true;
	      resolve(unlocked);
	    } else {
	      reject('Incorrect pin');
	    }
	  })
	};

	let check = () => {
	  return new Promise(resolve => {
	    resolve(unlocked);
	  })
	};

	let pinDialog = null;

	// Public API
	var Pin = {
	  show() {
	    return new Promise((resolve, reject) => {
	      pinDialog = ApplicationInstance.stage.c({
	        ref: 'PinDialog',
	        type: PinDialog,
	        resolve,
	        reject,
	      });
	      ApplicationInstance.childList.a(pinDialog);
	      ApplicationInstance.focus = pinDialog;
	    })
	  },
	  hide() {
	    ApplicationInstance.focus = null;
	    ApplicationInstance.children = ApplicationInstance.children.map(
	      child => child !== pinDialog && child
	    );
	    pinDialog = null;
	  },
	  submit(pin) {
	    return new Promise((resolve, reject) => {
	      try {
	        submit(pin)
	          .then(resolve)
	          .catch(reject);
	      } catch (e) {
	        reject(e);
	      }
	    })
	  },
	  unlocked() {
	    return new Promise((resolve, reject) => {
	      try {
	        check()
	          .then(resolve)
	          .catch(reject);
	      } catch (e) {
	        reject(e);
	      }
	    })
	  },
	  locked() {
	    return new Promise((resolve, reject) => {
	      try {
	        check()
	          .then(unlocked => resolve(!!!unlocked))
	          .catch(reject);
	      } catch (e) {
	        reject(e);
	      }
	    })
	  },
	};

	const SCREEN = {
	  w: 1920,
	  h: 1080,
	  precision: 1.0
	};

	const isDEBUG = true;
	const GLOBAL =
	{
	  isAGING: false
	};

	const ALL_PLUGINS_KEYPATH  = "RPC.AllPlugins";

	const COLOR_BG         = 0xFF0000ff; // #0000ff
	const COLOR_BG2        = 0xFF000080; // #0000c0
	const COLOR_HILITE     = 0xFFffda5b; // #ffda5b

	// export const COLOR_BG         = 0xff2a4d69 // #2a4d69
	// export const COLOR_BG2        = 0xff4b86b4 // #4b86b4
	// export const COLOR_HILITE     = 0xffadcbe3 // #adcbe3

	// export const COLOR_BG         = 0xFF8a307f // #8a307f,
	// export const COLOR_BG2        = 0xFF6883bc // #6883bc
	// export const COLOR_HILITE     = 0xFF79a7d3 // #79a7d3,

	// export const COLOR_BG2        = 0xFF3b4d61 // #3b4d61
	// export const COLOR_BG         = 0xFF6b7b8c // #6b7b8c
	// export const COLOR_HILITE     = 0xFFef9d10 // #ef9d10

	const TAB_W            = 200;
	const TAB_H            = 46;

	const ITEM_W           = SCREEN.w/2;
	const ITEM_H           = 46;

	const ITEM_W2          = ITEM_W/2;
	const ITEM_H2          = ITEM_H/2;

	var   TAB_FONT_PTS     = 33; // 33

	const TAB_FONT_COLOR   = 0xFFffffff;  // #ffffffFF

	var   MENU_FONT_PTS    = 31; // 33
	var   MENU_FONT_PTS_lo = 24;

	const MENU_FONT_COLOR  = 0xFFffffff;  // #ffffffFF

	const shdw             = {
	                                shadow: true,   // <<< TRUE / FALSE
	                                shadowColor: 0xFF000000,
	                                shadowOffsetX: 1,
	                                shadowOffsetY: 1,
	                                shadowBlur: 0,
	                              };

	const PSTORE_NAMESPACE = 'FactoryTest'; // same as appears in Data.json

	const KEYS =  // hfr = "Hisense Factory Remote"
	{
	  'hfr_DMP':    0x30, // 48,   "modifiers": ["alt"] }}, // DMP
	  'hfr_STOP':   0x31, // 49,   "modifiers": ["alt"] }}, // STOP
	  'hfr_TV':     0x32, // 50,   "modifiers": ["alt"] }}, // TV
	  'hfr_SOURCE': 0x33, // 51,   "modifiers": ["alt"] }}, // SOURCE
	  'hfr_IMAGE':  0x34, // 52,   "modifiers": ["alt"] }}, // IMAGE
	  'hfr_ZOOM':   0x35, // 53,   "modifiers": ["alt"] }}, // ZOOM
	  'hfr_OK':     0x36, // 54,   "modifiers": ["alt"] }}, // OK
	  'hfr_MAC':    0x37, // 55,   "modifiers": ["alt"] }}, // MAC
	  'hfr_IP':     0x38, // 56,   "modifiers": ["alt"] }}, // IP
	  'hfr_AV':     0x39, // 57,   "modifiers": ["alt"] }}, // AV
	  'hfr_AGING':  0x41, // 65,   "modifiers": ["alt"] }}, // AGING
	  'hfr_SCREEN': 0x42, // 66,   "modifiers": ["alt"] }}, // SCREEN
	  'hfr_BAL':    0x43, // 67,   "modifiers": ["alt"] }}, // BAL
	  'hfr_LOGO':   0x44, // 68,   "modifiers": ["alt"] }}, // LOGO
	  'hfr_F1':     0x45, // 69,   "modifiers": ["alt"] }}, // F1
	  'hfr_F2':     0x46, // 70,   "modifiers": ["alt"] }}, // F2
	  'hfr_F3':     0x47, // 71,   "modifiers": ["alt"] }}, // F3
	  'hfr_F4':     0x48, // 72,   "modifiers": ["alt"] }}, // F4
	  'hfr_F5':     0x49, // 73,   "modifiers": ["alt"] }}, // F5
	  'hfr_F6':     0x4A, // 74,   "modifiers": ["alt"] }}, // F6
	  'hfr_F7':     0x4B, // 75,   "modifiers": ["alt"] }}, // F7
	  'hfr_M':      0x4C, // 76,   "modifiers": ["alt"] }}, // M key
	  'hfr_HDMI':   0x4D, // 77,   "modifiers": ["alt"] }}, // HDMI
	  'hfr_ENERGY': 0x4E, // 78,   "modifiers": ["alt"] }}, // ENERGY
	  'hfr_ADC':    0x4F, // 79,   "modifiers": ["alt"] }}, // ADC
	  'hfr_3D':     0x50, // 80,   "modifiers": ["alt"] }}, // 3D
	  'hfr_PC':     0x51, // 81,   "modifiers": ["alt"] }}, // PC
	  'hfr_COM':    0x52, // 82,   "modifiers": ["alt"] }}  // COM
	};


	const isCtrlOnly = function(k)
	{
	  return (k.ctrlKey && !k.altKey && !k.shiftKey)
	};


	const isCtrlKeyCode = function(k, key)
	{
	  if( isCtrlOnly(k) )
	  {
	    if(k.keyCode == key)
	    {
	      return true
	    }
	  }

	  return false
	};


	const isAltOnly = function(k)
	{
	  return (!k.ctrlKey && k.altKey && !k.shiftKey)
	};

	const isAltKeyCode = function(k, key)
	{
	  if( isAltOnly(k) )
	  {
	    if(k.keyCode == key)
	    {
	      return true
	    }
	  }

	  return false
	};

	class MenuListTab extends lng.Component
	{
	    static _template( )
	    {
	      return {
	          flexItem: { minWidth: TAB_W, minHeight: TAB_H },

	          TabBG:
	          {
	            w: TAB_W, h: TAB_H + 30,
	            rect: true,
	            color:  COLOR_BG2,
	          },

	          TabLabelBG:
	          {
	            x: (TAB_W * 0.2)/2, y: 25/2,
	            w: (TAB_W * 0.8), h: TAB_H,
	            rect: true,
	            color: COLOR_BG,

	            TabLabel:
	            {
	               w: (TAB_W * 0.8), h: (TAB_H * 0.99),
	              text: { text: '<TabName>', fontFace: 'Regular',
	                      fontSize: TAB_FONT_PTS, textColor: TAB_FONT_COLOR,
	                      lineHeight: TAB_H + 0.5,
	                      textAlign: 'center', verticalAlign: 'top',
	                     ...shdw
	                    },
	            },
	          },

	          MenuItems:
	          {
	            flex: { direction: 'column' },
	            flexItem:{ /*alignSelf: 'stretch',*/ grow: 0, maxWidth: ITEM_W, minHeight: ITEM_H },

	           zIndex: 5, //10,
	            alpha: 0,
	            x: 0, y: TAB_H + ITEM_H/2, // offset from Tab text
	            children:[]
	          },
	      }
	    };

	    _focus()
	    {
	      var bg = this.tag("TabLabelBG");
	      if(bg) bg.color = COLOR_HILITE;

	      var menuItems = this.tag("MenuItems");
	      if(menuItems)
	      {
	        menuItems.alpha = 1;
	        menuItems.x     = -this.finalX;
	      }
	    }

	    _unfocus()
	    {
	      var bg = this.tag("TabLabelBG");
	      if(bg) bg.color = COLOR_BG;

	      var menuItems = this.tag("MenuItems");
	      if(menuItems)
	      {
	        menuItems.alpha = 0;
	      }
	    }

	    _init()
	    {
	      this.itemIndex = 0;

	      if(this.tabItem)
	      {
	        this.label = this.tabItem.name;
	        this.items = this.tabItem.menu; //setter
	      }

	      this._setState('MenuItemsState');
	    }

	    get _Label()
	    {
	      return this.tag('TabLabel');
	    }

	    set label(s)
	    {
	      this.tag("TabLabel").text.text = s;
	    }

	    set items( list )
	    {
	      var menuItems = this.tag("MenuItems");

	      let data = this.tabItem.data;

	      menuItems.children = list.map( item =>
	      {
	        item.data = data;

	        return MenuItemFactory.createItem(item)
	      });
	    }

	    static _states(){
	      return [
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class MenuItemsState extends this
	        {
	          $enter()
	          {
	            //console.log("MenuItemsState - ENTER")
	          }

	          _getFocused()
	          {
	            var items = this.tag("MenuItems");
	            if(items)
	            {
	              return items.children[this.itemIndex];
	            }
	          }

	          _handleUp()
	          {
	            var items = this.tag("MenuItems").children;

	            if(--this.itemIndex < 0)
	            {
	              this.itemIndex = items.length - 1;// 0;
	            }
	          }

	          _handleDown()
	          {
	            var items = this.tag("MenuItems").children;

	            if(++this.itemIndex > items.length - 1)
	            {
	              this.itemIndex = 0; // items.length - 1;
	            }
	          }

	          // GLOBAL key handling
	          // _handleKey(k)
	          // {
	          //   // console.log("handleKey() ... code: " + k.keyCode);
	          //   switch( k.keyCode )
	          //   {
	          //     case  8: // 'LAST' key on remote
	          //     case 27: // ESC key on keyboard
	          //     case 73: // '...' Menu key on PlatCo remote

	          //     case 37:
	          //     case 39:
	          //       console.log("TAB >>> GOT key code: " + k.keyCode + ' <<< IGNORED 11')
	          //       return false; // DON'T handle
	          //       break;

	          //     default:
	          //       //console.log("TAB >>> GOT key code: " + k.keyCode + ' <<< IGNORED 22')
	          //       return false; // DON'T handle
	          //     }//SWITCH

	          //     return false
	          // }
	        }
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      ]
	    }

	    //////////////////////////////////////////////////////////////////////////////////////////////////
	  }//CLASS

	class MenuItemBase extends lng.Component
	  {
	    static _template( )
	    {
	      return {
	          Label:
	          {
	            mount: 0.5,
	            text: {
	              text: "<Base Txt>",
	              fontSize: ( (SCREEN.precision < 1) ? (MENU_FONT_PTS_lo) : MENU_FONT_PTS),
	              textColor: MENU_FONT_COLOR,
	              ...shdw
	            },
	          },
	      }
	    }

	    get label()
	    {
	      var obj = this.tag("Label");

	      return obj ? obj.text.text : "";
	    }

	    set label(s)
	    {
	      var obj = this.tag("Label");
	      if(obj)
	      {
	        if(obj.text != null)
	        {
	          obj.text.text = s;
	        }
	        else
	        {
	          console.log('odd');
	        }
	      }
	    }

	    set background(clr)
	    {
	      this.color = clr;
	    }

	    _focus()
	    {
	      this.background = COLOR_HILITE;
	    }

	    _unfocus()
	    {
	      this.background = COLOR_BG;
	    }

	    _getFocused()
	    {
	      return this
	    }

	    didChange(v)
	    {
	      console.log('MenuItemBase::didChange() - NOT IMLEMENTED    v: ' + JSON.stringify(v) );
	      console.log('MenuItemBase::didChange() - NOT IMLEMENTED    v: ' + JSON.stringify(v) );
	    }

	    _init()
	    {
	      // Defaults
	      this.w              = ITEM_W;
	      this.h              = ITEM_H;
	      this.color          = COLOR_BG;
	      this._text          = "<123text>";
	      this._textAlign     = 'center';
	      this._verticalAlign = 'middle';

	      if(this.item)
	      {
	        this.label = this.item["Text"];
	        this.color = this.item["Background"] || COLOR_BG;

	        var posX   = this.w/2; // DEFAULT: center
	        var alignX = 0.5;      // DEFAULT: center

	        if(this.item["Align"])
	        {
	          alignX = this.item["Align"] == "center" ? 0.5 :
	                   this.item["Align"] == "right"  ? 1.0 : 0.0;

	          posX = this.item["Align"] == "center" ? this.w/2 :
	                 this.item["Align"] == "right"  ? this.w   : 0.0;
	        }

	      } // ITEM

	      this.patch(
	      {
	        rect: true,
	          color: this.color,
	          w: this.w,
	          h: this.h,
	          Label:
	          {
	            mountX: alignX,
	            x: posX,
	            y: this.h/2 + 3,

	            text:
	            {
	              textAlign:     this._textAlign,
	              // verticalAlign: this._verticalAlign
	            }
	          }
	      });
	    }

	      //////////////////////////////////////////////////////////////////////////////////////////////////
	    }//CLASS

	class MenuItemSub extends MenuItemBase
	{
	    set subs( list )
	    {
	      var menuItems = this.tag("SubItems");

	      let data = this.item.data;

	      menuItems.children = list.map( item =>
	      {
	        item.data = data;

	        return MenuItemFactory.createItem(item)
	      });
	    }

	    _init()
	    {
	      super._init();

	      this.subIndex = 0;

	      if(this.item)
	      {
	        this.patch(
	        {
	          Label:
	          {
	            text:
	            {
	              fontSize: ( (SCREEN.precision < 1) ? (MENU_FONT_PTS_lo + 14) : MENU_FONT_PTS + 1),
	            }
	          },

	          SubMenu:
	          {
	            alpha:   0,
	            zIndex: 5, // 10
	            x: ITEM_W,

	            SubItems:
	            {
	              flex:    { direction: 'column' },
	              flexItem:{ maxWidth: ITEM_W, minHeight: ITEM_H },

	              children:[]
	            },
	          }
	        });

	        this.subs  = this.item.SubItems;
	        this.label = this.item.Text;

	        this._setState('SubIdleState');
	      }
	    }

	    static _states()
	    {
	      return [
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class SubIdleState extends this
	        {
	          $enter()
	          {
	            // console.log("SubIdleState - ENTER")
	          }

	          _handleEnter()
	          {
	            var count = this.tag("SubItems").children.length;
	            var subsH = count * ITEM_H;

	            var submenu = this.tag("SubMenu");
	            var offset  = this.finalY;

	            if( (offset + subsH) > 1080) // off bottom of screen
	            {
	              var tooFar = (1080  - (offset + subsH));
	              submenu.y  = tooFar - ( ITEM_H * 1.5);
	            }

	            this._setState('SubItemsState');
	          }
	        },

	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class SubItemsState extends this
	        {
	          $enter()
	          {
	            this.tag("SubMenu").alpha = 1; // SHOW
	          }
	          $exit()
	          {
	            this.tag("SubMenu").alpha = 0; // SHOW
	          }

	          _getFocused()
	          {
	            var items = this.tag("SubItems");
	            return items.children[this.subIndex];
	          }

	          _handleRight()
	          {
	            // swallow
	            // console.log(">>> _handleRight() - swallow !!")
	          }

	          _handleLeft()
	          {
	            this._setState('SubIdleState');
	          }

	          _handleUp()
	          {
	            if(--this.subIndex < 0) this.subIndex = 0;
	          }

	          _handleDown()
	          {
	            var items = this.tag("SubItems").children;
	            if(++this.subIndex >= items.length - 1) this.subIndex = items.length - 1;
	          }

	          // GLOBAL key handling
	          _handleKey(k)
	          {
	            // console.log("handleKey() ... code: " + k.keyCode);
	            switch( k.keyCode )
	            {
	              case  8: // 'LAST' key on remote
	              // case 27: // ESC key on keyboard
	              case 73: // '...' Menu key on PlatCo remote
	              case 77: // '...' MENU
	                if( isCtrlOnly(k) )
	                {
	                  this._setState('SubIdleState');
	                  return true // handled
	                }
	                break;

	              default:
	                console.log("GOT key code: " + k.keyCode);
	                  break
	            }//SWITCH

	            return false // propagate
	          }
	        }
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      ]
	    }

	    //////////////////////////////////////////////////////////////////////////////////////////////////
	  }//CLASS

	function setValue (object, key, val, strict) {
		if (object instanceof Object && typeof key === 'string') {
			var a = key.split('.');
			var n = a.length - 1;
			for (var i = 0; i < n; i += 1) {
				var k = a[i];
				if (k in object) {
					object = object[k];
				} else {
					if (strict === true) {
						throw new Error('Invalid path');
					} else {
						object[k] = {};
						object = object[k];
					}
				}
			}
			object[a[n]] = val;
		} else {
			throw new Error('Invalid arguments');
		}
	}

	function getValue (object, key, strict) {
		if (object instanceof Object && typeof key === 'string') {
			var a = key.split('.');
			
			for (var i = 0; i < a.length; i++ ) {
				var k = a[i];
				if (k in object) {
				object = object[k];
				} else {
					if (strict === true) {
						throw new Error('Invalid path');
					} else {
						return undefined;
					}
				}
			}
			return object;
		}
	}

	var jsonKeypath = {
		getValue: getValue,
		setValue: setValue
	};

	/**
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
	 *
	 * Licensed under the Apache License, Version 2.0 (the License);
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

	let ws = null;
	if (typeof WebSocket !== 'undefined') {
	  ws = WebSocket;
	}
	var ws_1 = ws;

	const requestsQueue = {};
	const listeners = {};

	var requestQueueResolver = data => {
	  if (typeof data === 'string') {
	    data = JSON.parse(data.normalize().replace(/\\x([0-9A-Fa-f]{2})/g, ''));
	  }
	  if (data.id) {
	    const request = requestsQueue[data.id];
	    if (request) {
	      if ('result' in data) request.resolve(data.result);
	      else request.reject(data.error);
	      delete requestsQueue[data.id];
	    } else {
	      console.log('no pending request found with id ' + data.id);
	    }
	  }
	};

	var notificationListener = data => {
	  if (typeof data === 'string') {
	    data = JSON.parse(data.normalize().replace(/\\x([0-9A-Fa-f]{2})/g, ''));
	  }
	  if (!data.id && data.method) {
	    const callbacks = listeners[data.method];
	    if (callbacks && Array.isArray(callbacks) && callbacks.length) {
	      callbacks.forEach(callback => {
	        callback(data.params);
	      });
	    }
	  }
	};

	const protocol = 'ws://';
	const host = 'localhost';
	const endpoint = '/jsonrpc';
	const port = 80;
	var makeWebsocketAddress = options => {
	  return [
	    (options && options.protocol) || protocol,
	    (options && options.host) || host,
	    ':' + ((options && options.port) || port),
	    (options && options.endpoint) || endpoint,
	    options && options.token ? '?token=' + options.token : null,
	  ].join('')
	};

	const protocols = 'notification';
	let socket = null;
	var connect = options => {
	  return new Promise((resolve, reject) => {
	    if (socket && socket.readyState === 1) return resolve(socket)
	    if (socket && socket.readyState === 0) {
	      const waitForOpen = () => {
	        socket.removeEventListener('open', waitForOpen);
	        resolve(socket);
	      };
	      return socket.addEventListener('open', waitForOpen)
	    }
	    if (socket === null) {
	      socket = new ws_1(makeWebsocketAddress(options), protocols);
	      socket.addEventListener('message', message => {
	        if (options.debug) {
	          console.log(' ');
	          console.log('API REPONSE:');
	          console.log(JSON.stringify(message.data, null, 2));
	          console.log(' ');
	        }
	        requestQueueResolver(message.data);
	      });
	      socket.addEventListener('message', message => {
	        notificationListener(message.data);
	      });
	      socket.addEventListener('error', () => {
	        notificationListener({
	          method: 'client.ThunderJS.events.error',
	        });
	        socket = null;
	      });
	      const handleConnectClosure = event => {
	        socket = null;
	        reject(event);
	      };
	      socket.addEventListener('close', handleConnectClosure);
	      socket.addEventListener('open', () => {
	        notificationListener({
	          method: 'client.ThunderJS.events.connect',
	        });
	        socket.removeEventListener('close', handleConnectClosure);
	        socket.addEventListener('close', () => {
	          notificationListener({
	            method: 'client.ThunderJS.events.disconnect',
	          });
	          socket = null;
	        });
	        resolve(socket);
	      });
	    } else {
	      socket = null;
	      reject('Socket error');
	    }
	  })
	};

	var makeBody = (requestId, plugin, method, params, version) => {
	  params ? delete params.version : null;
	  const body = {
	    jsonrpc: '2.0',
	    id: requestId,
	    method: [plugin, version, method].join('.'),
	  };
	  params || params === false
	    ?
	      typeof params === 'object' && Object.keys(params).length === 0
	      ? null
	      : (body.params = params)
	    : null;
	  return body
	};

	var getVersion = (versionsConfig, plugin, params) => {
	  const defaultVersion = 1;
	  let version;
	  if ((version = params && params.version)) {
	    return version
	  }
	  return versionsConfig
	    ? versionsConfig[plugin] || versionsConfig.default || defaultVersion
	    : defaultVersion
	};

	let id = 0;
	var makeId = () => {
	  id = id + 1;
	  return id
	};

	var execRequest = (options, body) => {
	  return connect(options).then(connection => {
	    connection.send(JSON.stringify(body));
	  })
	};

	var API = options => {
	  return {
	    request(plugin, method, params) {
	      return new Promise((resolve, reject) => {
	        const requestId = makeId();
	        const version = getVersion(options.versions, plugin, params);
	        const body = makeBody(requestId, plugin, method, params, version);
	        if (options.debug) {
	          console.log(' ');
	          console.log('API REQUEST:');
	          console.log(JSON.stringify(body, null, 2));
	          console.log(' ');
	        }
	        requestsQueue[requestId] = {
	          body,
	          resolve,
	          reject,
	        };
	        execRequest(options, body).catch(e => {
	          reject(e);
	        });
	      })
	    },
	  }
	};

	var DeviceInfo = {
	  freeRam(params) {
	    return this.call('systeminfo', params).then(res => {
	      return res.freeram
	    })
	  },
	  version(params) {
	    return this.call('systeminfo', params).then(res => {
	      return res.version
	    })
	  },
	};

	var plugins = {
	  DeviceInfo,
	};

	function listener(plugin, event, callback, errorCallback) {
	  const thunder = this;
	  const index = register$1.call(this, plugin, event, callback, errorCallback);
	  return {
	    dispose() {
	      const listener_id = makeListenerId(plugin, event);
	      if (listeners[listener_id] === undefined) return
	      listeners[listener_id].splice(index, 1);
	      if (listeners[listener_id].length === 0) {
	        unregister.call(thunder, plugin, event, errorCallback);
	      }
	    },
	  }
	}
	const makeListenerId = (plugin, event) => {
	  return ['client', plugin, 'events', event].join('.')
	};
	const register$1 = function(plugin, event, callback, errorCallback) {
	  const listener_id = makeListenerId(plugin, event);
	  if (!listeners[listener_id]) {
	    listeners[listener_id] = [];
	    if (plugin !== 'ThunderJS') {
	      const method = 'register';
	      const request_id = listener_id
	        .split('.')
	        .slice(0, -1)
	        .join('.');
	      const params = {
	        event,
	        id: request_id,
	      };
	      this.api.request(plugin, method, params).catch(e => {
	        if (typeof errorCallback === 'function') errorCallback(e.message);
	      });
	    }
	  }
	  listeners[listener_id].push(callback);
	  return listeners[listener_id].length - 1
	};
	const unregister = function(plugin, event, errorCallback) {
	  const listener_id = makeListenerId(plugin, event);
	  delete listeners[listener_id];
	  if (plugin !== 'ThunderJS') {
	    const method = 'unregister';
	    const request_id = listener_id
	      .split('.')
	      .slice(0, -1)
	      .join('.');
	    const params = {
	      event,
	      id: request_id,
	    };
	    this.api.request(plugin, method, params).catch(e => {
	      if (typeof errorCallback === 'function') errorCallback(e.message);
	    });
	  }
	};

	let api;
	var thunderJS = options => {
	  if (
	    options.token === undefined &&
	    typeof window !== 'undefined' &&
	    window.thunder &&
	    typeof window.thunder.token === 'function'
	  ) {
	    options.token = window.thunder.token();
	  }
	  api = API(options);
	  return wrapper({ ...thunder(options), ...plugins })
	};
	const resolve = (result, args) => {
	  if (
	    typeof result !== 'object' ||
	    (typeof result === 'object' && (!result.then || typeof result.then !== 'function'))
	  ) {
	    result = new Promise((resolve, reject) => {
	      result instanceof Error === false ? resolve(result) : reject(result);
	    });
	  }
	  const cb = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;
	  if (cb) {
	    result.then(res => cb(null, res)).catch(err => cb(err));
	  } else {
	    return result
	  }
	};
	const thunder = options => ({
	  options,
	  plugin: false,
	  call() {
	    const args = [...arguments];
	    if (this.plugin) {
	      if (args[0] !== this.plugin) {
	        args.unshift(this.plugin);
	      }
	    }
	    const plugin = args[0];
	    const method = args[1];
	    if (typeof this[plugin][method] == 'function') {
	      return this[plugin][method](args[2])
	    }
	    return this.api.request.apply(this, args)
	  },
	  registerPlugin(name, plugin) {
	    this[name] = wrapper(Object.assign(Object.create(thunder), plugin, { plugin: name }));
	  },
	  subscribe() {
	  },
	  on() {
	    const args = [...arguments];
	    if (['connect', 'disconnect', 'error'].indexOf(args[0]) !== -1) {
	      args.unshift('ThunderJS');
	    } else {
	      if (this.plugin) {
	        if (args[0] !== this.plugin) {
	          args.unshift(this.plugin);
	        }
	      }
	    }
	    return listener.apply(this, args)
	  },
	  once() {
	    console.log('todo ...');
	  },
	});
	const wrapper = obj => {
	  return new Proxy(obj, {
	    get(target, propKey) {
	      const prop = target[propKey];
	      if (propKey === 'api') {
	        return api
	      }
	      if (typeof prop !== 'undefined') {
	        if (typeof prop === 'function') {
	          if (['on', 'once', 'subscribe'].indexOf(propKey) > -1) {
	            return function(...args) {
	              return prop.apply(this, args)
	            }
	          }
	          return function(...args) {
	            return resolve(prop.apply(this, args), args)
	          }
	        }
	        if (typeof prop === 'object') {
	          return wrapper(
	            Object.assign(Object.create(thunder(target.options)), prop, { plugin: propKey })
	          )
	        }
	        return prop
	      } else {
	        if (target.plugin === false) {
	          return wrapper(
	            Object.assign(Object.create(thunder(target.options)), {}, { plugin: propKey })
	          )
	        }
	        return function(...args) {
	          args.unshift(propKey);
	          return target.call.apply(this, args)
	        }
	      }
	    },
	  })
	};

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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

	class Events
	{
	  constructor(tt = null)
	  {
	    if(tt == null)
	    {
	      throw "No Thunder !";
	    }

	    this.thunderJS = tt;
	    this.events    = [];
	  }

	  async add(plugin, event, cb = null)
	  {
	    if( (plugin == null || plugin == "") &&
	        (event  == null || event  == "") )
	    {
	      throw "No plugin/event !";
	    }

	    console.log('#########  THUNDER >>>>   add() - event:  ' + event);

	    this.events.push( await this.handleEvent(plugin, event, cb) );
	  }

	  disposeAll()
	  {
	    // console.log( "EVENTS >>>   destroyAll() ")

	    this.events.map( ee => { ee.dispose(); } );
	  }

	  async handleEvent(plugin, event, cb = null)
	  {
	    console.log('EVENTS >> Listen for >> [' + plugin + '] -> ' + event + ' ...');

	    if(cb != null)
	    {
	      // console.log('Listen for ['+name+'] using CALLBACK ...');
	      return await this.thunderJS.on(plugin, event, cb);
	    }
	    else
	    {
	      return await this.thunderJS.on(plugin, event, (notification) =>
	      {
	          var str = " " + event + " ...  Event" + JSON.stringify(notification);
	          console.log('Handler GOT >> ' + str);
	      })
	    }
	  }
	}//CLASS

	const default_cfg =
	{
	  host: '127.0.0.1',
	  port: 9998, //9999
	  debug: false, // VERY USEFUL
	  versions: {
	    default: 1, // use version 5 if plugin not specified
	    Controller: 1,
	    Packager: 1,
	    // etc ..
	  }
	};

	class ThunderUtils
	{
	  // Properties
	  get thunderJS() { return this.thunderJS_ };
	  // set thunderJS() { return this.thunderJS_ };

	  constructor()
	  {
	    const URL_PARAMS = new window.URLSearchParams(window.location.search);

	    var cfgURL = URL_PARAMS.get('thunderCfg');

	    this.thunderJS_ = null;
	    this.myEvents_  = null;

	    this.fetchThunderCfg(cfgURL);
	  }

	  fetchThunderCfg(url)
	  {
	    // Fetch Thunder Cfg
	    //
	    fetch(url)
	    .then( res => res.json())
	    .then((cfg) =>
	    {
	      console.log(' >>> Creating CUSTOM ThunderJS ...');
	      this.thunderJS_ = thunderJS(cfg);
	      this.myEvents_  = new Events(this.thunderJS_);
	    })
	    .catch(err =>
	    {
	      // console.log("Failed to get ThunderJS URL: " + url);

	      console.log(' >>> Creating DEFAULT ThunderJS ...');
	      this.thunderJS_ = thunderJS(default_cfg);
	      this.myEvents_  = new Events(this.thunderJS_);
	    });
	  }

	  async activatePlugin( pp )
	  {
	    var ans = null;
	    if(pp          == undefined || pp          == null ||
	       pp.callsign == undefined || pp.callsign == null)
	    {
	      console.log( 'activatePlugin() >>> BAD ARGS' );
	      return ans;
	    }

	    ans = await this.thunderJS_.call("Controller", "activate", { "callsign": pp.callsign } );

	    return ans
	  }

	  async callThunder(rpc)
	  {
	    var ans = null;
	    if(rpc == null || rpc == undefined)
	    {
	      console.log( 'callThunder() >>> BAD ARGS' );
	      return ans;
	    }

	    try
	    {
	      ans = await this.thunderJS_.call(rpc.plugin, rpc.method, rpc.params);
	    }
	    catch(e)
	    {
	      console.log( "callThunder() >>> CAUGHT:  plugin: '" + rpc.plugin + "'  method: '" + rpc.method + "'  params: >" + JSON.stringify(rpc.params) + "<    e: " + JSON.stringify(e) );
	    }

	    return ans
	  }


	  async callThunderNoCatch(rpc)
	  {
	    var ans = null;
	    if(rpc == null || rpc == undefined)
	    {
	      console.log( 'callThunder() >>> BAD ARGS' );
	      return ans;
	    }

	    ans = await this.thunderJS_.call(rpc.plugin, rpc.method, rpc.params);

	    return ans
	  }


	  async call(plugin,method, params)
	  {
	    var ans = null;
	    if( (plugin == null      || method == null      || params == null)   &&
	        (plugin == undefined || method == undefined || method == undefined) )
	    {
	      console.log( 'call() >>> BAD ARGS' );
	      return ans;
	    }

	    ans = await this.thunderJS_.call(plugin, method, params);

	    return ans
	  }

	  registerEvent(pkg, event, handler )
	  {
	    if(this.myEvents_)
	    {
	      this.myEvents_.add( pkg, event, handler );
	    }
	  }

	}//CLASS

	class DataModel
	{
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  constructor()
	  {
	    this.dataStore = {}; // empty

	    this.dataMap    = null;
	    this.keycodeMap = null;
	    this.serialMap  = null;

	    this.thunderUtils = new ThunderUtils();
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  getThunder()
	  {
	    return this.thunderUtils;
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  // FORMATTER:  seconds to "uptime" string
	  //
	  static formatUptime(secs)
	  {
	    var d = Math.abs(secs);
	    var r = {};          // result
	    var s =              // structure
	    {
	        year:   1536000,
	        month:  2592000,
	        week:    604800, // uncomment row to ignore
	        day:      86400, // feel free to add your own row
	        hour:      3600,
	        minute:      60,
	        second:       1
	    };

	    Object.keys(s).forEach(function(key)
	    {
	        r[key] = Math.floor(d / s[key]);
	            d -= r[key] * s[key];
	    });

	    return ''+ (r["day"] + (r["week"] * 7) + (r["month"] * 4.285)) + 'd:' + r["hour"] + 'h:' + r["minute"] + 'm';
	  }

	  static formatBoolean(val)
	  {
	    return val ? "True" : "False"
	  }
	  static formatOnOff(val)
	  {
	    return val ? "On" : "Off"
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  static getFn(fn)
	  {
	    // console.log(' >>>>  getFn( '+fn+') - ENTER' )

	    switch(fn)
	    {
	      case "formatBoolean": return DataModel.formatBoolean;      case "formatUptime":  return DataModel.formatUptime;      case "formatOnOff":   return DataModel.formatOnOff;      default: return null;
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  static measureTextWidth(text = {})
	  {
	    const canvas = document.createElement('canvas');
	    const ctx = canvas.getContext('2d');
	    const {
	      fontStyle,
	      fontWeight,
	      fontSize,
	      fontFamily = text.fontFace || 'sans-serif'
	    } = text;
	    const fontCss = [
	      fontStyle,
	      fontWeight,
	      fontSize ? `${fontSize}px` : (MENU_FONT_PTS) + 'px',  //'0',
	      `'${fontFamily}'`
	    ]
	      .filter(Boolean)
	      .join(' ');
	    ctx.font = fontCss;

	    // console.log("#############   measureTextWidth("+text.text +") ... fontCss: " + JSON.stringify(fontCss))

	    const textMetrics = ctx.measureText(text.text || '');
	    // try using the actual bounding box first because it will be more accurate
	    if (textMetrics.actualBoundingBoxLeft && textMetrics.actualBoundingBoxRight)
	    {
	      let ww = Math.round(
	        Math.abs(textMetrics.actualBoundingBoxLeft) +
	          Math.abs(textMetrics.actualBoundingBoxRight)
	      );
	      // console.log("#############   measureTextWidth() ... AA ww: " + ww)

	      return  ww;
	    }

	    // console.log("#############   measureTextWidth() ... BB ww: " + Math.round(textMetrics.width))

	    return Math.round(textMetrics.width);
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  callThunder(rpc)
	  {
	    if(this.thunderUtils != null)
	    {
	      if(rpc == null || rpc == undefined)
	      {
	        console.log( 'DataUtils::callThunderNoCatch() >>> BAD ARGS' );
	        return ans;
	      }

	      return this.thunderUtils.callThunder(rpc)
	    }
	    else
	    {
	      console.log('DataUtils::callThunder() ... THUNDER NOT READY ');
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  async activatePlugin( pp )
	  {
	    if(this.thunderUtils != null)
	    {
	      if(pp == null || pp == undefined)
	      {
	        console.log( 'DataUtils::activatePlugin() >>> BAD ARGS' );
	        return null;
	      }

	      return this.thunderUtils.activatePlugin(pp)
	    }
	    else
	    {
	      console.log('DataUtils::activatePlugin() ... THUNDER NOT READY ');
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  async callThunderNoCatch(rpc)
	  {
	    var ans = null;

	    // console.log( 'INFO:  DataUtils::callThunderNoCatch() >>> ' + (typeof this.thunderUtils) );

	    if(this.thunderUtils != null)
	    {
	      if(rpc == null || rpc == undefined)
	      {
	        console.log( 'DataUtils::callThunderNoCatch() >>> BAD ARGS' );
	        return ans;
	      }

	      ans = await this.thunderUtils.callThunder(rpc);
	    }
	    else
	    {
	      console.log('DataUtils::callThunderNoCatch() ... THUNDER NOT READY ');
	    }

	    return ans;
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  static fetchJSON(url)
	  {
	    return new Promise( (resolve, reject)  =>
	    {
	      console.log("fetchJSON() ... using url: " + url);

	      // Fetch JSON
	      //
	      fetch(url)
	      .then( res => res.json() )
	      .then(data =>
	      {
	        console.log('fetchJSON() - complete ... ' );

	        resolve(data);
	      })
	      .catch(err =>
	      {
	        console.log("Error parsing Keys map ... err: " + JSON.stringify(err));
	        reject();
	      });
	    });
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  setDataMap(data)
	  {
	    this.dataMap = data;
	  }

	  getDataMap()
	  {
	    return this.dataMap
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  setKeycodeMap(keys)
	  {
	    this.keycodeMap = keys;
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  setSerialMap(serial)
	  {
	    this.serialMap = serial;
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  getKeymapRPC(keyPath)
	  {
	    let kc = '0x' + keyPath.toString(16);
	    try
	    {
	      let rpc = this.keycodeMap[kc];
	      if( rpc != undefined)
	      {
	        return rpc
	      }
	      else
	      {
	        console.log('ERROR:  getKeymapRPC("' + kc + '") - NOT found.');
	        return null
	      }
	    }
	    catch(e)
	    {
	      console.log('EXCEPTION:  getKeymapRPC("' + keyPath + '") - NOT found.');
	      return null;
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  getSerialRPC(keyPath)
	  {
	    var has0x = keyPath.startsWith("0x");
	    var    kc = has0x ? keyPath : '0x' + keyPath;

	    try
	    {
	      let cmd = this.serialMap[kc];
	      if(cmd != undefined && cmd != null)
	      {
	        let rpc = this.dataStore[cmd.Rpc]; // get the RPC path from the Serial obj
	        if( rpc != undefined)
	        {
	          return cmd.Rpc
	        }
	        else
	        {
	          console.log('ERROR:  getSerialRPC("' + kc + '") - NOT found.');
	          return null
	        }
	      }
	      else
	      {
	        console.log('ERROR:  getSerialRPC() >>  cmd: "' + cmd + '" - NOT found.');
	        return null
	      }
	    }
	    catch(e)
	    {
	      console.log('EXCEPTION:  getSerialRPC("' + keyPath + '") - NOT found.');
	      return null;
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  static dataValueSET(keyPath, value)
	  {
	    console.log( " #####  >> dataValueSET()  ... keyPath: " + keyPath + "  value: " + JSON.stringify(value) );

	    if(gDataModel)
	    {
	      gDataModel.setValue(keyPath, value);
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  registerEvent(pkg, event, handler)
	  {
	    if(this.thunderUtils != null)
	    {
	      this.thunderUtils.registerEvent( pkg, event, handler );
	    }
	    else
	    {
	      console.log('NOT READY ');
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  addDataItem( rpc, keyPath = null)
	  {
	    if(keyPath == null)
	    {
	      keyPath = rpc.keyPath;
	    }

	    if(keyPath == null)
	    {
	      console.log('ERROR:  addDataItem() - keypath is NULL !');
	      return;
	    }

	    var dataItem = this.dataStore[keyPath];

	    if(dataItem != null && dataItem != undefined)
	    {
	      console.log('ERROR:  addDataItem() - keypath: ' + keyPath + ' - ALREADY exists !');
	      return;
	    }
	    else
	    {
	      // console.log('INFO:  addDataItem() - keyPath: ' + keyPath + ' - Created !')

	      this.dataStore[keyPath] = rpc;
	      this.dataStore[keyPath].value = null;   // new
	      this.dataStore[keyPath].listeners = []; // new

	      // Set a DEFAULT value for this property
	      if(rpc.Default != undefined)
	      {
	        this.setValue(keyPath, rpc.Default);
	      }

	      // Initial Update...
	      this.getValue(keyPath);
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  addListener( keyPath, obj )
	  {
	    if( (keyPath == undefined || keyPath == null) ||
	        (obj     == undefined || obj     == null) ||
	        (obj.didChange == undefined ) )
	    {
	      console.log('ERROR:  addListener() - BAD ARGS');
	      return;
	    }

	    var dataItem = this.dataStore[keyPath];

	    if(dataItem != null && dataItem != undefined)
	    {
	      dataItem.listeners.push( obj );

	      // console.log('INFO:  addListener() -  keyPath: ' + keyPath + ' - ADDED  len: ' + dataItem.listeners.length)
	    }
	    else
	    {
	      console.log('ERROR:  addListener() - data item not found.  keyPath: ' + keyPath);
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  removeListener( keyPath, obj )
	  {
	    if( (keyPath == undefined || keyPath == null) ||
	        (obj     == undefined || obj     == null) ||
	        (obj.didChange == undefined ) )
	    {
	      console.log('ERROR:  removeListener() - BAD ARGS');
	      return;
	    }

	    var dataItem = this.dataStore[keyPath];

	    if(dataItem != null && dataItem != undefined)
	    {
	      var listeners = dataItem.listeners.filter( (o) => { return (o != obj) }) ;

	      dataItem.listeners = listeners;

	      // console.log('INFO:  removeListener() -  keyPath: ' + keyPath + ' - REMOVED  len: ' + dataItem.listeners.length)
	    }
	    else
	    {
	      console.log('ERROR:  removeListener() - data item not found.  keyPath: ' + keyPath);
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  //
	  // SET to PersistentStore
	  //
	  async setPStore(key, val)
	  {
	    if(key && val != undefined)
	    {
	      var rc = this.thunderUtils.callThunderNoCatch(   // CALL THUNDER
	              { plugin: "org.rdk.PersistentStore",
	                method: "setValue",
	                params: { "namespace": PSTORE_NAMESPACE,
	                                "key": key,
	                              "value": val } } );
	      return rc
	    }
	    else
	    {
	      console.log('ERROR:  setPStore( key: '+key+', val: '+val+') ... BAD args');
	      return null
	    }
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  //
	  // GET from PersistentStore
	  //
	  async getPStore(key)
	  {
	    var ans = this.thunderUtils.callThunderNoCatch(
	                { plugin: "org.rdk.PersistentStore",
	                  method: "getValue",
	                  params: { "namespace": PSTORE_NAMESPACE,
	                                  "key":  key} } );
	    return ans
	  }
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  getValue(keyPath)
	  {
	    if(this.thunderUtils == null || this.thunderUtils == undefined)
	    {
	      console.log('FATAL:  getValue() -  thunderUtils is NULL ...');
	      return
	    }

	    var dataItem = this.dataStore[keyPath];

	    if(dataItem != null && dataItem != undefined)
	    {
	      console.log('INFO:  getValue() - keyPath: "' + keyPath + '" - value: ' + dataItem.value);

	      let getRPC = dataItem.GET;

	//JUNK
	//JUNK
	//JUNK
	//JUNK
	if(getRPC.plugin == 'TODO_Plugin')
	{
	  // console.log('Skipping - plugin:  ' + getRPC.plugin + ' .... N/A')
	  return null;
	}
	// if(getRPC.plugin == 'org.rdk.System' && getRPC.keyPath == 'currentFWVersion') // currentFWVersion, estb_mac, systemUptime
	// {
	//   console.log('Skipping - plugin:  ' + getRPC.plugin + ' .... keyPath: ' + getRPC.keyPath)
	//   return null;
	// }

	//JUNK
	//JUNK
	//JUNK
	//JUNK

	      // Call THUNDER to GET the (unscaled) VALUE
	      //
	      var ans = this.thunderUtils.callThunder(getRPC); // CALL THUNDER
	      ans.then( (rawValue) =>
	      {
	        console.log('INFO:  DataModel::getValue() - keyPath: ' + keyPath + '" - rawValue: "'+ JSON.stringify(rawValue) + '" ...' );
	        console.log('INFO:  DataModel::getValue() - keyPath: ' + keyPath + '" - success: '+ rawValue.success + ' ...' );

	        if(rawValue != null && rawValue != undefined &&
	          rawValue.success != undefined && rawValue.success == true)
	        {
	          var value = jsonKeypath.getValue(rawValue, getRPC.keyPath);

	          // Handle scaling from PLUGIN values to UI values per JSON
	          //
	          if(dataItem.Range != undefined && value != null)
	          {
	            let range = dataItem.Range;

	            if(range.PluginMin != undefined)
	            {
	              var span  = (range.Max       - range.Min);
	              var scale = (range.PluginMax - range.PluginMin);

	              value = value / (scale / span); // Scale PLUGIN to UI
	            }
	          }

	          if(value != null && rawValue != undefined)
	          {
	            // Apply a Value Formatter ?
	            //
	            if(getRPC.formatter != undefined)
	            {
	              var fn = DataModel.getFn(getRPC.formatter);
	              if(typeof fn != null)
	              {
	                value = fn(value);
	              }
	            }

	            dataItem.value = value; // UPDATE VALUE
	            console.log('INFO:  DataModel::getValue() - keyPath: ' + keyPath + '" - rawValue: "'+ JSON.stringify(rawValue) + '"  value: "' + value + '" ...' );

	            var listeners = dataItem.listeners;

	            // NOTIFY Listeners ... if any
	            //
	            if(listeners.length > 0)
	            {
	              listeners.map( l => l.didChange(value) ); // NOTIFY
	            }
	          }
	          else
	          {
	            console.log('INFO:  DataModel::getValue() - keyPath: ' + keyPath + '"  value: "' + value + '" ... BAD BAD BAD' );
	          }//ENDIF
	        }
	        else
	        {
	          console.log('INFO:  DataModel::getValue() - keyPath: ' + keyPath + '" - rawValue: "'+ JSON.stringify(rawValue) +  ' ... BAD BAD BAD' );
	          return null
	        }
	      })
	      .catch(e =>
	      {
	        console.log('EXCEPTION:  getValue() ... keyPath: ' + keyPath + '  e: ' + e);
	      });

	      return dataItem.value;
	    }
	    else
	    {
	      console.log('INFO:  DataModel::getValue() -  keyPath: "' + keyPath + '" ... NO dataItem !!!');
	    }

	    return null;
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  setValue(keyPath, value)
	  {
	    var scaledValue = value;

	    if(this.thunderUtils == null || this.thunderUtils == undefined)
	    {
	      console.log('FATAL:  setValue() -  this.thunderUtils is NULL ...');
	      return
	    }

	    console.log('INFO:  DataModel::setValue() -  keyPath: "' + keyPath + '"   value: '+value+'  - ENTER');

	    var dataItem = this.dataStore[keyPath];

	    if(dataItem != null && dataItem != undefined)
	    {
	      var setRPC = dataItem.SET;

	//JUNK
	//JUNK
	//JUNK
	//JUNK
	if(setRPC.plugin == 'TODO_Plugin')
	{
	  console.log('Skipping - plugin:  ' + setRPC.plugin + ' .... N/A');
	  return null;
	}
	//JUNK
	//JUNK
	//JUNK
	//JUNK
	      var params = {};

	      const isEmpty = (obj) =>
	      {
	        // console.log('INFO:  DataModel::isEmpty() - obj: ' + JSON.stringify(setRPC.params) );
	        if(obj == null || obj == undefined)
	        {
	          return true
	        }
	        return Object.keys(obj).length === 0 &&
	                  obj.constructor === Object
	      };

	      // Handle scaling from UI values to PLUGIN values per JSON
	      //
	      if(dataItem.Range != undefined)
	      {
	        let range = dataItem.Range;

	        if(range.PluginMin != undefined)
	        {
	          var span  = (range.Max       - range.Min);
	          var scale = (range.PluginMax - range.PluginMin);

	          scaledValue = value * (scale / span); // Scale UI to PLUGIN
	        }
	      }

	      // Prepare 'params' field for JSON "SET" request
	      //
	      if(isEmpty(setRPC.params) == true )
	      {
	        console.log('INFO:  DataModel::setValue() - CREATE params');

	        params[setRPC.keyPath] = scaledValue;
	        setRPC.params = params;
	      }
	      else
	      {
	        console.log('INFO:  DataModel::setValue() - USE params: ' + JSON.stringify(setRPC.params) );

	        setRPC.params[setRPC.keyPath] = scaledValue;
	      }

	      console.log('INFO:  DataModel::setValue() -  params: "' + JSON.stringify(setRPC.params)  );

	      // Call THUNDER to SET the (scaled) VALUE
	      //
	      var ans = this.thunderUtils.callThunder(setRPC); // CALL THUNDER
	      ans.then( (rawValue) =>
	      {
	        if(rawValue.success == true )
	        {
	          console.log('INFO:  DataModel::setValue() ... SUCCESS !! ...  keyPath: "' + keyPath + '" - value: ' + value + '   rawValue.success: ' + rawValue.success);

	          dataItem.value = scaledValue; // new value

	          var listeners = dataItem.listeners;

	          // NOTIFY Listeners ... if any
	          //
	          if(listeners.length > 0)
	          {
	            listeners.map( l => l.didChange(value) ); // NOTIFY
	          }

	          // PRESETS
	          if(value.Presets != undefined)
	          {
	            console.log('INFO:  DataModel::setValue() -  value.RpcRoot: "' + value.RpcRoot + '" - has PRESETS');
	            value.Presets.map( p =>
	            {
	              let kp = value.RpcRoot + '.' + p.Key;

	              var scaledValue = p.Value;
	              // Handle scaling from UI values to PLUGIN values per JSON
	              //
	              if(dataItem.Range != undefined)
	              {
	                let range = dataItem.Range;

	                if(range.PluginMin != undefined)
	                {
	                  var span  = (range.Max       - range.Min);
	                  var scale = (range.PluginMax - range.PluginMin);

	                  scaledValue = p.Value * (scale / span); // Scale UI to PLUGIN
	                }
	              }

	              console.log('INFO:  DataModel::setValue() -  PRESET: "' + kp + '" = ' + p.Value);

	              gDataModel.setValue(kp, scaledValue); //p.Value)
	            } ); // NOTIFY
	          }
	        }
	        else
	        {
	          console.log('INFO:  DataModel::setValue() ... FAILED !! ...  keyPath: "' + keyPath + '" - value: ' + value + '   rawValue.success: ' + rawValue.success);
	        }
	      })
	      .catch(e =>
	      {
	        console.log('EXCEPTION:  DataModel::setValue() ... keyPath: ' + keyPath + '  e: ' + e);
	      });
	    }
	    else
	    {
	      console.log('INFO:  DataModel::setValue() -  keyPath: "' + keyPath + '" ... NO dataItem !!!');
	    }

	    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  }

	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	}//CLASS

	var gDataModel = new DataModel();

	class MenuItemValue extends MenuItemBase
	{
	    _init()
	    {
	      super._init();

	      this.timeout    = null;
	      this.scrollAnim = null;

	      // console.log("ITEM SINGLE >>  " + JSON.stringify(this.item) )

	      if(this.item)
	      {
	        // console.log("ITEM params >>  " + JSON.stringify(this.item) )

	        this._text         = this.item.text          ? this.item.text          : this._text;
	        this._background   = this.item["Background"] ? this.item["Background"] : COLOR_BG;
	        this._textAlign    = this.item.textAlign     ? this.item.textAlign     : this._textAlign;
	        this.verticalAlign = this.item.verticalAlign ? this.item.verticalAlign : this._verticalAlign;

	        this.x = this.item["x"] || this.x;
	        this.y = this.item["y"] || this.y;

	        this.w = this.item["w"] || this.w;
	        this.h = this.item["h"] || this.h;
	      }//ENDIF

	      if( this["Text"] )      { this._text      = this["Text"];       }
	      if( this["Align"] )     { this._textAlign = this["Align"];      }
	      if( this.item["Text"] ) { this._text      = this.item["Text"];  }
	      if( this["Align"] )     { this._textAlign = this.item["Align"]; }

	      this.patch(
	      {
	        w: this.w,
	        h: this.h,

	        Label:
	        {
	          x: this.w/2,
	          y: this.h/2 + 3,
	          text:
	          {
	            fontSize: ( (SCREEN.precision < 1) ? (MENU_FONT_PTS_lo + 14) : MENU_FONT_PTS),
	            text: this._text,
	          }
	        }
	      });
	    }

	    didChange(v)
	    {
	      console.log('MenuItemValue::didChange("' + v + '") ...');

	      this.setValue(v);
	    }

	    setValue(v)
	    {
	      let label = this.tag('Label');

	      label.text = v;

	      let ww = DataModel.measureTextWidth(label);

	      // console.log("#############   ww: " + ww + "  text: " + label.text.text)
	      // console.log("#############   ww: " + ww + "  text: " + label.text.text)
	      // console.log("#############   ww: " + ww + "  text: " + label.text.text)
	      // console.log("#############   ww: " + ww + "  text: " + label.text.text)

	      if(ww > ITEM_W2)
	      {
	        // console.log("#############   LHS")
	        // console.log("#############   LHS")
	        // console.log("#############   LHS")
	        // console.log("#############   LHS")

	        label.mountX = 0.0;
	        label.x = 0;
	      }
	    }

	    _handleEnter()
	    {
	      this.fireAncestors('$fireCOMMAND',
	      {  "obj": this,
	          "cb": this.item["Callback"] } );
	    }


	    _focus()
	    {
	      super._focus();

	      let label = this.tag('Label');

	      // if(label.renderWidth > ITEM_W2)
	      // {
	      //   console.log("#############  AA  LHS")
	      //   console.log("#############  AA  LHS")
	      //   console.log("#############  AA  LHS")
	      //   console.log("#############  AA  LHS")

	      //   label.mountX = 0.0;
	      //   label.x = 0;
	      // }

	      let ww = DataModel.measureTextWidth(label);

	    }

	    _unfocus()
	    {
	      // console.log('#### UNFOCUS() - ENTER ')
	      super._unfocus();

	      if(this.timeout != null)
	      {
	        console.log('#### UNFOCUS() - CLEAR TIMEOUT ');
	        clearTimeout(this.timeout);
	        this.timeout = null;
	      }

	      if(this.scrollAnim != null)
	      {
	        console.log('#### UNFOCUS() - CLEAR ANIM ');
	        this.scrollAnim.stop();
	        this.scrollAnim = null;
	      }

	      // let o = this.tag('Label')

	      // o.x = 0;
	      // STOP ... clear timer
	    }

	    //////////////////////////////////////////////////////////////////////////////////////////////////
	  }//CLASS

	class MenuItemSet extends lng.Component
	{
	    static _template( )
	    {
	      return {
	          w: ITEM_W, h: ITEM_H,
	          Container:
	          {
	           clipping: true,
	            w: ITEM_W2, h: ITEM_H,
	            rect: true,
	            color: 0xFFff0000,

	            Values:
	            {
	             flex:    { direction: 'row' },
	             children:[],
	            },
	          }
	        }
	    }

	    _focus()
	    {
	      this.background = COLOR_HILITE;
	      // TIMEOUT ... then Animate

	    }

	    _unfocus()
	    {
	      this.background = COLOR_BG;
	      // STOP ... clear timer
	    }

	    _getFocused()
	    {
	      // console.log("#####  ITEMS >> _getFocused" )
	      var values = this.tag("Values").children;
	      if(values.length > 1)
	      {
	        this._setState('MenuItemSet_Keys');
	        return values[this.selectedIndex];
	      }
	      else
	      if(values.length > 0)
	      {
	        this._setState('MenuItemSet_Idle');
	        return values[this.selectedIndex];
	      }
	    }

	    set values( list )
	    {
	      this.values_  = list;
	      var menuItems = this.tag("Values");

	      menuItems.children = list.map( item =>
	      {
	          item.text  = item["Key"] ;  // Value string
	          item.value = item["Value"]; // Value value
	          item.w     = ITEM_W2;
	          item.h     = ITEM_H;

	          return {
	            type: MenuItemValue,
	            item
	          };
	        });
	    }

	    _init()
	    {
	      this.lastIndex     = 0;
	      this.selectedIndex = 0;

	      this.scrollTransition = { duration: 0.6, timingFunction: 'cubic-bezier(0.20,1.00,0.52,1.00)' };

	      if(this.valueSet != undefined)
	      {
	        this.values = this.valueSet;  // VALUES
	      }

	      this._setState('MenuItemSet_Idle');
	    }

	    notifyUpdate()
	    {
	      if(this.lastIndex == this.selectedIndex)
	      {
	        return; // No Change
	      }

	      this.lastIndex    = this.selectedIndex;
	      var offset        = ITEM_W2 * this.selectedIndex;
	      var valueItems    = this.tag("Values");
	      valueItems.smooth = { x: [ -offset, this.scrollTransition ] };

	      var ans = this.values_[this.selectedIndex];

	      // console.log('SP >>> index: ' + this.selectedIndex +
	      //             ' of ' + this.values_.length + '  ans: ' + JSON.stringify(ans) )

	      this.signal('valueChanged', { "value": ans } );
	    }

	    didChange(v)
	    {
	      //console.log('MenuItemSet::didChange("' + v + '") ...');
	      this.setValue(v.Key || v);
	    }

	    setValue(v)
	    {
	      console.log('MenuItemSet::setValue( '+ v +' )');

	      var kids  = this.tag("Values").children;
	      var label = kids[this.selectedIndex];

	      label.setValue( "" + v );
	    }

	    static _states() {
	      return [
	            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	            class MenuItemSet_Idle extends this
	            {
	              // $enter()
	              // {
	              //   console.log(">>>>>>>>>>>>   STATE:  MenuItemSet_Idle");
	              // }
	            },
	            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	            class MenuItemSet_Keys extends this
	            {
	              // $enter()
	              // {
	              //   console.log(">>>>>>>>>>>>   STATE:  MenuItemSet_Keys");
	              // }

	              _handleLeft() // LEFT
	              {
	                var kids = this.tag("Values").children;

	                if(kids.length > 0)
	                {
	                  if(--this.selectedIndex < 0)
	                  {
	                    this.selectedIndex = 0;
	                  }

	                  this.notifyUpdate();
	                }
	              }

	              _handleRight() // RIGHT
	              {
	                var kids = this.tag("Values").children;

	                if(kids.length > 0)
	                {
	                  if(++this.selectedIndex >= kids.length - 1)
	                  {
	                    this.selectedIndex = kids.length - 1;
	                  }

	                  this.notifyUpdate();
	                }
	              }
	            }
	      ]}


	    //////////////////////////////////////////////////////////////////////////////////////////////////
	  }//CLASS

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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


	class Progress extends lng.Component
	{
	    static _template( )
	    {
	      let RR = lng.shaders.RoundedRectangle;

	      var  barClr1  = COLOR_HILITE;
	      var  frameClr = 0xFF666666;  // #666666

	      var hh = 28;
	      return {
	          ProgressBar: {
	            Background: { x: -2, y: 0, w: 4, h: (hh    ), rect: true, color: frameClr, shader: { radius: 8, type: RR} },
	            Progress:   { x:  0, y: 2, w: 0, h: (hh - 4), rect: true, color: barClr1,  shader: { radius: 8, type: RR} },
	            ZeroMarker: { x:  0, y: 2, w: 3, h: (hh - 4), rect: true, color: 0xFFcccccc, alpha: 0 }
	        }
	        }
	    };

	    getProgress()
	    {
	      return this.value_;
	    }

	    reset()
	    {
	      this.value_ = 0;
	      this.tag("Progress").w = 0;
	    }

	    inc()
	    {
	      this.setValue( this.value_ + this.step_);
	    }

	    dec()
	    {
	      this.setValue( this.value_ - this.step_);
	    }

	    setValue(val, tt = 0.1)
	    {
	      if(val == this.value_) { return;          }
	      if(val >  this.max_)   { val = this.max_; }      if(val <  this.min_)   { val = this.min_; }
	      var mw = (this.w - 4);         // Max Width.  2px either side (inset)
	      var fx = ( mw / this.span_ );   // scale factor px:value
	      var ww = ( val * fx );         // This Width.
	      var zp = (0 - this.min_) * fx; // Zero point.

	      // console.log(">>  mw: " + mw)
	      // console.log(">>  ww: " + ww)
	      // console.log(">> val: " + val)

	      var bar = this.tag("Progress");
	      if(this.min_ == 0)
	      {
	        bar.x = zp;
	        bar.setSmooth('w', ww, {duration: 1});
	      }
	      else
	      {
	        if(ww > 0 && val > 0)
	        {
	          bar.setSmooth('w', ww, {duration: tt});
	        }
	        else
	        {
	          ww = -ww;

	          bar.animation({
	            duration: tt,
	            stopMethod: 'forward',
	            actions: [
	              { p: 'x', v: {0: bar.x, 1: (zp - ww)} },
	              { p: 'w', v: {0: bar.w, 1: (     ww)} },
	            ]
	          }).start();
	        }
	      }

	      this.value_ = val;
	    }

	    set min(v)   { this.min_ = v;  this.recalc();}
	    get min( )   { return this.min_  }

	    set max(v)   { this.max_ = v;  this.recalc();}
	    get max( )   { return this.max_  }

	    set step(v)  { this.step_ = v;  this.recalc();}
	    get step( )  { return this.step_  }

	    set value(v) { return this.setValue(v, 0); }
	    get value()  { return this.value_; }

	    _init()
	    {
	      this.span_  = 1;
	      this.value_ = 0;
	      this.min_   = this.min  ||   0; // default
	      this.max_   = this.max  || 100; // default
	      this.step_  = this.step ||   1; // default

	      this.radius_ = this.radius ||   8; // default

	      this.tag("Background").w = this.w;

	      this.reset();
	      this.recalc();
	    }

	    setRadius(r)
	    {
	      //console.log('#######  setRadius('+r+') ...');
	      this.radius_ = r;

	      let RR = lng.shaders.RoundedRectangle;

	      this.patch(
	      {
	        ProgressBar: {
	            Background: {  shader: { radius: this.radius_, type: RR} },
	            Progress:   {  shader: { radius: this.radius_,   type: RR} }
	        }
	      });
	    }
	    recalc()
	    {
	      this.span_ = Math.abs(this.max_ - this.min_);

	      if(this.span_ == 0) this.span_ = 1;
	      if(this.step_ == 0) this.step_ = (this.span_ * 0.1);

	      var bar = this.tag("Progress");

	      var mw = (this.w - 4); // 2px either side (insets)
	      var fx = ( mw / this.span_ );
	      var zp = (0 - this.min_) * fx;

	      bar.x = zp;

	      if(this.min_ < 0)
	      {
	        this.tag("ZeroMarker").alpha = 1.0;

	        var mw = (this.w - 4); // 2px either side (insets)
	        var fx = ( mw / this.span_ );
	        var zp = (0 - this.min_) * fx;

	        this.tag("ZeroMarker").x = zp;
	      }
	    }

	    _getFocused()
	    {
	      return this;
	    }

	    _focus()
	    {
	      this.tag("Background").color = 0xFF333333;
	    }

	    _unfocus()
	    {
	      var  frameClr = 0xFF666666;
	      this.tag("Background").color = frameClr;
	    }

	  }//CLASS

	class MenuItemRange extends lng.Component
	{
	    static _template( )
	    {
	      return {
	        w: ITEM_W, h: ITEM_H,
	        rect: true,
	        color: COLOR_BG,

	        ProgressBar:
	        {
	          type: Progress,
	          mountY: 0.5,
	          x: 4, y: (h => h/2 - 4),
	          w: ITEM_W2 * 0.5,
	          h: ITEM_H2 * 0.75
	        },

	        ProgressTxt:
	        {
	          w: ITEM_W2/2,
	          mountX: 1.0,
	          x: ITEM_W2,

	          text: {
	            text: "",
	            fontSize: ( (SCREEN.precision < 1) ? (MENU_FONT_PTS_lo + 14) : MENU_FONT_PTS),
	            textColor: MENU_FONT_COLOR,
	            textAlign: 'center',
	            verticalAlign: 'middle',
	            maxLines: 1,
	            wordWrapWidth: (w => w),
	            textOverflow: 'clip',
	            ...shdw
	          },
	        }
	      }
	    }

	    _focus()
	    {
	      this.color = COLOR_HILITE;
	    }

	    _unfocus()
	    {
	      this.color = COLOR_BG;
	    }

	    _getFocused()
	    {
	      return this.tag("ProgressBar");
	    }

	    _init()
	    {
	      let bar = this.tag("ProgressBar");

	      if(this.rangeSet["Min"] != undefined)
	      {
	        bar.min = this.rangeSet["Min"];
	      }

	      if(this.rangeSet["Max"] != undefined)
	      {
	        bar.max = this.rangeSet["Max"];
	      }

	      if(this.rangeSet["Step"] != undefined)
	      {
	        bar.step = this.rangeSet["Step"];
	      }

	      if(this.rangeSet["Value"] != undefined)
	      {
	        bar.value = this.rangeSet["Value"];

	        this.updateLabel(bar.value);
	      }
	    }

	    updateLabel(value)
	    {
	      if(value == undefined || value == null)
	      {
	        console.log('MenuItemRange::updateLabel() <<< Bad Args...');
	        return
	      }

	      var txt = this.tag("ProgressTxt");
	      if(txt != null && txt != undefined)
	      {
	        if(!isNaN(value)) // true == number type
	        {
	          try
	          {
	            var str = value;
	            if(typeof value != 'string')
	            {
	              str = '' + value.toFixed(1) + '';
	            }
	            else
	            {
	              console.log('MenuItemRange::updateLabel('+value+') is a STRING');
	            }
	            txt.text = str;
	          }
	          catch(e)
	          {
	            console.log('MenuItemRange::updateLabel() <<< EXCEPTION ... e: ' + e);
	          }
	        }
	        else
	        {
	          console.log('MenuItemRange::updateLabel() <<< string ...');
	          txt.text = value;
	        }
	      }
	      else
	      {
	        console.log('MenuItemRange::updateLabel() <<< Progress Bar not ready...');
	      }
	    }

	    didChange(v)
	    {
	      // console.log('MenuItemRange::didChange("' + v + '") ...');

	      try
	      {
	        this.setValue(v);
	      }
	      catch(e)
	      {
	        console.log('MenuItemRange::didChange("' + v + '") ... EXCEPTION: ' + JSON.stringify(e, null,4) );
	      }
	    }

	    setValue(v)
	    {
	      // console.log("RANGE - setValue() >>>> " + v)

	      var bar = this.tag("ProgressBar");

	      if(bar)
	      {
	        bar.setValue(v);
	        this.updateLabel(v);
	      }
	      else
	      {
	        console.log('MenuItemRange::setValue() <<< Progress Bar not ready...');
	      }
	    }

	    setProgress(v)
	    {
	      var bar = this.tag("ProgressBar");
	      (v > 0) ? bar.inc() : bar.dec();

	      this.updateLabel(bar.value);
	    }

	    _handleLeft() // TAB LEFT
	    {
	      this.setProgress(-1); //dec

	      var bar = this.tag("ProgressBar");
	      let ans = bar.value;

	      this.signal('valueChanged', { "value": ans } );
	    }

	    _handleRight() // TAB RIGHT
	    {
	      this.setProgress(1); // inc

	      var bar = this.tag("ProgressBar");
	      let ans = bar.value;

	      this.signal('valueChanged', { "value": ans  } );
	    }

	    //////////////////////////////////////////////////////////////////////////////////////////////////
	  }//CLASS

	class MenuItemPair extends lng.Component
	{
	    static _template( )
	    {
	      return {
	          w: ITEM_W, h: ITEM_H,

	          Label:
	          {
	            type: MenuItemValue,
	            item: {
	              w: ITEM_W2,
	              x: 0
	            }
	          },

	          Value:
	          {
	            w: ITEM_W2,
	            x: ITEM_W2,
	                  flex: { direction: 'row' },
	              flexItem: { maxWidth: ITEM_W2, minHeight: ITEM_H },
	              children: [],
	          },
	        }
	    }

	    set background(clr)
	    {
	      this.color = clr;
	    }

	    _focus()
	    {
	      this.background = COLOR_HILITE;
	    }

	    _unfocus()
	    {
	      this.background = COLOR_BG;
	    }

	    _getFocused()
	    {
	      return this.tag("Value").children[0];
	    }

	    _init()
	    {

	      var  key = this.pair["Key"];
	      var  obj = this.tag("Label");
	      let data = this.pair["data"];
	      let  rpc = key["Rpc"];

	      let rpcNode = rpc;

	      // console.log(">>>>>>>>>>>>   MenuItemPair:: this._id >> " +  this._id);

	      if(data != undefined)
	      {
	        // Find RPC object for this GUI reference
	        //
	        rpc = jsonKeypath.getValue(data, rpc);
	      }

	      var widget = null;

	      if(obj)
	      {
	        obj.label = key["Text"];      // KEY
	      }

	      var val    = this.pair["Value"];
	      var tagged = this.tag("Value");

	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      // VALUES
	      //
	      if(val.Values != undefined || (rpc && rpc.Values != undefined))
	      {
	        let valueSet = val.Values || rpc.Values ;
	              widget = this.application.stage.c( {
	                                                  type: MenuItemSet,
	                                               signals: {
	                                          valueChanged: '_valueChanged'
	                                        },
	                                        valueSet });

	        tagged.childList.add( widget );
	      }
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      // RANGE
	      //
	      else
	      if(  key.Range != undefined || (rpc && rpc.Range != undefined))
	      {
	        let rangeSet      =  key.Range || rpc.Range;
	        rangeSet["Value"] = val["Value"] || 0;

	       // console.log("RANGE >>  rangeSet: " + JSON.stringify(rangeSet) )

	        widget = this.application.stage.c( {
	                                                  type: MenuItemRange,
	                                               signals: {
	                                          valueChanged: '_valueChanged'
	                                        },
	                                        rangeSet });

	        tagged.childList.add( widget );
	      }
	      else
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      // VALUE
	      //
	      {
	        // Single Item
	        let valueSet = [ val ]; // VALUE
	              widget = this.application.stage.c( {
	                                        type: MenuItemSet,
	                                        signals: {
	                                          valueChanged: '_valueChanged'
	                                        },
	                                        valueSet   });

	        tagged.childList.add( widget );
	      }
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	      if(rpcNode != undefined)
	      {
	        widget.rpcNode = rpcNode;
	        //console.log(">>>>>>>>>>>>   widget.rpcNode = " + widget.rpcNode);
	      }

	      // Initial Update via RPC
	      if(rpc)
	      {
	        gDataModel.addDataItem(rpc,    rpcNode); // initial update
	        gDataModel.addListener(rpcNode, widget);

	        rpc.rpcNode = rpcNode; // CREATE NODE REFERENCE
	      }
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	    }//init()

	    _valueChanged(obj)
	    {
	      // console.log( " #####  >> valueChanged() - ENTER   obj: " + obj)
	      // console.log( " #####  >> valueChanged()  obj: " + JSON.stringify(obj))

	      var key = this.pair["Key"];

	      if(key["Rpc"])
	      {
	        let rpc  = key["Rpc"];
	        let text = key["Text"];
	        let data = this.pair["data"];

	        if(data != undefined)
	        {
	          // Find RPC object (GET, SET, Range, rpcNode, etc ...) for this GUI reference
	          //
	          rpc = jsonKeypath.getValue(data, rpc);
	        }

	       // console.log("FIRE key >> " + JSON.stringify(key) )

	        this.fireAncestors('$fireValueSET',
	                            {   "rpc": rpc,
	                                "key": text,
	                              "value": obj.value } );
	      }
	      else
	      {
	        console.log("PAIR >> no RPC");
	      }
	    }

	    //////////////////////////////////////////////////////////////////////////////////////////////////
	  }//CLASS

	class MenuItemFactory
	{
	  static createItem(item)
	  {
	    var rc = null;

	    switch(item.Type)
	    {
	      // - - - - - - - - - - - - - - - - - -
	      case "tab":
	        let tabItem = item;

	        rc = {
	          type: MenuListTab,
	          tabItem
	        };
	      break;
	      // - - - - - - - - - - - - - - - - - -
	      case "menu":
	        rc = {
	          type: MenuItemValue,
	          item
	        };
	      break;
	      // - - - - - - - - - - - - - - - - - -
	      case "submenu":
	        rc = {
	          type: MenuItemSub,
	          item
	        };
	      break;
	      // - - - - - - - - - - - - - - - - - -
	      case "kvpair":
	      {
	        let data = item.data;
	        let pair = item.Row;

	        if(pair != undefined)
	        {
	          pair.data = data;
	        }

	        rc = {
	          type: MenuItemPair,
	          pair
	        };
	      }
	      break;
	      // - - - - - - - - - - - - - - - - - -
	      case "label":
	        rc = {
	          type: MenuItemValue,
	          item
	        };
	      break;
	      // - - - - - - - - - - - - - - - - - -
	      default:
	        console.log("MENU TAB >>> DEFAULT:  item.Type: " + item.Type);
	        rc = {
	          w: ITEM_W, h: ITEM_H,
	          rect: true,
	          color: 0x88ff0000,  // RED
	        };
	    }//SWITCH

	    return rc;
	  }
	}//CLASS

	class AppMainScreen extends Lightning.Component
	{
	  static _template() {

	    return {

	      GuiContainer:
	      {
	        alpha: 1.0,
	        longpress: {up: 700, down: 600, left: 800, right: 900},

	        MenuTabs: {
	          flex: { direction: 'row' },  // ROW OF TAB

	          // Menu JSON ... injected here
	          children: []
	        }, // Tabs

	      }, //GuiContainer
	    }
	  }

	  _init()
	  {
	    console.log('MAIN SCREEN');
	    console.log('MAIN SCREEN');
	    console.log('MAIN SCREEN');
	    console.log('MAIN SCREEN');

	    this.mainGui = this.tag('GuiContainer');

	    SCREEN.precision = this.stage.getOption('precision');

	    this.lastState = null;
	    this.tabIndex  = 0;
	  }

	  processMenuJSON(menu, data)
	  {
	    if(menu && data)
	    {
	      var tabsTag = this.tag("MenuTabs");

	      var tabs = menu["Tabs"] || menu;

	      tabsTag.children = tabs.map( tab =>
	      {
	        let tabItem = { Type: tab.Type,
	                        name: tab.Text,
	                        menu: tab.Items,
	                        data: data };

	        return MenuItemFactory.createItem(tabItem)
	      });

	      this._setState('MainMenuState');
	    }
	    else
	    {
	      console.log(">>>>>>>>>>>>   processMenuJSON() - ERROR");
	      console.log(">>>>>>>>>>>>   processMenuJSON() - ERROR");
	    }
	  }

	  static _states(){
	    return [

	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class MainMenuState extends this
	          {
	            _getFocused()
	            {
	              var tabs = this.tag('MenuTabs').children;
	              return tabs[this.tabIndex]; // INDEX OF TAB IN ROW
	            }

	            _handleLeft() // TAB LEFT
	            {
	              if(--this.tabIndex < 0) this.tabIndex = 0;
	            }

	            _handleRight() // TAB RIGHT
	            {
	              var tabs = this.tag("MenuTabs").children;
	              if(++this.tabIndex >= tabs.length - 1) this.tabIndex = tabs.length - 1;
	            }

	            // _handleKey(k)
	            // {
	            //   console.log('AppMainScreen >>> k.keyCode: ' + k.keyCode)

	            //   switch(k.keyCode)
	            //   {

	            //     default:
	            //       console.log('MainMenuState >>> _handleKey() - default: ' +k.keyCode )
	            //       return false // propagate
	            //   }//SWITCH

	            //   return false // propagate
	            // }
	          }, // CLASS - MainMenuState
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      ]
	  }//_states
	} // CLASS - App

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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


	class AppAgingScreen extends lng.Component
	{
	  static _template( )
	  {
	    return  {

	      w: SCREEN.w,
	      h: SCREEN.h,
	      color: "0xFFffffff",
	      rect: true,

	      MText:
	          {
	            x: (SCREEN.precision * SCREEN.w) * 0.15,
	            y: (SCREEN.precision * SCREEN.h) * 0.025,
	            text: {
	              text: "M",
	              fontSize: ( (SCREEN.precision < 1) ? 125 : 250),
	              textColor: 0xFFff0000,
	              textAlign:  'center'
	            }
	          }
	    }
	  };

	  _init()
	  {

	  }

	  _getFocused()
	  {
	    return this;
	  }

	  getAgingState()
	  {
	    var ans = gDataModel.getPStore('AgingState');

	    // console.log('>>>>>>>>>>>>   AGING:  getState() - ans: >>' + ans + '<<');
	    // console.log('>>>>>>>>>>>>   AGING:  getState() - ans: ' + JSON.stringify(ans) );

	    return ans
	  }

	  setAgingState( v )
	  {
	    console.log('>>>>>>>>>>>>   AGING:  setAgingState('+ v +') - ENTER' );

	    if(v)
	    {
	      this._setState('AgingState');
	    }
	    var ans = gDataModel.setPStore('AgingState', v);

	   // console.log('>>>>>>>>>>>>   AGING:  setState('+v+') - ans: ' + JSON.stringify(ans) );

	    return ans
	  }

	  static _states()
	  {
	    return [
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      class AgingState extends this
	      {
	        $enter()
	        {
	          console.log('AgingState - ENTER ');
	        }

	        // _handleKey(k)
	        // {
	        //   switch(k.keyCode )
	        //   {
	        //     case KEYS.hfr_AGING: // AGING key
	        //     if( isAltOnly(k) || isDEBUG)
	        //     {
	        //       console.log('AgingState >>> _handleKey() - default: ' +k.keyCode )
	        //       return false // propagate
	        //     }
	        //     break;
	        //     default:
	        //       console.log('AgingState >>> _handleKey() - default: ' +k.keyCode )
	        //       return true // eat EVERYTHING !!!
	        //   }//SWITCH

	        //   return true // eat EVERYTHING !!!
	        // }

	      }, // CLASS - AgingState
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      class FooState extends this
	      {
	        $enter(event)
	        {

	        }

	        $exit()
	        {
	          // console.log(">>>>>>>>>>>>   STATE:  FooState - EXIT");

	          //  this.player.setSmooth('alpha',  0.0, {duration: 0.2 });
	          //  this.mainGui.setSmooth('alpha', 1.0, {duration: 0.4 });
	        }

	        _getFocused()
	        {
	          return this
	        }

	      }// CLASS - FooState
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	    ]
	    }//_states
	}//CLASS

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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

	let OrangeCLR = 0xFFfebf00; //   #febf00
	let GrayCLR   = 0xFF888888; //   #888888

	class AppMScreen extends lng.Component
	{
	    static _template( )
	    {
	      let hh = SCREEN.h * 0.33;

	      return  {
	        MScreen_bg:
	        {
	          w: hh,
	          h: hh,
	          color: OrangeCLR,
	          rect: true,

	          MText:
	          {
	            mount: 0.5,
	            x: (SCREEN.precision * hh)/2,
	            y: (SCREEN.precision * hh)/2 + (SCREEN.precision * 30),
	            text: {
	              text: "M",
	              fontSize: ( (SCREEN.precision < 1) ? 125 : 250),
	              textColor: 0xFF000000,
	              textAlign:  'center'
	            }
	          }
	        },

	        Aging: {
	          alpha: 0.0,
	          type: AppAgingScreen,
	        },
	      }
	    };

	    _init()
	    {
	      this.Aging = this.tag('Aging');

	      this._setState('ActiveState');

	      this.longTimeout = null;
	      this.longPressed = false;

	      // Resume Againg after reboot ????
	      this.Aging.getAgingState()  // Get AGING
	      .then( (o) =>
	      {
	        GLOBAL.isAGING = o.value;

	        // console.log('DEBUG: MMMM GLOBAL.isAGING >> "' + GLOBAL.isAGING + '"')

	        if(GLOBAL.isAGING == "true")
	        {
	          // continue Aging from reboot
	          this._setState('StartAgingState');
	        }
	      });
	    }

	    _getFocused()
	    {
	      return this;
	    }

	    static _states()
	    {
	      return [
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class ActiveState extends this
	        {
	          $enter()
	          {
	             // console.log(">>>>>>>>>>>>   STATE:  ActiveState");

	            this.tag('MScreen_bg').setSmooth('color', OrangeCLR, { duration: 0.5 });
	          }

	          $enter()
	          {
	            console.log(">>>>>>>>>>>>   STATE:  MScreenState - ENTER");

	           // this.tuner.toggleScan()
	          }

	          $exit()
	          {
	            // console.log(">>>>>>>>>>>>   STATE:  MScreenState - EXIT");
	          }

	          startLongPress(cb, tt)
	          {
	            if(this.longTimeout == null  &&
	               this.longPressed == false )
	            {
	              // console.log('MScreenState >>>  START longpress')

	              this.longPressed = true;
	              let done_cb = cb;

	              this.longTimeout = setTimeout( () =>
	              {
	                if(done_cb)
	                {
	                  done_cb();
	                }
	                this.longTimeout = null;
	              }, tt);
	            }
	            else
	            {
	              console.log('MScreenState >>>  ALT - Did NOT Start   timeout: ' + this.longTimeout + '  longPressed: ' + this.longPressed );
	            }
	          }

	          stopLongPress()
	          {
	            this.longPressed = false;
	            if(this.longTimeout != null)
	            {
	              // console.log('MScreenState >>>  ALT  <<< CANCELLED')

	              clearTimeout(this.longTimeout);
	              this.longTimeout = null;
	            }
	          }

	          // for LONG PRESS behavior
	          _handleKeyRelease(k)
	          {
	            // console.log(' END SECOND  >>>>>>>>>>>>>>>>>>>>> AGING')

	            this.stopLongPress();
	          }

	          _handleKey(k)
	          {
	            let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
	                      'A[' + (k.altKey   ? '1' : '0') + '] '+
	                      'S[' + (k.shiftKey ? '1' : '0') + '] ';

	            console.log('AppMScreen >>> '+CAS+'  k.keyCode: ' + k.keyCode);

	            switch(k.keyCode)
	            {
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              //case 68: // DEBUG
	              case KEYS.hfr_F7: // F7 key
	              if( isAltOnly(k) || isDEBUG)
	              {
	                console.log('AppMScreen >>> F7 Key');

	                this.fireAncestors('$onScanWifiBT');
	              }
	              break
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              case 65: // DEBUG
	              case KEYS.hfr_AGING: // AGING key
	              if( isAltOnly(k) || isDEBUG)
	              {
	                // console.log('AppMScreen >>> Start Aging  ?? ' + GLOBAL.isAGING)

	                this.startLongPress( () =>
	                {
	                  // console.log('AppMScreen >>> Start AGING ' + GLOBAL.isAGING)

	                  let ans = (GLOBAL.isAGING == 'true');
	                  this._setState(ans ? 'StopAgingState'   // IF -already Aging ... STOP
	                                     : 'StartAgingState'); // ELSE ... START Aging

	                }, 1000); //ms

	                return true // handled
	              }
	              break;
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              //case 68: // DEBUG
	              case KEYS.hfr_DMP: // DMP key
	              if( isAltOnly(k) || isDEBUG)
	              {
	                this.startLongPress( () =>
	                {
	                  console.log(' ONE SECOND  >>> DMP');

	                  this.fireAncestors('$onPlayDefaultVideo');
	/*
	                  let params =
	                  {
	                    text: "4K_VIDEO_TEST Not Found",
	                    pts:  ( (SCREEN.precision < 1) ? 50 : 100),
	                    mount: 0.5,
	                    timeout_ms: 3000,
	                    w: (SCREEN.precision * 1920 * 0.75),
	                    h: (SCREEN.precision * 1080 * 0.5),
	                    x: (SCREEN.precision * 1920 * 0.5),
	                    y: (SCREEN.precision * 1080 * 0.5),
	                  }

	                  this.fireAncestors('$onShowToast', params);
	*/
	                 // this._setState('PlayVideoState')

	                  // TODO - show the DEFAULT per Resolution move.  (4K_)VIDEO_TEST.mp4
	                }, 1000); //ms

	                return true // handled
	              }
	              break;

	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              //case 76:
	              case KEYS.hfr_LOGO:
	                if( isAltKeyCode(k, KEYS.hfr_LOGO)  ||
	                   ( k.keyCode == 76) ) // L
	                {
	                  let params =
	                  {
	                    text: "his",
	                    timeout_ms: 3000,
	                    w: (SCREEN.precision * 1920 * 0.25),
	                    h: (SCREEN.precision * 1080 * 0.25),
	                  };

	                  this.fireAncestors('$onShowToast', params);
	                  return true // handled
	                }
	              break;
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              //case 66:
	              case KEYS.hfr_BAL:
	                if( isAltKeyCode(k, KEYS.hfr_BAL)  ||
	                   ( k.keyCode == 66) ) // B
	                {
	                  let params =
	                  {
	                    text: "MIDDLE",
	                    timeout_ms: 3000
	                  };

	                  this.fireAncestors('$onShowToast', params);
	                  return true // handled
	                }
	              break;

	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              // case 83: // S key
	              // if(k.altKey && !k.shiftKey && !k.ctrlKey)
	              // {
	              //   console.log('MScreenState >>>  ALT SHIFT  k.keyCode: ' + k.keyCode)
	              //   //this.tuner.toggleScan()
	              // }
	              // break;
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              default:
	                console.log('AppMScreen >>> _handleKey() CAS: ' +CAS+ '- default: ' + k.keyCode );

	                if(isAltOnly(k) )
	                {
	                  //
	                  // Look for xxxKeys.JSON defined behavior...
	                  //
	                  let rpc = gDataModel.getKeymapRPC(k.keyCode);

	                  if(rpc != null && rpc["Callback"] != undefined)
	                  {
	                    console.log('AppMScreen >>> _handleKey() - fire: ' + rpc["Callback"]  );

	                    let params = {
	                      "obj": this,
	                       "cb": rpc["Callback"]
	                    };

	                    this.fireAncestors('$fireCOMMAND', params);
	                    return true // handled
	                  }
	                  else
	                  {
	                    console.log('AppMScreen >>> _handleKey() - NO RPC ' );
	                    return false // propagate
	                  }
	                }

	                return false // propagate
	            }//SWITCH

	            return false // propagate
	          }
	        }, //CLASS
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class InctiveState extends this
	        {
	          $enter()
	          {
	             // console.log(">>>>>>>>>>>>   STATE:  InctiveState");

	            this.tag('MScreen_bg').setSmooth('color', GrayCLR, { duration: 0.5 });
	          }
	        }, //CLASS
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class StartAgingState extends this
	        {
	          $enter()
	          {
	            // console.log(">>>>>>>>>>>>   STATE:  StartAgingState - ENTER");

	            GLOBAL.isAGING = "true";
	            this.Aging.setAgingState(GLOBAL.isAGING);

	            this.Aging.setSmooth('alpha', 1.0, { duration: 0.2 });
	          }

	          // $exit()
	          // {
	          //   console.log(">>>>>>>>>>>>   STATE:  StartAgingState - EXIT");
	          // }

	          _getFocused()
	          {
	            return this.mScreen
	          }

	          startLongPress(cb, tt)
	          {
	            if(this.longTimeout == null  &&
	               this.longPressed == false )
	            {
	              this.longPressed = true;
	              let done_cb = cb;
	              this.longTimeout = setTimeout( () =>
	              {
	                if(done_cb)
	                {
	                  done_cb();
	                }
	                this.longTimeout = null;
	              }, tt);
	            }
	          }

	          stopLongPress()
	          {
	            this.longPressed = false;
	            if(this.longTimeout != null)
	            {
	              clearTimeout(this.longTimeout);
	              this.longTimeout = null;
	            }
	          }

	          // for LONG PRESS behavior
	          _handleKeyRelease(k)
	          {
	            this.stopLongPress();
	          }

	          _handleKey(k)
	          {
	            let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
	                      'A[' + (k.altKey   ? '1' : '0') + '] '+
	                      'S[' + (k.shiftKey ? '1' : '0') + '] ';

	            // console.log('StartAgingState >>> '+CAS+'  k.keyCode: ' + k.keyCode)

	            switch(k.keyCode)
	            {
	              case KEYS.hfr_AGING: // AGING key
	              if( isAltOnly(k) || isDEBUG)
	              {
	                this.startLongPress( () =>
	                {
	                  //console.log(' StartAgingState >>>  Go to STOP AGING   GLOBAL.isAGING: ' + GLOBAL.isAGING)

	                  this._setState('StopAgingState');
	                }, 1000); //ms

	                return true // handled
	              }
	              break;

	              default:
	                console.log('StartAgingState >>> _handleKey() CAS: ' +CAS+ '- default: ' + k.keyCode );
	                break;
	            }//SWITCH

	            return true // eat
	          }
	        }, // CLASS - StartAgingState
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class StopAgingState extends this
	        {
	          $enter()
	          {
	            // console.log(">>>>>>>>>>>>   STATE:  StopAgingState - ENTER");

	            GLOBAL.isAGING = "false";
	            this.Aging.setAgingState(GLOBAL.isAGING);

	            this.Aging.setSmooth('alpha', 0.0, { duration: 0.2 });

	            this._setState('ActiveState');
	          }

	          // $exit()
	          // {
	          //   console.log(">>>>>>>>>>>>   STATE:  StopAgingState - EXIT");
	          // }

	          _getFocused()
	          {
	            return this.mScreen
	          }

	        }, // CLASS - StartAgingState

	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      ]
	     }//_states
	  }//CLASS

	var startTimer = null;
	var stopTimer  = null;

	/**
	 * Class to render AAMP video player.
	 */
	class AAMPVideoPlayer2 extends Lightning.Component {
	  /**
	   * Function to render player controls.
	   */
	  static _template() {
	    return {
	      LoaderImg: {
	        x: 0, y: 0,
	        w: 1920,
	        h: 1080,
	        Loader: {
	          mount: 0.5, x: 1920 / 2, y: 1080 / 2, src: Utils.asset('images/loader.png')
	        }
	      },
	    }
	  }

	  _init()
	  {
	    // console.log('PLAYER:  Playback ... init() ! ')

	    this.videoEl = document.createElement('video');
	    this.videoEl.setAttribute('id', 'video-player');
	    this.videoEl.style.position = 'absolute';
	    this.videoEl.style.zIndex = '1';
	    this.videoEl.setAttribute('width', '100%');
	    this.videoEl.setAttribute('height', '100%');

	    // this.videoEl.setAttribute('src', 'placeholder.mp4')

	    this.videoEl.setAttribute('type', 'video/ave');

	    document.body.appendChild(this.videoEl);

	    this.playbackSpeeds = [-64, -32, -16, -4, 1, 4, 16, 32, 64];
	    this.playerStatesEnum = { idle: 0, initializing: 1, playing: 8, paused: 6, seeking: 7 };
	    this.player = null;

	    // Create the PLAYER
	    this.createPlayer();

	    this.playbackRateIndex = this.playbackSpeeds.indexOf(1);
	    this.defaultInitConfig =
	    {
	      initialBitrate: 2500000,
	      offset: 0,
	      networkTimeout: 10,
	      preferredAudioLanguage: 'en',
	      liveOffset: 15,
	      drmConfig: null
	    };

	    this.loadingAnimation = this.tag('Loader').animation({
	      duration: 1, repeat: -1, stopMethod: 'immediate', stopDelay: 0.2, actions: [
	        { p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } },
	      ]
	    });
	    this.loadingAnimation.play();
	  }

	  /**
	   * Function to set video coordinates.
	   * @param {int} x  ... x - of video
	   * @param {int} y  ... y - of video
	   * @param {int} w  ... w - of video
	   * @param {int} h  ... h - of video
	   */
	  setVideoRect(x, y, w, h)
	  {
	    if(this.player)
	    {
	      let xPos = 0.67 * x;
	      var yPos = 0.67 * y;
	      var wPos = 0.67 * w;
	      var hPos = 0.67 * h;

	      this.player.setVideoRect(xPos, yPos, wPos, hPos);
	    }
	    else
	    {
	      console.log('PLAYER:  Playback ... setVideoRect() >>>  No Player  !!!!' );
	    }
	  }


	  /**
	   * Event handler to store the current playback state.
	   * @param  event playback state of the video.
	   */
	  _playbackStateChanged(event)
	  {
	    console.log('PLAYER:  State  >> ' + JSON.stringify(event) );
	    console.log('PLAYER:  State  >> ' + JSON.stringify(event) );
	    console.log('PLAYER:  State  >> ' + JSON.stringify(event) );
	  }


	  /**
	   * Event handler to handle the event of completion of a video playback.
	   */
	  _mediaEndReached()
	  {
	    console.log('PLAYER:  Finished  >> FIRE >> mediaPlackbackEnded ');
	    console.log('PLAYER:  Finished  >> FIRE >> mediaPlackbackEnded ');
	    console.log('PLAYER:  Finished  >> FIRE >> mediaPlackbackEnded ');

	    this.player.stop();
	    this.fireAncestors('$mediaPlackbackEnded');

	    console.log('PLAYER:  Playback ... Ended >> FIRE  >>> $mediaPlackbackEnded');
	    console.log('PLAYER:  Playback ... Ended >> FIRE  >>> $mediaPlackbackEnded');
	    console.log('PLAYER:  Playback ... Ended >> FIRE  >>> $mediaPlackbackEnded');
	  }

	  /**
	   * Event handler to handle the event of changing the playback speed.
	   */
	  _mediaSpeedChanged()
	  {
	    console.log('PLAYER:  GOT >> _mediaSpeedChanged ');

	  }

	  /**
	   * Event handler to handle the event of bit rate change.
	   */
	  _bitrateChanged() {}

	  /**
	   * Function to handle the event of playback failure.
	   */
	  _mediaPlaybackFailed()
	  {
	    console.log('PLAYER:  Playback ... FAILED ! ');

	    this.load(this.videoInfo);
	  }

	  /**
	   * Function to handle the event of playback progress.
	   * @param event playback event.
	   */
	  _mediaProgressUpdate(event)
	  {
	    this.position_sec = event.positionMiliseconds / 1000;

	    console.log('PLAYER:  Playback ... this.position_sec: ' + this.position_sec + ' of ' + this.videoInfo.endTime + ' sec ');

	    if (this.position_sec >= this.videoInfo.endTime)
	    {
	      this.stop();
	      this.fireAncestors('$mediaPlackbackEnded');

	      console.log('PLAYER:  Playback ... Progress >> FIRE  >>> $mediaPlackbackEnded');
	      console.log('PLAYER:  Playback ... Progress >> FIRE  >>> $mediaPlackbackEnded');
	      console.log('PLAYER:  Playback ... Progress >> FIRE  >>> $mediaPlackbackEnded');
	    }
	  }

	  /**
	   * Function to handle the event of starting the playback.
	   */

	  _mediaPlaybackStarted()
	  {
	    this.tag('LoaderImg').alpha = false;
	    this.player.setVolume(0);

	    // Fade in Audio
	    //
	    if(startTimer == null)
	    {
	      startTimer = setInterval( () =>
	      {
	        if ((this.player.getVolume() + 20) < 100)
	        {
	          console.log('PLAYER:  Playback ... _mediaPlaybackStarted() >>>  fade IN audio' );

	          this.player.setVolume(this.player.getVolume() + 20);
	        }
	        else
	        {
	          this.player.setVolume(100);

	          clearInterval(startTimer);
	          startTimer = null;
	        }
	      }, 500);
	    }
	  }

	  /**
	   * Function to handle the event of change in the duration of the playback content.
	   */
	  _mediaDurationChanged() {}

	  /**
	   * Function to create the video player instance for video playback and its initial settings.
	   */
	  createPlayer()
	  {
	    if (this.player !== null)
	    {
	      console.log('PLAYER:  Playback ... createPlayer() - ALREADY ! ');

	      this.player.stop();
	      return
	    }

	    try
	    {
	      this.player = new AAMPMediaPlayer();

	      // console.log('PLAYER:  Playback ... createPlayer()  >>>  this.player: ' + this.player)

	      if(this.player)
	      {
	        this.player.addEventListener('playbackStateChanged', this._playbackStateChanged.bind(this));

	        this.player.addEventListener('playbackCompleted',      this._mediaEndReached);
	        this.player.addEventListener('playbackSpeedChanged',   this._mediaSpeedChanged);
	        this.player.addEventListener('bitrateChanged',         this._bitrateChanged);
	        this.player.addEventListener('playbackFailed',         this._mediaPlaybackFailed.bind(this));
	        this.player.addEventListener('playbackProgressUpdate', this._mediaProgressUpdate.bind(this));
	        this.player.addEventListener('playbackStarted',        this._mediaPlaybackStarted.bind(this));
	        this.player.addEventListener('durationChanged',        this._mediaDurationChanged);

	        this.playerState = this.playerStatesEnum.idle;
	      }
	      else
	      {
	        console.log('PLAYER:  Playback ... createPlayer() >>> FAILED !! ');
	      }
	    }
	    catch (error)
	    {
	      console.error('PLAYER:  AAMPVideoPlayer (native)  is NOT defined');
	    }
	  }

	  /**
	   * Loads the player with video URL.
	   * @param videoInfo the url and the info regarding the video like title.
	   */
	  load(videoInfo)
	  {
	    if(this.player)
	    {
	      this.createPlayer();

	      console.log('PLAYER:  load()  url ' + videoInfo.url);

	      this.videoInfo           = videoInfo;
	      this.configObj           = this.defaultInitConfig;
	      this.configObj.drmConfig = this.videoInfo.drmConfig;
	      this.configObj.offset    = this.videoInfo.startTime;

	      this.player.initConfig(this.configObj);
	      this.player.load(videoInfo.url);

	      this.play();
	      this.tag('LoaderImg').alpha = 1;
	    }
	    else
	    {
	      console.log('PLAYER:  Playback ... load() >>>  No Player  !!!!' );
	    }
	  }

	  /**
	   * Starts playback when enough data is buffered at play head.
	   */
	  play()
	  {
	    if(this.player)
	    {
	      this.player.play();
	      this.playbackRateIndex = this.playbackSpeeds.indexOf(1);
	    }
	    else
	    {
	      console.log('PLAYER:  Playback ... play() >>>  No Player  !!!!' );
	    }
	  }

	  /**
	   * Pauses playback.
	   */
	  pause()
	  {
	    if(this.player)
	    {
	      this.player.pause();
	    }
	    else
	    {
	      console.log('PLAYER:  Playback ... pause() >>>  No Player  !!!!' );
	    }
	  }

	  /**
	   * Stop playback and free resources.
	   */
	  stop()
	  {
	    if(this.player)
	    {
	      // Fade out Audio
	      //
	      if(stopTimer == null)
	      {
	        clearInterval(startTimer);

	        stopTimer = setInterval(() =>
	        {

	          if ((this.player.getVolume() - 20) > 0)
	          {
	            console.log('PLAYER:  Playback ... stop() >>>  fade OUT audio' );

	            this.player.setVolume(this.player.getVolume() - 10);
	          }
	          else
	          {
	            this.player.setVolume(0);

	            clearInterval(stopTimer);
	            stopTimer = null;

	            console.log('PLAYER:  Playback ... stop() >>>  CALLED' );
	            this.player.stop();
	          }
	        }, 150);
	      }
	    }
	    else
	    {
	      console.log('PLAYER:  Playback ... stop() >>>  No Player  !!!!' );
	    }
	  }

	  /**
	   * Function to perform fast forward of the video content.
	   */
	  fastfwd() {}
	  /**
	   * Function to perform fast rewind of the video content.
	   */
	  fastrwd() {}

	  /**
	   * Function that returns player instance.
	   * @returns player instance.
	   */
	  getPlayer()
	  {
	    return this.player || this
	  }

	  /**
	   * Function to release the video player instance when not in use.
	   */
	  destroy()
	  {
	    if(this.player)
	    {
	      if (this.player.getCurrentState() !== this.playerStatesEnum.idle)
	      {
	        this.stop();
	      }
	      this.player.removeEventListener('playbackStateChanged',   this._playbackStateChanged);
	      this.player.removeEventListener('playbackCompleted',      this._mediaEndReached);
	      this.player.removeEventListener('playbackSpeedChanged',   this._mediaSpeedChanged);
	      this.player.removeEventListener('bitrateChanged',         this._bitrateChanged);
	      this.player.removeEventListener('playbackFailed',         this._mediaPlaybackFailed.bind(this));
	      this.player.removeEventListener('playbackProgressUpdate', this._mediaProgressUpdate.bind(this));
	      this.player.removeEventListener('playbackStarted',        this._mediaPlaybackStarted.bind(this));
	      this.player.removeEventListener('durationChanged',        this._mediaDurationChanged);

	      this.player.release();
	      this.player = null;
	    }//PLAYER
	  }
	}

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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

	let tmpCLR = 0xFFff00ff; //   #ff00FF

	class AppMediaPlayer extends lng.Component
	{
	    static _template( )
	    {
	      return  {
	        w: 800,
	        h: 400,
	        color: tmpCLR,
	     //   rect: true,

	        Player: {
	          visible: true,
	          type: AAMPVideoPlayer2,
	        }
	      }
	    };

	    _init()
	    {
	      this.player = this.tag('Player');
	    }

	    _getFocused()
	    {
	      return this;
	    }


	  $mediaPlackbackEnded()
	  {
	    console.log('PLAYER:  Finished  >> FIRED >> $mediaPlackbackEnded ');
	    console.log('PLAYER:  Finished  >> FIRED >> $mediaPlackbackEnded ');

	    console.log('########  FIRE >>>  closeMediaPlayer');
	    console.log('########  FIRE >>>  closeMediaPlayer');
	    console.log('########  FIRE >>>  closeMediaPlayer');
	    console.log('########  FIRE >>>  closeMediaPlayer');

	    this.fireAncestors('$closeMediaPlayer');
	  }

	  playVideo(content)
	  {
	    console.log("APP >>   playVideo() ... ENTER");

	    try
	    {
	      this.player.load({
	            title: content.title,
	         subtitle: content.clipTitle,
	            image: content.imageSrc,
	              url: content.video,
	        drmConfig: null,
	        startTime: content.startTime,
	          endTime: content.endTime,
	          content: content
	      });

	      this._setState('MediaPlayerState');
	    }
	    catch (error)
	    {
	      console.log('Playback Failed ' + error);
	    }
	  }

	  playVideoHD()
	  {
	    let content =
	    {
	      title: "Test B Title",
	      clipTitle: "Test B Clip Title",
	      imageSrc: null,
	      // video: 'http://127.0.0.1:50050/usbdrive/4K_VIDEO_TEST.mp4',
	      video: Utils.asset('videos/4K_VIDEO_TEST.mp4'),
	      // video: 'http://localhost:50050/VIDEO_TEST.mp4',
	      drmConfig: null,
	      startTime: 0,
	      endTime: 12.5
	    };

	    this.playVideo(content);
	  }

	  playVideo4K()
	  {
	    let content =
	    {
	      title: "Test B Title",
	      clipTitle: "Test B Clip Title",
	      imageSrc: null,
	      video: Utils.asset('videos/Tv - 31851.mp4'),
	      // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
	      // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
	      // video: 'https://vod-progressive.akamaized.net/exp=1604078994~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F2801%2F15%2F389009390%2F1642599867.mp4~hmac=1ecfde22e3d47f2381c4a4873c356d02af6f320949e62ac3f0ca27346d585331/vimeo-prod-skyfire-std-us/01/2801/15/389009390/1642599867.mp4',
	      drmConfig: null,
	      startTime: 0,
	      endTime: 12.5
	    };

	    this.playVideo(content);
	  }

	    static _states()
	    {
	      return [
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class PlayVideoA_State extends this  // AAMPVideoPlayer2
	        {
	          $enter()
	          {
	            console.log('PlayVideoA_State - ENTER ');

	            // Licenses:  https://pixabay.com/service/license/
	            //
	            // What is allowed?
	            //
	            // ✓	All content on Pixabay can be used for free for commercial and non-commercial
	            //    use across print and digital, except in the cases mentioned in "What is not allowed".
	            //
	            // ✓	Attribution is not required. Giving credit to the contributor or Pixabay
	            //    is not necessary but is always appreciated by our community.
	            //
	            // ✓	You can make modifications to content from Pixabay.
	            //
	            // Free from  https://pixabay.com/videos/tv-test-pattern-color-television-31851/
	            //            https://pixabay.com/videos/lights-rays-colorful-color-13306/
	            //
	            let content =
	            {
	              title: "Test A Title",
	              clipTitle: "Test A Clip Title",
	              imageSrc: null,
	              video: Utils.asset('videos/4K_VIDEO_TEST.mp4'),
	              // video: 'http://127.0.0.1:50050/usbdrive/4K_VIDEO_TEST.mp4',
	              // video: Utils.asset('videos/Lights - 13306.mp4'),
	              // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
	              // video: 'https://vod-progressive.akamaized.net/exp=1604079249~acl=%2A%2F892312262.mp4%2A~hmac=3e6f432a54d1fd2a273fe167a61bea0b8170fbb2ce214850085306cd44c64912/vimeo-prod-skyfire-std-us/01/4381/9/246909929/892312262.mp4',
	              // video: 'https://vod-progressive.akamaized.net/exp=1604079361~acl=%2A%2F448954956.mp4%2A~hmac=c403fc73fb9a58ce3a8619383c231e6a83c863b664d8cff1b8d5c8af66b00454/vimeo-prod-skyfire-std-us/01/4565/5/147827978/448954956.mp4', //https://pixabay.com/videos/bokeh-blur-fire-circle-1500/
	              drmConfig: null,
	              startTime: 0,
	              endTime: 18
	            };

	            this.playVideo(content);
	          }
	        }, // CLASS - PlayVideoA_State
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class PlayVideoB_State extends this
	        {
	          $enter()
	          {
	            console.log('PlayVideoB_State - ENTER ');

	            let content =
	            {
	              title: "Test B Title",
	              clipTitle: "Test B Clip Title",
	              imageSrc: null,
	              // video: Utils.asset('videos/Tv - 31851.mp4'),
	              video: 'http://localhost:50050/VIDEO_TEST.mp4',
	              drmConfig: null,
	              startTime: 0,
	              endTime: 12.5
	            };

	            this.playVideo(content);
	          }
	        }, // CLASS - PlayVideoB_State
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class MediaPlayerState extends this
	        {
	          $enter(event)
	          {
	            // console.log(">>>>>>>>>>>>   STATE:  MediaPlayerState - ENTER ... this.player: " + this.player);

	            if(this.player)
	            {
	             this.player.setSmooth('alpha',  1.0, {duration: 0.4 });
	            // this.mainGui.setSmooth('alpha', 0.0, {duration: 0.2 });
	            }
	          }

	          $exit()
	          {
	            // console.log(">>>>>>>>>>>>   STATE:  MediaPlayerState - EXIT");

	            if(this.player)
	            {
	              this.player.stop();

	             this.player.setSmooth('alpha',  0.0, {duration: 0.2 });
	            // this.mainGui.setSmooth('alpha', 1.0, {duration: 0.4 });
	            }
	          }

	          _getFocused()
	          {
	            return this.player
	          }

	          _handleKey(k)
	          {
	            switch(k.keyCode )
	            {
	              default:
	                console.log('MediaPlayerState >>> _handleKey() - default: ' +k.keyCode );
	                return false
	            }//SWITCH
	          }
	        }// CLASS - MediaPlayerState
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      ]
	     }//_states
	  }//CLASS

	let OrangeCLR$1 = 0xFFfebf00; //   #febf00

	class AppTvTuner extends lng.Component
	{
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  static _template( )
	  {
	    console.log('#########  ATSC >>>>   _template() - ENTER');

	    return  {
	      Tuner_bg:
	      {
	        w: SCREEN.w, h: SCREEN.h,
	        color: OrangeCLR$1,
	     //   rect: true,

	        Text:
	        {
	          mount: 0.5,
	          x: (SCREEN.precision * SCREEN.w)/2,
	          y: (SCREEN.precision * SCREEN.h)/2,
	          text: {
	            text: "Tuner",
	            fontSize: ( (SCREEN.precision < 1) ? 125 : 250),
	            textColor: 0xFF000000,
	            textAlign:  'center'
	          }
	        },

	        ProgressBar: {
	          type: Progress,
	          mount: 0.5,
	          x: (SCREEN.precision * SCREEN.w) * 0.50,
	          y: (SCREEN.precision * SCREEN.h) * 0.66,
	          w: (SCREEN.precision * SCREEN.w) * 0.33,
	          h: 80
	        },
	      }
	    }
	  };

	  _init()
	  {
	    console.log('#########  ATSC >>>>   _init() - ENTER');

	    this.tc = gDataModel.getThunder();

	    console.log('#########  ATSC >>>>   _init() - this.tc: ' + this.tc);

	    this.focusIndex  = 0;
	    this.navElements = 0;
	    this.bFullScreen = false;
	    this.isScanning  = false;
	    this.progressBar = this.tag("ProgressBar");

	    this.progressBar.setRadius(12);

	    this.en_spaInitConfig =
	    {
	      preferredAudioLanguage: "eng,spa"
	    };

	    this.spa_enInitConfig =
	    {
	      preferredAudioLanguage: "spa,eng"
	    };

	    //this.thunderUtils = new ThunderUtils();

	    this._setState('TuningState');
	  }

	  clearConsole()
	  {
	    console.log("#########  ATSC >>>  DEBUG: clearConsole() - ENTER");

	    //document.getElementById("console").value = "";
	  }

	  setGuideText(text)
	  {
	   // document.getElementById("guideText").value = text;
	   console.log('#########  ATSC >>>  DEBUG: setGuideText( '+text+' ) ');
	  }

	  setCurrentPlayingChText(text)
	  {
	    //document.getElementById("currChSelLabel").innerHTML = text;
	    console.log('#########  ATSC >>>  DEBUG: setCurrentPlayingChText( '+text+' ) ');
	  }

	  setChaCountLabel(text)
	  {
	    // document.getElementById("chcountLabel").innerHTML = text;
	    console.log('#########  ATSC >>>  DEBUG: setChaCountLabel( '+text+' ) ');
	  }

	  clearChannelMapList()
	  {
	    console.log('#########  ATSC >>>  DEBUG: clearChannelMapList() ');

	    // var chMapElement = document.getElementById("chMap");
	    // // when length is 0, the evaluation will return false.
	    // while (chMapElement.options.length)
	    // {
	    //   // continue to remove the first option until no options remain.
	    //   chMapElement.remove(0);
	    // }
	  }

	  // var tc;
	  // var listener;
	  // var listenerOnPlayerStatus;
	  // var totalChannels;
	  // var aampPlayer;
	  // var isPlaying;
	  // var serviceTable;
	  // var fromPC = false;

	  // var en_spaInitConfig =
	  // {
	  //   preferredAudioLanguage: "eng,spa"
	  // };

	  // var spa_enInitConfig =
	  // {
	  //   preferredAudioLanguage: "spa,eng"
	  // };

	  // Connect()
	  // {
	  //   const configSTB = {
	  //     host: '127.0.0.1', // ipAddr of device running Thunder

	  //     port: 9998,
	  //     default:1 // versioning
	  //   };

	  //   const configFromPC = {
	  //     host: '10.0.0.219', // ipAddr of device running Thunder

	  //     port: 9998,
	  //     default:1 // versioning
	  //   };

	  //   var config;
	  //   if(this.fromPC)
	  //   {
	  //     config = configFromPC; ;
	  //   }
	  //   else
	  //   {
	  //     config = configSTB;
	  //   }

	  //   console.log( "Thunder Configuration: " + JSON.stringify(config) );
	  //   this.tc = ThunderJS(config);
	  // }

	  // Activate( callsign )
	  // {
	  //   this.tc.call( "Controller","activate", {"callsign":callsign} ).then( result => {
	  //     console.log( callsign + " activated" );
	  //   }).catch(err => {
	  //     console.log( callsign + " activation error" );
	  //   });
	  // }


	  toggleScan()
	  {
	    if(this.isScanning)
	    {
	      this.isScanning = false;

	      this.abortScan();
	    }
	    else
	    {
	      this.isScanning = true;
	      this.progressBar.value = 0;

	      this.startScan();
	    }
	  }

	  startScan()
	  {
	    this.tc.call("org.rdk.MediaServices","startScan", { "type": "ATSC", "onlyFree": true} )
	    .then(result =>
	    {
	      this.isPlaying = false;
	      this.clearChannelMapList();
	      console.log('#########  ATSC >>>  startScan Success'+ JSON.stringify(result));
	    }).catch(err =>
	    {
	      console.log('#########  ATSC >>>  startScan Error' + err );
	    });
	  }

	  abortScan()
	  {
	    this.tc.call("org.rdk.MediaServices","abortScan", {} ).then(result => {
	    this.getAllServices();
	    console.log('#########  ATSC >>>  abortScan Success'+ JSON.stringify(result));

	    }).catch(err => {
	      console.log('#########  ATSC >>>  abortScan Error' + err );
	    });
	  }

	  registerOnPlayerStatus()
	  {
	//    this.listenerOnPlayerStatus = this.tc.on('org.rdk.MediaPlayer','onPlayerStatus',
	    this.listenerOnPlayerStatus = this.tc.registerEvent('org.rdk.MediaPlayer','onPlayerStatus',
	    (notification) =>
	    {
	      //var data = 'sts:' + notification.playerStatus + ' p:' + notification.position  + ' l:' + notification.length + ' loc:' + notification.locator + ' loff:' +  notification.liveOffset + ' spd:' + notification.speed ;

	      if(this.isPlaying)
	      {
	        console.log('#########  ATSC >>>  Received onPlayerStatus Event ' + JSON.stringify(notification));
	      }
	    });
	  }

	  registerOnScanProgress()
	  {
	    this.listener = this.tc.registerEvent("org.rdk.MediaServices",'onScanProgress',
	    (notification) =>
	    {
	      // console.log('#########  ATSC >>>  DEBUG:  Received onScanProgress Event ' + JSON.stringify(notification))

	      var value = notification.progress * 100;

	      this.progressBar.value = value;

	      // console.log('#########  ATSC >>>  ' + data);

	      if('COMPLETE' == notification.state)
	      {
	        // console.log("#########  ATSC >>>  tuning-- " + data);
	        this.getAllServices();
	      }

	      // console.log("#########  ATSC >>>  tuning notification.signalStrength: " + (typeof  notification.signalStrength) )

	      if('TUNING' == notification.state && notification.signalStrength != "0.000000")
	      {
	        var data = ' State:'    + notification.state +
	                   ' sInfo:'    + notification.displaySignalInfo +
	                   ' strength:' + notification.signalStrength +
	                   ' nTv:'      + notification.numTvServices +
	                   ' nRadio:'   + notification.numRadioServices +
	                   ' nData:'    + notification.numDataService;

	        console.log("#########  ATSC >>> ");
	        console.log("#########  ATSC >>>  FOUND >> " + data);
	        console.log("#########  ATSC >>> ");
	      }
	    });
	  }

	  registerOnScanAction()
	  {
	    //this.listener = this.tc.on("org.rdk.MediaServices",'onScanAction ',
	    this.listener = this.tc.registerEvent("org.rdk.MediaServices",'onScanAction ',
	    (notification) =>
	    {
	        console.log('#########  ATSC >>>  Received onScanAction Event ' + JSON.stringify(notification));
	    });
	  }

	  getService()
	  {
	    // this.tc.call("org.rdk.MediaServices","getService",{"servicePk":1, "attributes": [ "pk","name","signalStrength" ]})
	    this.tc.call("org.rdk.MediaServices","getService",{"servicePk":1, "attributes": [ "pk","name","signalStrength" ]})
	    .then(result =>
	    {
	      console.log('#########  ATSC >>>  getService Success '+ JSON.stringify(result));
	      //console.log('success:' + result.success)
	      //var value = result.signalStrength * 100
	      //var value = 0.27 * 100
	//    this.progressBar.value = value

	    }).catch(err =>
	    {
	      console.log('#########  ATSC >>>  getService Error '+ err);
	    });
	  }

	  ProcessServiceTable( result )
	  {
	    console.log('#########  ATSC >>>  DEBUG: ProcessServiceTable( ' + JSON.stringify(result) + ') ');

	    // this.serviceTable = result; //store for future use
	    // var chMapElement = document.getElementById("chMap");
	    // this.totalChannels = 0;
	    // for (var i in result.table)
	    // {
	    //   var strData = result.table[i].displayChannel + ' ' +
	    //     result.table[i].shortName +
	    //     ' str=' + result.table[i].signalStrength +
	    //     ' qual=' + result.table[i].signalQuality;
	    //     // +' ' + result.table[i].locator;

	    //   var opt = document.createElement('option');
	    //   opt.text = strData;
	    //   opt.value = result.table[i].locator;
	    //   if( i==0 )
	    //   {
	    //     opt.selected = true;
	    //   }
	    //   chMapElement.add(opt,null);
	    //   this.totalChannels = this.totalChannels +1;
	    //   console.log('channel:' + strData);
	    // }//FOR

	    // console.log('total channels found:' + this.totalChannels);
	    // setChaCountLabel( this.totalChannels );
	  }

	  getAllServices()
	  {
	    this.clearChannelMapList();

	    console.log('#########  ATSC >>>>   getAllServices() - ENTER' );

	    this.tc.call("org.rdk.MediaServices","getServices",{}).then(result =>
	    {
	      console.log('#########  ATSC >>>>   getServices() - OK   result: ' + JSON.stringify(result) );
	      this.ProcessServiceTable(result);
	    })
	    .catch(err =>
	    {
	      console.log('#########  ATSC >>>  getService Error '+ err);
	    });
	  }

	  getHiddenServices()
	  {
	    this.tc.call("org.rdk.MediaServices","getServices",
	    {
	      "listId": "clist:1",
	      "attributes": ["pk", "name", "channel"],
	      "aliases": ["pk", "n"],
	      "filter": {
	        "hidden": "HIDDEN",
	        "categories": ["TV", "RADIO", "DATA"]
	      }
	    })
	    .then(result =>
	    {
	      console.log('#########  ATSC >>>  getServices ... Success '+ JSON.stringify(result));
	    }).catch(err =>
	    {
	      console.log('#########  ATSC >>>  getServices ... Error '+ err);
	    });
	  }

	  //	Request : {"jsonrpc":"2.0", "id":3, "method":"org.rdk.MediaGuide.1.startScan", "params":{ "servicePk": [123] }
	  //Response: {"jsonrpc":"2.0", "id":3, "result": { "success": true } }
	  startGuideScan()
	  {
	    this.tc.call("org.rdk.MediaGuide","startScan", { "type": "ATSC", "onlyFree": true} )
	    .then(result =>
	    {
	      this.isPlaying = false;
	      console.log('#########  ATSC >>>  startScan Success'+ JSON.stringify(result));
	    }).catch(err =>
	    {
	      console.log('#########  ATSC >>>  startScan Error' + err );
	    });
	  }

	  abortGuideScan()
	  {
	    this.tc.call("org.rdk.MediaGuide","abortScan", {} )
	    .then(result =>
	    {
	      console.log('#########  ATSC >>>  abortScan Success'+ JSON.stringify(result));
	    }).catch(err =>
	    {
	      console.log('#########  ATSC >>>  abortScan Error' + err );
	    });
	  }

	  getAllGuideEvents()
	  { // todo: get guide data only for currently tuned program
	    this.tc.call("org.rdk.MediaGuide","getEvents",{})
	    .then(result =>
	    {
	      var guideEventsStr = JSON.stringify(result);
	      this.setGuideText(guideEventsStr);
	    }).catch(err =>
	    {
	      console.log('#########  ATSC >>>  getService Error '+ err);
	    });
	  }

	  // onChSelected() {}

	  fullscreen(enable)
	  {
	    //var videoWindowElement = document.getElementById("vidWindow");
	    if(enable)
	    {
	      this.SetRectangle(0.0,0.0,1.0,1.0);
	    }
	    else
	    {
	      this.SetRectangle(0.6,0.0,0.4,0.4);
	    }
	  }

	    update()
	    {
	      // var element = document.getElementById("myprogressBar");
	      // var width = 1;
	      // var identity = setInterval(scene, 10);

	      // scene()
	      // {
	      //   if (width >= 100) {
	      //     clearInterval(identity);
	      //   } else {
	      //     width++;
	      //     element.style.width = width + '%';
	      //     element.innerHTML = width * 1 + '%';
	      //   }
	      // }
	  }

	  SetRectangle( pctx, pcty, pctw, pcth )
	  {
	  //   var graphics_width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	  //   var graphics_height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
	  //   console.log("window width=" + graphics_width + ", height=" + graphics_height);

	    var x = 0 ;//Math.floor(pctx * graphics_width);
	    var y = 0 ;//Math.floor(pcty * graphics_height);
	    var w = 1920 ;//Math.floor(pctw * graphics_width);
	    var h = 1080 ;//Math.floor(pcth * graphics_height);

	    // var videoWindowElement = document.getElementById("vidWindow");
	    // videoWindowElement.style['height'] = h;
	    // videoWindowElement.style['width'] = w;
	    // videoWindowElement.style['top'] =  y;
	    // videoWindowElement.style['left'] = x;

	    console.log( "#########  ATSC >>>  holepunch: x=" + x + ",y=" + y + ",w="+ w + ",h=" + h);
	    //this.tc.call("org.rdk.MediaPlayer", "setVideoRectangle", {"id":"MainPlayer","x":x,"y":y,"w":w,"h":h,"meta":{"resWidth":graphics_width,"resHeight":graphics_height}} );

	    if( this.aampPlayer )
	    {
	      this.aampPlayer.setVideoRect(x,y,w,h);
	    }
	  }

	  initTuner() // HUGH
	  {
	    console.log('#########  ATSC >>>>   startTuner() - ENTER');

	    //window.resizeBy(1280,720);

	    this.totalChannels = 0;
	    this.isPlaying = false;

	    try
	    {
	      if( AAMPMediaPlayer )
	      {
	        this.fromPC = false;
	        console.log('#########  ATSC >>>>   startTuner() - STB');
	      }
	    }
	    catch( e )
	    {
	      console.log('#########  ATSC >>>>   startTuner() - PC');
	      this.fromPC = true;
	    }

	    // this.CollectButtons();
	    // this.Connect();
	    // this.Activate('org.rdk.MediaServices');
	    // this.Activate('org.rdk.MediaPlayer');
	    // this.Activate('org.rdk.MediaGuide');

	    this.registerOnScanProgress();
	    this.registerOnScanAction();
	    this.registerOnPlayerStatus();

	    console.log('#########  ATSC >>>>   getAllServices() - now !');
	    this.getAllServices();

	    //this.startScan()
	  }

	   // var focusIndex;
	   // var navElements;
	   // var bFullScreen = false;

	  Blur()
	  {
	   // this.navElements[this.focusIndex].blur();
	  }

	  Focus()
	  {
	   // this.navElements[this.focusIndex].focus();
	  }

	  // CollectButtons()
	  // {
	  //   this.navElements = document.querySelectorAll( "select,input" );//document.getElementsByTagName("select");
	  //   this.focusIndex = 0;
	  //   Focus();
	  // }


	  playerLoad(url)
	  {
	    this.tc.call("org.rdk.MediaPlayer","create",{"id":"main"});
	    this.tc.call("org.rdk.MediaPlayer","load",{"id":"main","url":url});
	  }

	  playChannel()
	  {
	    console.log('#########  ATSC >>>  DEBUG:  playChannel() ...');

	    // var chMapElement = document.getElementById("chMap");
	    // var strLocator = chMapElement.options[chMapElement.selectedIndex].value;
	    // var strData = chMapElement.options[chMapElement.selectedIndex].text;
	    // setCurrentPlayingChText(strData);

	    // //setGuideText(strData);
	    // if(this.fromPC)
	    // {
	    //   playerLoad(strLocator);
	    // }
	    // else
	    // {
	    //   if( this.aampPlayer )
	    //   {
	    //     this.aampPlayer.stop(); // needed for AMLOGIC-550 workaround?
	    //   }
	    //   else
	    //   {
	    //     this.aampPlayer = new AAMPMediaPlayer();
	    //     this.aampPlayer.addEventListener("playbackStateChanged", playbackStateChanged, null);;
	    //   }
	    //   this.aampPlayer.load(strLocator);
	    // }
	    // this.isPlaying = true;
	  }

	  toggleVistoggleVis(divId)
	  {
	    console.log('#########  ATSC >>>  DEBUG:  toggleVistoggleVis(' + divId + ') ...');

	    // var div = document.getElementById(divId);
	    // setGuideText('toggleVistoggleVis');

	    // if (div.style.display === "none")
	    // {
	    //   div.style.display = "block";
	    //     setGuideText('display_none:' + div.style.display);
	    // }
	    // else
	    // {
	    //   div.style.display = "none";
	    //   setGuideText('display:' + div.style.display);
	    // }
	  }

	  onChannelMapNav()
	  {
	    console.log('#########  ATSC >>>  DEBUG:  onChannelMapNav() ...');

	    // var chMapElement = document.getElementById("chMap");
	    // var selectedValue = chMapElement.options[chMapElement.selectedIndex].value;
	    // //console.log(selectedValue);
	  }

	  /**
	   * Sets the Audio Language
	   */
	  SetPreferredLanguages(languageListInitConfig)
	  {
	    console.log('#########  ATSC >>>  DEBUG:  SetPreferredLanguages(' + languageListInitConfig + ') ...');

	    /*
	    var chMapElement = document.getElementById("chMap");
	    var strLocator = chMapElement.options[chMapElement.selectedIndex].value;
	    var strData = chMapElement.options[chMapElement.selectedIndex].text;

	    setCurrentPlayingChText(strData);

	    if( this.aampPlayer )
	    {
	      // this is hack as setting pref lang is hangging . hence stoping and creating new with
	      // init config
	      this.aampPlayer.stop(); // needed for AMLOGIC-550 workaround?
	    }

	    this.aampPlayer = new AAMPMediaPlayer();
	    this.aampPlayer.initConfig(languageListInitConfig);
	    this.aampPlayer.addEventListener("playbackStateChanged", playbackStateChanged, null);;
	    this.aampPlayer.load(strLocator);

	    this.isPlaying = true;
	    */
	  }
	  /**
	   * Gets the current Audio Track
	   */
	  getAudioTrack()
	  {
	    console.log("#########  ATSC >>>  DEBUG: getAudioTrack() - ENTER");

	    var audioTrack = this.aampPlayer.getAudioTrack();
	    console.log("Invoked getAudioTrack " +audioTrack);
	    setGuideText("Invoked getAudioTrack " +audioTrack);
	  }

	  /*For browser testing without box*/
	  _getAvailableAudioTracks()
	  {
	    var _avlAudioTracks =  [{
	                "name": "16",
	                "language":     "eng",
	                "codec":        "AC3",
	                "rendition":    "NORMAL"
	        }, {
	                "name": "17",
	                "language":     "spa",
	                "codec":        "AC3",
	                "rendition":    "NORMAL"
	        }];
	    return _avlAudioTracks;
	  }

	  clearAudioList()
	  {
	    console.log("#########  ATSC >>>  DEBUG: clearAudioList() - ENTER");

	    // var audioListElement = document.getElementById("AudioList");
	    // // when length is 0, the evaluation will return false.
	    // while (audioListElement.options.length)
	    // {
	    //   // continue to remove the first option until no options remain.
	    //   audioListElement.remove(0);
	    // }
	  }

	  /**
	   * Get available audio track info
	   */
	  getAvailableAudioTracks()
	  {
	    console.log("#########  ATSC >>>  DEBUG: getAvailableAudioTracks() - ENTER");

	    // //var avlAudioTracks = _getAvailableAudioTracks();
	    // var audioListBox = document.getElementById("AudioList");

	    // var avlAudioTracks = this.aampPlayer.getAvailableAudioTracks();

	    // if(avlAudioTracks != undefined)
	    // {
	    //   var textTrackList = JSON.parse(avlAudioTracks);
	    //   console.log("Invoked getAvailableAudioTracks " +avlAudioTracks);

	    //   setGuideText("Invoked getAvailableAudioTracks " +avlAudioTracks);
	    //   clearAudioList();

	    //   for (var i in textTrackList) // map()
	    //   {
	    //     var strData = textTrackList[i].language;
	    //     var opt   = document.createElement('option');
	    //     opt.text  = strData + " " +textTrackList[i].codec;
	    //     opt.lang  = strData;
	    //     opt.value = i;
	    //     console.log("Invoked getAvailableAudioTracks loop: " +opt.text);

	    //     audioListBox.add(opt,null);
	    //   }//FOR
	    // }
	  }

	  /**
	   * Sets the Audio Language
	   */
	  setAudioLanguage()
	  {
	    console.log("#########  ATSC >>>  DEBUG: setAudioLanguage() - ENTER");

	    // var audioListElement = document.getElementById("AudioList");
	    // var language = audioListElement.options[audioListElement.selectedIndex].lang;
	    // console.log("Invoked setAudioLanguage with language " +language);

	    // this.aampPlayer.setAudioLanguage(language);
	  }

	  /**
	   * Sets audio track
	   */
	  setAudioTrack()
	  {
	    console.log("#########  ATSC >>>  DEBUG: setAudioTrack() - ENTER");

	    // var audioListElement = document.getElementById("AudioList");
	    // var track = audioListElement.options[audioListElement.selectedIndex].value;
	    // console.log("Invoked setAudioTrack with track " +track);
	    // this.aampPlayer.setAudioTrack(track);
	  }

	  playbackStateChanged(e)
	  {
	    let playerStatesEnum = { "idle":0, "initializing":1, "initialized":2, "preparing":3, "prepared":4, "playing":8, "paused":6, "seeking":7, "complete":11, "error":12 };

	    console.log("#########  ATSC >>>  Playback state changed event: " + JSON.stringify(e));
	    switch (e.state) {
	        case playerStatesEnum.idle:
	            playerState = playerStatesEnum.idle;
	            break;
	        case playerStatesEnum.initializing:
	            playerState = playerStatesEnum.initializing;
	            break;
	        case playerStatesEnum.initialized:
	            playerState = playerStatesEnum.initialized;
	            break;
	        case playerStatesEnum.preparing:
	            playerState = playerStatesEnum.preparing;
	            break;
	        case playerStatesEnum.prepared:
	            playerState = playerStatesEnum.prepared;
	            break;
	        case playerStatesEnum.playing:
	            playerState = playerStatesEnum.playing;
	            break;
	        case playerStatesEnum.complete:
	            playerState = playerStatesEnum.complete;
	            break;
	        case playerStatesEnum.error:
	            playerState = playerStatesEnum.error;
	            break;
	        default:
	            playerState = e.state;
	            console.log("State not expected");
	            break;
	        }
	        var evetStr = "Player state is: " + playerState;
	        console.log(evetStr);

	        this.setGuideText(evetStr);
	  }

	  static _states(){
	    return [
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class TuningState extends this
	          {
	            $enter()
	            {
	              console.log(">>>>>>>>>>>>   STATE:  TuningState - ENTER");
	            }

	            $exit()
	            {
	              console.log(">>>>>>>>>>>>   STATE:  TuningState - EXIT");
	            }


	  //ch down 34
	  // ch up 33
	  // vol down - 174, up - 175
	  //playpause - 179
	  //red - 69
	  //green - 8
	  // yellow - 77
	  // 0 - 48, 1 - 49 , 2 - 50 , 8 - 56 9 - 57
	  // red big record - 118
	  // search 114
	  // info 120
	  //? 113
	  //volume - 173

	            _handleKey(k)
	            {
	              console.log('TuningState >>> k.keyCode: ' + k.keyCode);

	              switch( keyCode )
	              {
	                case 65:
	                case 118: // big red record button
	                {
	                  if(this.bFullScreen)
	                  {
	                    this.bFullScreen = false;
	                  }
	                  else
	                  {
	                    this.bFullScreen = true;
	                  }
	                  // todo: replace with use of SetRectangle helper function
	                  this.fullscreen(this.bFullScreen);
	                }
	                break;
	                case 37: // left
	                // if( this.focusIndex>0 )
	                // {
	                //   Blur();
	                //   this.focusIndex--;
	                //   Focus();
	                // }
	                break;

	                case 39: // right
	                // if( this.focusIndex<this.navElements.length-1 )
	                // {
	                //   Blur();
	                //   this.focusIndex++;
	                //   Focus();
	                // }
	                break;

	                //down - 174, up - 175

	                case 40: // down
	                  break;

	                case 38: // up
	                  break;

	                //case 33: // ch up
	                case 175: // volume up
	                  //channelUp(true);
	                  break;

	                //case 34: // ch down
	                case 174: // volume down
	                  //channelDown(true);
	                  break;

	                case 13: // return
	                case 32: // space
	                if( this.focusIndex == 0 )
	                {
	                  this.playChannel(true);
	                }
	                break;
	                default:
	                  return false // propagate
	              }//SWITCH

	              let rpc = gDataModel.getKeymapRPC(k.keyCode);

	              console.log('TuningState >>> _handleKey: rpc:' + rpc);
	              if(rpc != true)
	              {
	                return true // handled
	              }

	              return true
	            }
	          }, // CLASS - TuningState
	    ]
	  }//_states

	}//CLASS

	/*
	<body bgcolor = "#FFFFCC" text = "#000000" topmargin="50" leftmargin="100">
		<div id="videoContainer">
			<video id="vidWindow" style="height:40%; width:40%; position:absolute; top:50; left:500">
				<source src="dummy.mp4" type="video/ave"> <!-- hole punching -->
			</video>
		</div>

		<div id="content">
			<select id = "chMap" size="28" onchange="onChannelMapNav();" onclick="playChannel();"></select>

			<input type="button" value="startScan" onclick="startScan();"/>
			<input type="button" value="abortScan" onclick="abortScan();"/>
			<input type="button" value="RefreshChannelMap" onclick="getAllServices();"/>
			<input type="button" value="getAllGuideEvents" onclick="getAllGuideEvents();"/>

			<input type="button" value="full" onclick="SetRectangle(0,0,1,1);"/>
			<input type="button" value="TR" onclick="SetRectangle(0.5,0,0.5,0.5);"/>
			<input type="button" value="TL" onclick="SetRectangle(0.0,0,0.5,0.5);"/>
			<input type="button" value="BL" onclick="SetRectangle(0.0,0.5,0.5,0.5);"/>
			<input type="button" value="BR" onclick="SetRectangle(0.5,0.5,0.5,0.5);"/>

			<br/>

			<input type="button" value="GetTrack" onclick="getAudioTrack();"/>
			<input type="button" value="GetAvlTracks" onclick="getAvailableAudioTracks();"/>
			<select id = "AudioList" size="3"></select>
			<input type="button" value="SetAudLan" onclick="setAudioLanguage();"/>
			<input type="button" value="SetAudTrack" onclick="setAudioTrack();"/>

			<!-- <input type="button" value="Preferred-Eng" onclick="SetPreferredLanguages(`eng`);"/> -->
			<input type="button" value="Preferred-Eng,Spa" onclick="SetPreferredLanguages(this.en_spaInitConfig);"/>
			<input type="button" value="Preferred-Spa,Eng" onclick="SetPreferredLanguages(this.spa_enInitConfig);"/>

			<br/>
			<!-- <input type="button" value="startGuideScan" onclick="startGuideScan();"</input>
			<input type="button" value="abortGuideScan" onclick="startGuideScan();"</input> -->

			<br/>
			<b>Total Channels:</b><label id="chcountLabel"></label>
			<b> Tuned:</b> <label id = "currChSelLabel"></label>
			<br/>
			<div id="myprogressBar">1%</div>
			<textarea rows="4" cols="120" id="console" style="border:solid 1px orange;"></textarea>
			<br/>
			<b>Guide Data</b>
			<br/>
			<textarea rows="4" cols="120" id="guideText" style="border:solid 1px orange;"></textarea>
			<br/>
			<b>Use red record key to toggle fullscreen mode</b>
		</div>
		</body>
	</html>
	*/

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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

	class AppF7screen extends lng.Component
	{
	  static _template( )
	  {
	    return  {
	      x: 200, y: 200,
	      w: 800,
	      h: 400,
	      color: COLOR_BG,
	      rect: true,
	    }
	  };

	  _init()
	  {
	    //this.tc = gDataModel.getThunder()

	    this._setState('ScanWifiState');
	  }

	  _getFocused()
	  {
	    return this;
	  }

	  onWIFIStateChanged(e)
	  {
	    console.log('DEBUG: onWIFIStateChanged() >>>> e: ' + JSON.stringify(e));

	  /*
	  {
	    "jsonrpc":"2.0",
	    "method":"org.rdk.Wifi.1.onWIFIStateChanged",
	    "params": {
	      "state": 0,
	      "isLNF" : false
	    }
	  }
	  */
	  }

	  onError(e)
	  {
	    console.log('DEBUG: onError() >>>> e: ' + JSON.stringify(e));

	  /*
	  {
	    "jsonrpc":"2.0",
	    "method":"org.rdk.Wifi.1.onError",
	    "params": { "code": 2 }
	  }
	  */
	  }

	  onWifiSignalThresholdChanged(e)
	  {
	    console.log('DEBUG: onWifiSignalThresholdChanged() >>>> e: ' + JSON.stringify(e));

	  /*

	  {
	    "jsonrpc":"2.0",
	    "method":"org.rdk.Wifi.1.onWifiSignalThresholdChanged",
	    "params": {"signalStrength": -35, "strength": "Excellent"}
	  }
	  */
	  }

	  onAvailableSSIDs(e)
	  {
	    console.log('DEBUG: onAvailableSSIDs() >>>> e: ' + JSON.stringify(e));

	  /*
	  {
	    "jsonrpc":"2.0",
	    "method":"org.rdk.Wifi.1.onAvailableSSIDs",
	    "params": { "ssids": [
	      {
	        "ssid": "123412341234",
	        "security": 2,
	        "signalStrength": -33,
	        "frequency": 5.0
	      },
	      {
	        "ssid": "456745674567",
	        "security": 2,
	        "signalStrength": -33,
	        "frequency": 5.0
	      }
	    ],
	    "moreData": true
	  }
	  }
	  */
	  }

	  registerEvents()
	  {
	    console.log('DEBUG: registerEvents() - ENTER ');

	    gDataModel.registerEvent('org.rdk.FactoryComms', 'onWIFIStateChanged', this.onWIFIStateChanged );
	    gDataModel.registerEvent('org.rdk.FactoryComms', 'onError', this.onError );
	    gDataModel.registerEvent('org.rdk.FactoryComms', 'onWifiSignalThresholdChanged', this.onWifiSignalThresholdChanged );
	    gDataModel.registerEvent('org.rdk.FactoryComms', 'onAvailableSSIDs', this.onAvailableSSIDs );
	  }

	  startScan()
	  {
	    console.log('DEBUG: startScan() - ENTER ');

	    this.registerEvents();
	/*
	Request: {"jsonrpc":"2.0", "id":3, "method":"org.rdk.Wifi.1.startScan", "params":{"incremental":false,"ssid":"","frequency":""}}'

	Response: {"jsonrpc":"2.0", "id":3, "result":{"success":true}}
	*/

	    let pp = { "incremental": false,
	                      "ssid":"",
	                      "frequency":""};

	    gDataModel.callThunderNoCatch(   // CALL THUNDER
	      { plugin: "org.rdk.Wifi",
	        method: "startScan",
	        params: pp } );
	  }

	  stopScan()
	  {
	    console.log('DEBUG: stopScan() - ENTER ');

	/*
	Request: {"jsonrpc":"2.0", "id":3, "method":"org.rdk.Wifi.1.stopScan", "params":{}}

	Response: {"jsonrpc":"2.0", "id":3, "result":{"success":true}}
	*/

	    gDataModel.callThunderNoCatch(   // CALL RDKSHELL
	    { plugin: "org.rdk.Wifi",
	    method: "stopScan",
	    params: {}  } );
	  }

	  static _states()
	  {
	    return [
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      class ScanWifiState extends this
	      {
	        $enter()
	        {
	          console.log('ScanWifiState - ENTER ');
	          this.startScan();
	        }
	      }, // CLASS - ScanWifiState
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      class FooState extends this
	      {
	        $enter(event)
	        {

	        }

	        $exit()
	        {
	          // console.log(">>>>>>>>>>>>   STATE:  FooState - EXIT");

	          //  this.player.setSmooth('alpha',  0.0, {duration: 0.2 });
	          //  this.mainGui.setSmooth('alpha', 1.0, {duration: 0.4 });
	        }

	        _getFocused()
	        {
	          return this
	        }

	        _handleKey(k)
	        {
	          switch(k.keyCode )
	          {
	            default:
	              console.log('FooState >>> _handleKey() - default: ' +k.keyCode );
	              return false
	          }//SWITCH
	        }
	      }// CLASS - FooState
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	    ]
	    }//_states
	}//CLASS

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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
	let GrayCLR2  = 0xFF888888; //   #888888
	let GrayCLR1  = 0xFF444444; //   #444444

	class InfoToast extends lng.Component
	{
	    static _template( )
	    {
	      let hh = SCREEN.h * 0.28;
	      let ww = hh*2;

	      return  {

	        Toast_shdw:
	        {
	          alpha: 0,

	          x: 10,
	          y: 10,
	          w: ww,
	          h: hh,
	          color: GrayCLR2,
	          rect: true,

	          Toast_bg:
	          {
	            x: -5,
	            y: -5,
	            w: ww,
	            h: hh,
	            color: GrayCLR1,
	            rect: true,

	            MsgText:
	            {
	              mount: 0.5,
	              x: (SCREEN.precision * ww)/2,
	              y: (SCREEN.precision * hh)/2 + (SCREEN.precision * 30),
	              text: {
	                text: "M",
	                fontSize: ( (SCREEN.precision < 1) ? 70 : 140),
	                textColor: 0xFFffffff, // #ffffff
	                textAlign:  'center',
	                ...shdw
	              }
	            }
	          }
	        }
	      }
	    };

	    _init()
	    {
	      this.toastTimeout = null;

	      var ff = SCREEN.h * 0.28;
	      var ww = this.w || ff*2;
	      var hh = this.h || ff;

	      if(this.w != undefined)
	      {
	        this.patch({
	            Toast_shdw: { w: ww, h: hh,
	              Toast_bg: { w: ww, h: hh,

	                MsgText:
	                {
	                  x: (SCREEN.precision * ww)/2,
	                  y: (SCREEN.precision * hh)/2 + (SCREEN.precision * 10),
	                }
	            }
	          }
	        });
	      }
	    }

	    showToast(params)
	    {
	      if(params == null)
	      {
	        console.log('ERROR:  showToast() - BAD Args !');
	        return
	      }

	      if(this.toastTimeout)
	      {
	        clearTimeout(this.toastTimeout);
	        this.toastTimeout = null;
	      }

	      var ff = SCREEN.h * 0.28;

	      var timeout_ms = params.timeout_ms || 1000;
	      var pts        = params.pts        || ( (SCREEN.precision < 1) ? 70 : 140);
	      var text       = params.text       || '(empty)';
	      var xx         = params.x          || 0;
	      var yy         = params.y          || 0;
	      var mount      = params.mount      || 0;
	      var ww         = params.w          || ff*2;
	      var hh         = params.h          || ff;

	      this.setFontSize(pts);
	      this.setMount(mount);
	      this.setText( text );
	      this.setX( xx );
	      this.setY( yy );
	      this.setW( ww );
	      this.setH( hh );

	      let toast = this.tag('Toast_shdw');
	      toast.setSmooth('alpha', 1.0, {duration: 0.4 });

	      if(timeout_ms > 0)
	      {
	        this.toastTimeout = setTimeout( () =>
	        {
	          toast.setSmooth('alpha', 0.0, {duration: 0.4 });
	        }, timeout_ms);
	      }
	    }

	    setFontSize(pts)
	    {
	      this.patch({
	        Toast_shdw: { Toast_bg:  {  MsgText:
	            { text:
	              { fontSize: pts }
	            }
	          }
	        }
	      } );
	    }

	    setText(txt)
	    {
	      this.patch({
	        Toast_shdw: { Toast_bg:  {  MsgText:
	            { text:
	              { text: txt }
	            }
	          }
	        }
	      } );
	    }

	    setMount(mm)
	    {
	      this.patch({ Toast_shdw: { mount: mm }   } );
	    }

	    setX(xx)
	    {
	      this.patch({ Toast_shdw: { x: xx }   } );
	    }

	    setY(yy)
	    {
	      this.patch({ Toast_shdw: { y: yy }   } );
	    }

	    setW(ww)
	    {
	      this.patch({ Toast_shdw: { w: ww, Toast_bg: { w: ww } }  } );

	      this.patch({
	          Toast_shdw: { w: ww,
	            Toast_bg: { w: ww,

	              MsgText:
	              {
	                x: (SCREEN.precision * ww)/2,
	              }
	          }
	        }
	      });
	    }

	    setH(hh)
	    {
	      this.patch({ Toast_shdw: { h: hh, Toast_bg: { h: hh } }  } );

	      this.patch({
	          Toast_shdw: { h: hh,
	            Toast_bg: { h: hh,

	              MsgText:
	              {
	              y: (SCREEN.precision * hh)/2 + (SCREEN.precision * 10),
	              }
	          }
	        }
	      });
	    }

	    _getFocused()
	    {
	      return this;
	    }

	    static _states()
	    {
	      return [
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        // class ActiveState extends this
	        // {
	        //   $enter()
	        //   {
	        //      // console.log(">>>>>>>>>>>>   STATE:  ActiveState");

	        //     this.tag('Toast_bg').setSmooth('color', GrayCLR1, { duration: 0.5 });
	        //   }
	        // }, //CLASS
	        // // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        // class InctiveState extends this
	        // {
	        //   $enter()
	        //   {
	        //      // console.log(">>>>>>>>>>>>   STATE:  InctiveState");

	        //     this.tag('Toast_bg').setSmooth('color', GrayCLR1, { duration: 0.5 });
	        //   }
	        //  }, //CLASS
	         // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      ]
	     }//_states
	  }//CLASS

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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


	let COLORS =
	[
	  0xFFff0000, // #ff0000 // RED     // 0
	  0xFF00ff00, // #00ff00 // GREEN   // 1
	  0xFF0000ff, // #0000ff // BLUE    // 2
	  0xFFffffff, // #ffffff // WHITE   // 3
	  0xFF000000, // #000000 // BLACK   // 4
	  0x00000000  // ------- // CIRCLES // 5
	];

	class TestPattern extends lng.Component
	{
	    static _template( )
	    {
	      var  clr = COLORS[0];

	      let circlesURL = (SCREEN.precision < 1) ?
	            // Utils.asset('images/64-GRAY-9-HD.png') :  //  HD:  1366 × 768
	              Utils.asset('images/64-GRAY-9-FHD.png') :  // FHD:  1920 × 1080
	              Utils.asset('images/64-GRAY-9-UHD.png');    // UHD:  3840 × 2160

	      // console.log('### circlesFHD: ' + circlesURL)
	      return {
	            TestImage: {
	              src: circlesURL, w: SCREEN.w, h: SCREEN.h
	            },
	            TestCard:  {
	              w: SCREEN.w, h: SCREEN.h, rect: true, color: clr
	            }
	        }
	    };


	    _init()
	    {
	      this.index_ = 0;
	      this._setState('CycleColorsState');
	    }

	    _getFocused()
	    {
	      return this;
	    }

	    setValue(v)
	    {
	       /* 0-OFF, 2-RED, 3-GREEN, 4-BLUE, 5-BLACK 6-Press card */

	      if(v == 0) // OFF
	      {
	        this.index_ = 0;

	        this.tag("TestCard").visible = false;
	        this.tag("TestCard").color   = COLORS[this.index_];
	      }
	      else if( (v - 1) < COLORS.length)
	      {
	        this.index_ = (v - 1);

	        this.tag("TestCard").visible = true;
	        this.tag("TestCard").color   = COLORS[this.index_];
	      }
	    }

	    static _states()
	    {
	      return [
	        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	        class CycleColorsState extends this
	        {
	          $enter()
	          {
	            //  console.log(">>>>>>>>>>>>   STATE:  CycleColorsState");
	          }

	          exitTestPattern()
	          {
	            this.index_ = 0; // RESET

	            // Update
	            this.tag("TestCard").visible = true;
	            this.tag("TestCard").color   = COLORS[this.index_];

	            this.fireAncestors('$fireCOMMAND',
	            {  "obj": this,
	                "cb": "HideTestPattern" } );
	          }

	          prevScreen()
	          {
	            if(--this.index_ < 0) this.index_ = 0;

	            this.tag("TestCard").color = COLORS[this.index_];
	          }

	          nextScreen()
	          {
	            let last_index = COLORS.length - 1;

	            if(++this.index_ > last_index)
	            {
	              this.exitTestPattern();
	              return
	            }

	            // Update
	            this.tag("TestCard").visible = (this.index_ != last_index);
	            this.tag("TestCard").color   = COLORS[this.index_];
	          }

	          _handleLeft() // LEFT
	          {
	            this.prevScreen();
	          }

	          _handleRight() // RIGHT
	          {
	            this.nextScreen();
	          }

	          _handleKey(k)
	          {
	            switch(k.keyCode)
	            {
	              case  8: // 'LAST' key on remote
	              // case 27: // ESC key on keyboard
	              case 73: // '...' Menu key on PlatCo remote

	                this.exitTestPattern();
	                return true // handled

	              case 0x42: // 'SCREEN' key on remote

	                this.nextScreen();
	                return true // handled

	              default:
	                console.log('CycleColorsState >>> _handleKey() - default: ' + k.keyCode );
	                break;
	              }//SWITCH

	              return false // propagate
	          }
	       }, //CLASS
	      ]
	     }//_states
	  }//CLASS

	/*
	 * If not stated otherwise in this file or this component's LICENSE file the
	 * following copyright and licenses apply:
	 *
	 * Copyright 2020 RDK Management
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

	// http://www.herethere.net/~samson/php/color_gradient/?cbegin=000000&cend=FFFFFF&steps=10

	let COLORS$1 =
	[
	  0xFF000000, // #000000    //   0% BLACK
	  0xFF191919, // #191919    //  10% Gray
	  0xFF333333, // #333333    //  20% Gray
	  0xFF4c4c4c, // #4c4c4c    //  30% Gray
	  0xFF666666, // #666666    //  40% Gray
	  0xFF7f7f7f, // #7f7f7f    //  50% Gray
	  0xFF999999, // #999999    //  60% Gray
	  0xFFb2b2b2, // #b2b2b2    //  70% Gray
	  0xFFcccccc, // #cccccc    //  80% Gray
	  0xFFe5e5e5, // #e5e5e5    //  90% Gray
	  0xFFffffff, // #ffffff    // 100% WHITE

	  0xFFff0000, // #ff0000    // RED
	  0xFF00ff00, // #00ff00    // GREEN
	  0xFF0000ff, // #0000ff    // BLUE
	];

	class InlayPattern extends lng.Component
	{
	    static _template( )
	    {
	      var  clr = COLORS$1[0];

	      return {
	            TestCard: { w: SCREEN.w, h: SCREEN.h, rect: true, color: clr },
	        }
	    };

	    _init()
	    {
	      this.index_ = 0;
	      this._setState('InlayCycleState');
	    }

	    _getFocused()
	    {
	      return this;
	    }

	    static _states()
	    {
	      return [
	       // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	       class InlayCycleState extends this
	       {
	         $enter()
	         {
	          //  console.log(">>>>>>>>>>>>   STATE:  InlayCycleState");
	         }


	         exitTestPattern()
	         {
	           this.index_ = 0; // RESET

	           // Update
	           this.tag("TestCard").color   = COLORS$1[this.index_];

	           this.fireAncestors('$fireCOMMAND',
	           {  "obj": this,
	               "cb": "HideInlayPattern" } );
	         }

	         prevScreen()
	         {
	           if(--this.index_ < 0) this.index_ = 0;

	           this.tag("TestCard").color = COLORS$1[this.index_];
	         }

	         nextScreen()
	         {
	           if(++this.index_ > COLORS$1.length - 1)
	           {
	              this.exitTestPattern();
	              return;
	           }

	           this.tag("TestCard").color = COLORS$1[this.index_];
	         }

	         _handleLeft() // LEFT
	         {
	           this.prevScreen();
	         }

	         _handleRight() // RIGHT
	         {
	           this.nextScreen();
	         }

	         _handleKey(k)
	         {
	           switch(k.keyCode)
	           {
	            case  8: // 'LAST' key on remote
	            // case 27: // ESC key on keyboard
	            case 73: // '...' Menu key on PlatCo remote

	              this.exitTestPattern();
	              return true // handled

	             default:
	               console.log('InlayCycleState >>> _handleKey() - default: ' + k.keyCode );
	               break;
	           }

	           return false // propagate
	         }
	       }, //CLASS
	      ]
	     }//_states
	  }//CLASS

	class App extends Lightning.Component
	{
	  static getFonts() {
	    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
	  }

	  static _template() {

	    return {

	      GuiContainer: {
	        alpha: 0.0,
	        type: AppMainScreen
	      },

	      MScreen: {
	        alpha: 0.0,
	        type: AppMScreen,
	      },

	      TestContainer:
	      {
	        alpha: 0.0,
	        type: TestPattern
	      },

	      InlayContainer:
	      {
	        alpha: 0.0,
	        type: InlayPattern
	      },

	      Tuner: {
	        visible: false,
	        type: AppTvTuner,
	      },

	      Player: {
	        visible: false,
	        type: AppMediaPlayer,
	      },

	      WifiBT: {
	        visible: false,
	        type: AppF7screen,
	      },

	      MacAddressInfo:
	      {
	        alpha: 0.0,

	        Background:  {
	          w: SCREEN.w, h: SCREEN.h, rect: true, color: 0xFF000000
	        },

	        Lines:
	        {
	          x: 20,
	          y: 10,

	          LabelMac:
	          {
	            y: ( (SCREEN.precision < 1) ? 40 : 70) *  0,
	            text: {
	              text: "MAC Addr.",
	              fontSize: ( (SCREEN.precision < 1) ? 20 : 40),
	              textColor: 0xFFffffff,
	            // ...shdw
	            }
	          },
	          ValueMac:
	          {
	            x: ( (SCREEN.precision < 1) ? 150 : 370) * 1,
	            y: ( (SCREEN.precision < 1) ?  40 : 70) *  0,
	            text: {
	              text: "- - - - - - -",
	              fontSize: ( (SCREEN.precision < 1) ? 20 : 40),
	              textColor: 0xFFffffff,
	            // ...shdw
	            }
	          },
	          LabelIP:
	          {
	            y: ( (SCREEN.precision < 1) ? 40 : 70) *  1,
	            text: {
	              text: "IP",
	              fontSize: ( (SCREEN.precision < 1) ? 20 : 40),
	              textColor: 0xFFffffff,
	            // ...shdw
	            }
	          },
	          ValueIP:
	          {
	            x: ( (SCREEN.precision < 1) ? 150 : 370) * 1,
	            y: ( (SCREEN.precision < 1) ?  40 : 70) *  1,
	            text: {
	              text: "0.0.0.0",
	              fontSize: ( (SCREEN.precision < 1) ? 20 : 40),
	              textColor: 0xFFffffff,
	            // ...shdw
	            }
	          },
	          LabelBT:
	          {
	            y: ( (SCREEN.precision < 1) ? 40 : 70) *  2,
	            text: {
	              text: "Bluetooth MAC",
	              fontSize: ( (SCREEN.precision < 1) ? 20 : 40),
	              textColor: 0xFFffffff,
	            // ...shdw
	            }
	          },
	          ValueBT:
	          {
	            x: ( (SCREEN.precision < 1) ? 150 : 370) * 1,
	            y: ( (SCREEN.precision < 1) ?  40 : 70) *  2,
	            text: {
	              text: "- - - - - - -",
	              fontSize: ( (SCREEN.precision < 1) ? 20 : 40),
	              textColor: 0xFFffffff,
	            // ...shdw
	            }
	          },
	        }
	      },

	      InfoDialog:
	      {
	        type: InfoToast,
	        w: 800,
	        h: 300
	      },

	      ErrorMsg:
	      {
	        alpha: 0.0,
	        mount: 0.5,
	        x: (SCREEN.precision * SCREEN.w)/2,
	        y: (SCREEN.precision * SCREEN.h)/2,
	        text: {
	          text: "ERROR:  message goes here ...  ",
	          fontSize: ( (SCREEN.precision < 1) ? 40 : 80),
	          textColor: 0xFFff0000,
	          textAlign:  'center',
	         // ...shdw
	        },
	      },
	    }
	  }

	  _init()
	  {
	    SCREEN.precision = this.stage.getOption('precision');

	    this.toastTimeout = null;
	    this.lastState    = null;
	    this.mScreen      = this.tag('MScreen');
	    this.mainGui      = this.tag('GuiContainer');
	    this.WifiBT       = this.tag('WifiBT');

	    this._setState('ReadJsonState');

	    this.lastState = this._getState();

	    this.tuner = this.tag('Tuner');

	    if(this.tuner != undefined)
	    ;
	  }

	  $onScanWifiBT()
	  {
	    console.log('########  GOT >>>  onScanWifiBT');
	    this._setState('F7screenState');
	  }

	  $onPlayDefaultVideo()
	  {
	    this._setState('PlayVideoState');
	  }

	  $closeMediaPlayer()
	  {
	    console.log('########  GOT >>>  closeMediaPlayer');
	    console.log('########  GOT >>>  closeMediaPlayer');
	    console.log('########  GOT >>>  closeMediaPlayer');
	    console.log('########  GOT >>>  closeMediaPlayer');

	    this._setState('MainGuiState');
	  }

	  $onShowToast(params = null)
	  {
	    if(params == null)
	    {
	      console.log('ERROR:  onShowToast() - BAD Args !');
	      return
	    }

	    let toast = this.tag('InfoDialog');
	    toast.showToast(params);
	  }

	  onSerialCMD(params)
	  {
	    console.log(' ##########  onSerialCMD() - params:  ' + JSON.stringify(params) );

	    try
	    {
	      let ans = JSON.parse(params);

	      if(ans != undefined && ans != null)
	      {
	        let rpcPath = gDataModel.getSerialRPC(ans.params.payload);

	        if( (rpcPath != undefined && rpcPath != null) &&
	            (ans.params.data != undefined &&
	             ans.params.data != null) )
	        {
	          console.log(' ##########  onSerialCMD >>> setting ... ');
	          gDataModel.setValue(rpcPath, ans.params.data);
	        }
	        else
	        {
	          console.log('ERROR: onSerialCMD() >>> Bad Args !  ans.params.data: ' + ans.params.data );
	        }
	      }
	      else
	      {
	        console.log('ERROR: onSerialCMD() >>> Bad Args !  params: ' + JSON.stringify(params) );
	      }

	    }
	    catch(e)
	    {
	      console.log('ERROR: onSerialCMD() >>> EXCEPTION => ' + e);
	    }
	  }

	  // NB:  Activate ALL the needed plugins !
	  //         >>>  Presume Nothing <<<
	  //
	  activatePlugins(plugins)
	  {
	    return new Promise( (resolve, reject)  =>
	    {
	      if(gDataModel == null || gDataModel == undefined)
	      {
	        console.log('FATAL:  activatePlugins() -  "gDataModel" is NULL ...');
	        reject();
	      }

	      if(plugins == undefined || plugins == null)
	      {
	        console.log('FATAL:  "plugins" is null / undefined ... unable to Activate');
	        reject();
	      }

	      plugins = plugins.filter( o => o != 'TODO_Plugin');

	      var allReady = plugins.map(o => gDataModel.activatePlugin(   // CALL THUNDER
	                                            { callsign: o } ));

	      Promise.all( allReady ).then( (allResolve, allReject)  =>
	      {
	        console.log('INFO: >>>>>>  ACTIVATING ... ');

	        plugins.map( o => console.log(' ** ACTIVATE >>>  ' + o) );

	        this.frontAndFocus(); // Set APP in front

	        resolve();
	      })
	      .catch(e =>
	      {
	        console.log('EXCEPTION: >>>>>>  ACTIVATE >>  Promise.all <<< FAILED   e: ' + e);
	      });

	    }); // PROMISE
	  }

	  frontAndFocus()
	  {
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      //  Register Events
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	      gDataModel.registerEvent('org.rdk.FactoryComms', 'onCommandEvent', this.onSerialCMD );
	      // gDataModel.registerEvent('MyPackage', 'onMyEvent',   this.onMyEvent )     // JUNK
	      // gDataModel.registerEvent('MyPackage', 'onWB_R_Gain', this.onWB_R_Gain )   // JUNK


	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      //  RDKShell >>> Set FOCUS
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      let setFOCUS = {
	        "client": "FactoryApp"
	      };

	      gDataModel.callThunderNoCatch(   // CALL RDKSHELL
	        { plugin: "org.rdk.RDKShell",
	          method: "setFocus",
	          params: setFOCUS } )
	      .then(o =>
	      {
	        console.log('DEBUG:  RDKShell >>> Set FOCUS ... o: ' + JSON.stringify(o) );
	      })
	      .catch(e =>
	      {
	        console.log('ERROR:  RDKShell >>> Set FOCUS ... o: ' + JSON.stringify(e) );
	      });
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      //  RDKShell >>> Move to FRONT
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	      let moveFRONT = {
	        "client": "FactoryApp"
	      };

	      gDataModel.callThunderNoCatch(   // CALL RDKSHELL
	        { plugin: "org.rdk.RDKShell",
	          method: "moveToFront",
	          params: moveFRONT } )
	      .then(o =>
	      {
	        console.log('DEBUG:  RDKShell >>> Move to FRONT ... o: ' + JSON.stringify(o) );
	      })
	      .catch(e =>
	      {
	        console.log('ERROR:  RDKShell >>> Move to FRONT ... o: ' + JSON.stringify(e) );
	      });
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      //  RDKShell >>> Grab to CTRL - M (MENU)
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	      let fakeMenuKey = {
	         "client": "FactoryApp", "keyCode":77, "modifiers":["ctrl"]
	      };

	      gDataModel.callThunderNoCatch(   // CALL RDKSHELL
	        { plugin: "org.rdk.RDKShell",
	          method: "addKeyIntercept",
	          params: fakeMenuKey } )
	      .then(o =>
	      {
	        console.log('DEBUG:  RDKShell >>> Grab to CTRL - M (MENU) (77 + "ctrl") ... o: ' + JSON.stringify(o) );
	      })
	      .catch(e =>
	      {
	        console.log('ERROR:  RDKShell >>> Grab to CTRL - M (MENU) (77 + "ctrl") ... o: ' + JSON.stringify(e) );
	      });
	      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  }

	  $fireValueSET(o)
	  {
	    if(o)
	    {
	      let   rpc = o["rpc"];
	      let value = o["value"];

	      if(value && rpc && rpc.rpcNode)
	      {
	        console.log( " #####  >> fireValueSET()  ... rpcNode: " + rpc.rpcNode);

	        DataModel.dataValueSET(rpc.rpcNode, value);
	      }
	      else
	      {
	        console.log( " #####  >> fireValueSET() ... rpc.rpcNode = NULL <<< ERROR " );
	      }
	    }
	    else
	    {
	      console.log('fireValueSET - FAILED ');
	    }
	  }

	  $fireCOMMAND(item)
	  {
	    let cmd = item["cb"];

	    switch(cmd)
	    {
	      case "HideAddressInfo":   this._setState(this.lastState);       break;
	      case "ShowAddressInfo":   this.lastState = this._getState();
	                                this._setState('MacAddressInfoState'); break;

	      case "HideTestPattern":   this._setState(this.lastState);      break;
	      case "ShowTestPattern":   this.lastState = this._getState();
	                                this._setState('TestPatternState');  break;

	      case "HideInlayPattern":  this._setState(this.lastState);      break;
	      case "ShowInlayPattern":  this.lastState = this._getState();
	                                this._setState('InlayPatternState'); break;

	      case "PlayVideoA":        this._setState('PlayVideoA_State');  break;
	      case "PlayVideoB":        this._setState('PlayVideoB_State');  break;

	      default:
	        console.log('ERROR:  fireCOMMAND() ... unknown cmd: ' + cmd);
	    }//SWITCH
	  }

	  static _states(){
	    return [

	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class ReadJsonState extends this
	          {
	            $enter()
	            {
	              this.mScreen.alpha = 0.0;
	              this.mainGui.alpha = 0.0;

	              this.loadData();
	            } // enter()

	            loadData()
	            {
	              const URL_PARAMS = new window.URLSearchParams(window.location.search);

	              var        cfg = URL_PARAMS.get('cfg');
	              this.keysURL   = '';
	              this.serialURL = '';
	              this.dataURL   = '';
	              this.menuURL   = '';

	              if(cfg != undefined)
	              {
	                this.keysURL   = Utils.asset('3rdParty/' + cfg + '/' + cfg+ 'Keys.json');
	                this.serialURL = Utils.asset('3rdParty/' + cfg + '/' + cfg+ 'Serial.json');
	                this.dataURL   = Utils.asset('3rdParty/' + cfg + '/' + cfg+ 'Data.json');
	                this.menuURL   = Utils.asset('3rdParty/' + cfg + '/' + cfg+ 'Menu.json');
	              }
	              else
	              {
	                console.log('ERROR: Bad >>> cfg: ' + cfg  );
	                return
	              }

	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              // JSON:  Keys
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              DataModel.fetchJSON(this.keysURL).then( keysMap =>
	              {
	                gDataModel.setKeycodeMap(keysMap.keys);
	                console.log('GOT KEYS ... GOT KEYS ... GOT KEYS ... ');
	              })
	              .catch( () =>
	              {
	                console.log('REJECT KEYS ... REJECT KEYS ... REJECT KEYS ... ');
	                console.log('REJECT KEYS ... REJECT KEYS ... REJECT KEYS ... ');
	                console.log('REJECT KEYS ... REJECT KEYS ... REJECT KEYS ... ');

	                let msg = this.tag("ErrorMsg");
	                msg.text = "ERROR: Unable to find ... \n \n" + keysURL;
	                msg.setSmooth('alpha',  1.0, {duration: 0.4 });
	              });

	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              // JSON:  Serial
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              DataModel.fetchJSON(this.serialURL).then( serialMap =>
	              {
	                gDataModel.setSerialMap(serialMap.cmds);
	                console.log('GOT SERIAL ... GOT SERIAL ... GOT SERIAL ... ');
	              })
	              .catch( () =>
	              {
	                console.log('REJECT SERIAL ... REJECT SERIAL ... REJECT SERIAL ... ');

	                let msg = this.tag("ErrorMsg");
	                msg.text = "ERROR: Unable to find ... \n \n" + this.serialURL;
	                msg.setSmooth('alpha',  1.0, {duration: 0.4 });
	              });

	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              // JSON:  Data
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	              DataModel.fetchJSON(this.dataURL).then( data =>
	              {
	                let allPlugins = jsonKeypath.getValue(data, ALL_PLUGINS_KEYPATH);

	                gDataModel.setDataMap(data);

	                this._setState('CreateGuiState');

	                // Activate PLUGINS ...
	                try
	                {
	                  this.activatePlugins(allPlugins).then( () =>
	                  {
	                    console.log('activatePlugins() - ACTIVATED:  allPlugins:' + JSON.stringify(allPlugins) + ' ... ' );
	                  });
	                }
	                catch(e)
	                {
	                  console.log('activatePlugins() - EXCEPTION:  e:' + e + ' ... ' );
	                }
	              })
	              .catch( () =>
	              {
	                console.log('REJECT DATA ... REJECT DATA ... REJECT DATA ... ');

	                let msg = this.tag("ErrorMsg");
	                msg.text = "ERROR: Unable to find ... \n \n" + this.dataURL;
	                msg.setSmooth('alpha',  1.0, {duration: 0.4 });
	              });
	              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	            }
	          }, // CLASS - ReadJsonState
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class CreateGuiState extends this
	          {
	            $enter()
	            {
	              DataModel.fetchJSON(this.menuURL).then( items =>
	              {
	                let gui  = this.tag("GuiContainer");
	                let data = gDataModel.getDataMap();

	                if(gui && data)
	                {
	                  gui.processMenuJSON(items, data);
	                }
	                else
	                {
	                  console.log('ERROR:  CreateGuiState >>> Bad Args ');
	                }

	                this._setState('MScreenState');
	              })
	              .catch( () =>
	              {
	                console.log('REJECT MENU ... REJECT MENU ... REJECT MENU ... ');

	                let msg  = this.tag("ErrorMsg");
	                msg.text = "ERROR: Unable to find ... \n \n" + this.menuURL;

	                msg.setSmooth('alpha',  1.0, {duration: 0.4 });
	              });
	            }
	          },
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class MScreenState extends this
	          {
	            $enter()
	            {
	              console.log(">>>>>>>>>>>>   STATE:  MScreenState - ENTER");

	              this.mScreen.setSmooth('alpha', 1.0, { duration: 0.2 });
	              this.mainGui.setSmooth('alpha', 0.0, { duration: 0.2 });

	             // this.tuner.toggleScan()
	            }

	            $exit()
	            {
	              console.log(">>>>>>>>>>>>   STATE:  MScreenState - EXIT");
	            }

	            _getFocused()
	            {
	              return this.mScreen
	            }

	            _handleKey(k)
	            {
	              let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
	                        'A[' + (k.altKey   ? '1' : '0') + '] '+
	                        'S[' + (k.shiftKey ? '1' : '0') + '] ';

	              console.log('MScreenState >>> '+CAS+'  k.keyCode: ' + k.keyCode + ' state: ' + this._getState() );

	              switch(k.keyCode)
	              {
	                case  8: // 'LAST' key on remote
	                // case 27: // ESC key on keyboard
	                case 73: // '...' Menu key on PlatCo remote
	                {
	                  this._setState('MainGuiState');
	                  return true // handled
	                }

	                case 77: // "Menu" on Factory Remote
	                {
	                  if( isCtrlOnly(k) )
	                  {
	                    this._setState('MainGuiState');
	                    return true // handled
	                  }
	                }
	                break;

	                default:
	                  console.log('MScreenState >>> _handleKey() CAS: ' +CAS+ '- default: ' + k.keyCode );
	                  break;
	              }//SWITCH

	              return false // propagate
	            }
	          }, // CLASS - MScreenState
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class MainGuiState extends this
	          {
	            $enter()
	            {
	              console.log(">>>>>>>>>>>>   STATE:  MainGuiState - ENTER");

	              this.mScreen.setSmooth('alpha', 0.0, { duration: 0.2 });
	              this.mainGui.setSmooth('alpha', 1.0, { duration: 0.2 });
	            }

	            $exit()
	            {
	              console.log(">>>>>>>>>>>>   STATE:  MainGuiState - EXIT");
	            }

	            _getFocused()
	            {
	              return this.tag('GuiContainer')
	            }

	            _handleKey(k)
	            {
	              let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
	                        'A[' + (k.altKey   ? '1' : '0') + '] '+
	                        'S[' + (k.shiftKey ? '1' : '0') + '] ';

	              console.log('TOP >> MainGuiState >>> '+CAS+'  k.keyCode: ' + k.keyCode);

	              if(isCtrlKeyCode( k, 77)  ) // Ctrl-M ... MENU
	              {
	                console.log('TOP >> MainGuiState >>> M SCREEN');
	                this._setState('MScreenState');
	                return true // handle
	              }

	              return false // propagate
	            }

	          }, // CLASS - MainGuiState
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class PlayVideoState extends this
	          {
	            $enter()
	            {
	              this.tag('Player').visible = true;
	              console.log(">>>>>>>>>>>> $enter() ...  STATE:  PlayVideoState");

	              this.tag('Player').playVideoHD();
	            }

	            $exit()
	            {
	              this.tag('Player').visible = false;
	              console.log(">>>>>>>>>>>> $exit() ...  STATE:  PlayVideoState");
	            }

	            _getFocused()
	            {
	              return this.tag('Player');
	            }
	          }, // CLASS - PlayVideoState
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class TestPatternState extends this
	          {
	            $enter()
	            {
	              this.tag('TestContainer').alpha = 1.0;
	              console.log(">>>>>>>>>>>> $enter() ...  STATE:  TestPatternState");
	            }

	            $exit()
	            {
	              this.tag('TestContainer').alpha = 0.0;
	              console.log(">>>>>>>>>>>> $exit() ...  STATE:  TestPatternState");
	            }

	            _getFocused()
	            {
	              return this.tag('TestContainer');
	            }
	          }, // CLASS - TestPatternState
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class InlayPatternState extends this
	          {
	            $enter()
	            {
	              this.tag('InlayContainer').alpha = 1.0;
	            }

	            $exit()
	            {
	              this.tag('InlayContainer').alpha = 0.0;
	            }

	            _getFocused()
	            {
	              return this.tag('InlayContainer');
	            }
	          }, // CLASS - InlayPatternState
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class MacAddressInfoState extends this
	          {
	            $enter()
	            {
	              let mac = gDataModel.getValue('RPC.MACaddr');
	              let ip  = gDataModel.getValue('RPC.STBaddr');

	              this.tag('MacAddressInfo').alpha = 1.0;
	              this.tag('ValueMac').text = mac;
	              this.tag('ValueIP').text  = ip;
	            }

	            $exit()
	            {
	              this.tag('MacAddressInfo').alpha = 0.0;
	            }

	            _handleKey(e)
	            {
	              this._setState(this.lastState); // dismiss
	            }

	            _getFocused()
	            {
	              return this
	            }
	          }, // CLASS - MacAddressInfoState
	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	          class F7screenState extends this
	          {
	            $enter()
	            {
	              console.log(">>>>>>>>>>>>   STATE:  F7screenState - ENTER");

	              // this.mScreen.setSmooth('alpha', 1.0, { duration: 0.2 });
	              // this.mainGui.setSmooth('alpha', 0.0, { duration: 0.2 });

	              this.WifiBT.startScan();
	              this.WifiBT.visible = true;
	            }

	            $exit()
	            {
	              console.log(">>>>>>>>>>>>   STATE:  F7screenState - EXIT");
	            }

	            _getFocused()
	            {
	              return this.mScreen
	            }

	            _handleKey(k)
	            {
	              let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
	                        'A[' + (k.altKey   ? '1' : '0') + '] '+
	                        'S[' + (k.shiftKey ? '1' : '0') + '] ';

	            console.log('F7screenState >>> '+CAS+'  k.keyCode: ' + k.keyCode);

	              switch(k.keyCode)
	              {
	                case  8: // 'LAST' key on remote
	                case 73: // '...' Menu key on PlatCo remote
	                case 56: // 'MAC' key
	                {
	                  this._setState('MainGuiState');
	                  return true // handled
	                }

	                case 77: // "Menu" on Factory Remote
	                {
	                  if( isCtlOnly(k) )
	                  {
	                    this._setState('MainGuiState');
	                    return true // handled
	                  }
	                }
	                break;

	                default:
	                  console.log('F7screenState >>> _handleKey() CAS: ' +CAS+ '- default: ' + k.keyCode );
	                  break;
	              }//SWITCH

	              return false // propagate
	            }
	          }, // CLASS - F7screenState

	          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	      ]
	  }//_states
	} // CLASS - App

	function index() {
	  return Launch(App, ...arguments)
	}


	/*

	<!DOCTYPE html>
	<html lang="en">
	    <head>
	        <meta charset="UTF-8" />
	    </head>
	    <body style="background-color:black;">
	      <script src="./startApp.js"></script>
	    </body>
	</html>

	*/

	return index;

}());
//# sourceMappingURL=appBundle.js.map
