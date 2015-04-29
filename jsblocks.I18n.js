(function (blocks) {
  blocks.extend(blocks, {
      I18n: {
          _cache: {
              obsCache: {},
              lngCache: {
                  'en': {}
              }
          },
          options: {
              lang: 'en',
              ajax: {
                  async: false,
                  method: 'GET',
                  url: 'locales/{lang}.json'
              }
          },
          /**
           * Downloads locale json file, caches, and loads it to observable values
           * @param new_val
           */
          _load: function (new_val) {
              blocks.DataSource.prototype._ajax(null, {
                  type: blocks.I18n.options.ajax.method,
                  url: blocks.I18n.options.ajax.url.replace('{lang}', new_val),
                  async: blocks.I18n.options.ajax.async
              }, function (data) {
                  var dt = JSON.parse(data);
                  if (!blocks.has(blocks.I18n._cache.lngCache, new_val)) {
                      blocks.I18n._cache.lngCache[new_val] = {};
                  }
                  blocks.each(dt.data, function (value, key, d) {
                      blocks.I18n._cache.lngCache[new_val][key] = value;
                      if (!blocks.has(blocks.I18n._cache.obsCache, key)) {
                          blocks.I18n._cache.obsCache[key] = blocks.observable(value);
                      } else {
                          blocks.I18n._cache.obsCache[key](value);
                      }
                  });
              });
          },
          /**
           * Empties observable's values for default English messages.
           */
          _set_default: function () {
              blocks.each(blocks.I18n._cache.obsCache, function (value, key, d) {
                  value(undefined);
              });
          },
          /**
           * Loads locale values from cache.
           * @param new_locale
           */
          _set_locale: function (new_locale) {
              blocks.each(blocks.I18n._cache.lngCache[new_locale], function (value, key, d) {
                  if (!blocks.has(blocks.I18n._cache.obsCache, key)) {
                      blocks.I18n._cache.obsCache[key] = blocks.observable(value);
                  } else {
                      blocks.I18n._cache.obsCache[key](value);
                  }
              });
          },
          /**
           * Gets translated value of message.
           * @param msg
           * @returns {*}
           */
          _translate: function (msg) {
              if (!blocks.has(blocks.I18n._cache.obsCache, msg)) {
                  blocks.I18n._cache.obsCache[msg] = blocks.observable(msg);
              } else if (blocks.I18n._cache.obsCache[msg]() === undefined) {
                  blocks.I18n._cache.obsCache[msg](msg);
              }
              return blocks.I18n._cache.obsCache[msg];
          },
          /**
           * Initialize and configure I18.
           * Options:
           * {
       *      lang: 'en',                     # Locale to use
       *      ajax: {
       *          async: false,               # Make async ajax calls while loading local file
       *          method: 'GET',              # ajax call method GET, POST...
       *          url: 'locales/{lang}.json'  # Locale file uri
       *      }
       * }
           * @param options
           * @constructor
           */
          init: function (options) {
              if (typeof options === 'object') {
                  blocks.extend(blocks.I18n.options, options);
              }
  
              if (blocks.I18n.options.lang != 'en') {
                  blocks.I18n._load(blocks.I18n.options.lang);
              }
  
          },
          /**
           * Set locale to to new_val
           * Example to switch to Turkish Locale:
           *  blocks.I18n_locale('tr');
           * @param new_val
           * @constructor
           */
          locale: function (new_val) {
              new_val = new_val || 'en';
              blocks.I18n._set_default();
              if (new_val != 'en') {
                  if (blocks.has(blocks.I18n._cache.lngCache, new_val)) {
                      blocks.I18n._set_locale(new_val);
                  } else {
                      blocks.I18n._load(new_val);
                  }
              }
          },
          /**
           * Translate msg with using params.
           * Example:
           *  blocks.t('song no {no}', { no: 11 } );
           * @param msg
           * @param params
           * @returns {*}
           * @private
           */
          translate: function (msg, params) {
              var res = blocks.I18n._translate(msg)();
              params = params || {};
              blocks.each(params, function (value, key, d) {
                  res = res.replace("{" + key + "}", value);
              });
              return res;
          }
      }
  });
  /**
   * Setting translate function globally, to be able to use from everywhere with same syntax.
   * @type {Function}
   * @private
   */
  window.__ = blocks.I18n.translate;
}(blocks));
