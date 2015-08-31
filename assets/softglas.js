"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('softglas/acceptance-tests/main', ['exports', 'ember-cli-sri/acceptance-tests/main'], function (exports, main) {

	'use strict';



	exports['default'] = main['default'];

});
define('softglas/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'softglas/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('softglas/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'softglas/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('softglas/components/intro-overlay', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var $ = Ember['default'].$;
  var run = Ember['default'].run;

  exports['default'] = Ember['default'].Component.extend({
    isActive: true,
    showing: true,
    willDestroyElement: function willDestroyElement() {
      var clone = $().clone();
      $().parent().append(clone);
      clone.fadeOut();
    },
    actions: {
      exit: function exit() {
        var _this = this;

        $('.overlay').addClass('showing');
        run.later(this, function () {
          _this.toggleProperty('isActive');
        }, 2000);
      }
    }
  });

});
define('softglas/components/photo-frame', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var run = Ember['default'].run;
  var computed = Ember['default'].computed;
  var jQuery = Ember['default'].$;
  var SafeString = Ember['default'].Handlebars.SafeString;

  exports['default'] = Ember['default'].Component.extend({
    activeIndex: 11,
    classNames: ['container'],
    columns: null,
    rows: null,

    didInsertElement: function didInsertElement() {
      run.scheduleOnce('afterRender', this, this.setupOrientation);
    },

    setupOrientation: function setupOrientation() {
      var _this = this;

      jQuery(window).on('deviceorientation', function (eventData) {
        var event = eventData.originalEvent;

        // run.throttle(this, 'setOrientation', event, 500);
        _this.setOrientation(event);
      });
    },

    setOrientation: function setOrientation(event) {
      var index = this._calculateIndex(event);

      this.set('activeIndex', index);
    },

    cells: computed('columns', 'rows', function () {
      var numberOfCells = this.get('columns') * this.get('rows');
      var arrayOfCells = Ember['default'].A([]);

      for (var i = 0; i < numberOfCells; i++) {
        arrayOfCells.pushObject(i);
      }
      return arrayOfCells;
    }),

    activePosition: computed('activeIndex', function () {
      var activeIndex = this.get('activeIndex');
      var rows = this.get('rows');
      var columnFromOrigin = Math.floor(activeIndex / rows);
      var rowFromOrigin = activeIndex % rows;

      var position = { x: rowFromOrigin, y: columnFromOrigin };
      return position;
    }),

    inlineStyles: computed('activePosition', function () {
      var xAxis = this.get('activePosition.x');
      var yAxis = this.get('activePosition.y');
      var styles = 'background-position: ' + xAxis * 16.7 + '% ' + yAxis * 100 + '%;';

      return new SafeString(styles);
    }),

    actions: {
      hoverDidChange: function hoverDidChange(index) {
        this.set('activeIndex', index);
      }
    },

    _calculateIndex: function _calculateIndex(event) {
      var beta = event.beta;
      var gamma = event.gamma;

      var index = 10;

      if (beta > 0) {
        if (gamma > 0) {
          //top right

          if (gamma < 15) {
            index = 10;
          } else if (gamma > 15 && gamma < 35) {
            index = 11;
          } else if (gamma > 35 && gamma < 55) {
            index = 12;
          } else if (gamma > 55) {
            index = 13;
          }

          if (beta < 4) {
            index = 10;
          } else if (beta > 4 && beta < 8) {
            index = 9;
          } else if (beta > 8 && beta < 12) {
            index = 8;
          } else if (beta > 12 && beta < 30) {
            index = 7;
          }
        } else if (gamma < 0) {
          // top left

          if (gamma > -15) {
            index = 10;
          } else if (gamma < -15 && gamma > -35) {
            index = 9;
          } else if (gamma < -35 && gamma > -55) {
            index = 8;
          } else if (gamma < -55) {
            index = 7;
          }

          if (beta < 4) {
            index = 10;
          } else if (beta > 4 && beta < 8) {
            index = 11;
          } else if (beta > 8 && beta < 12) {
            index = 12;
          } else if (beta > 12 && beta < 30) {
            index = 13;
          }
        }
      } else if (beta < 0) {
        if (gamma > 0) {
          //bottom right

          if (beta > -4 && beta < 0) {
            index = 10;
          } else if (beta < -4 && beta > -8) {
            index = 11;
          } else if (beta < -8 && beta > -12) {
            index = 12;
          } else if (beta < -12 && beta > -30) {
            index = 13;
          }
        } else if (gamma < 0) {
          // bottom left

          if (beta > -4 && beta < 0) {
            index = 10;
          } else if (beta < -4 && beta > -8) {
            index = 9;
          } else if (beta < -8 && beta > -12) {
            index = 8;
          } else if (beta < -12 && beta > -30) {
            index = 7;
          }

          if (beta > 0 && beta < 4) {
            index = 10;
          } else if (beta > 4 && beta < 8) {
            index = 11;
          } else if (beta > 8 && beta < 12) {
            index = 12;
          } else if (beta > 12 && beta < 30) {
            index = 13;
          }
        }
      }
      return index;
    }
  });

});
define('softglas/components/trackable-area', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;
  var run = Ember['default'].run;
  var jQuery = Ember['default'].$;

  exports['default'] = Ember['default'].Component.extend({
    attributeBindings: ['style', 'data-index'],
    'data-index': computed.reads('index'),
    classNames: ['grid'],
    index: null,
    size: null,
    tagName: 'span',

    style: computed('size', function () {
      var index = this.get('index');
      var leftPosition = undefined,
          topPosition = undefined;

      if (index < 7) {
        topPosition = 0;
        leftPosition = index * 14.285714286;
      } else if (index < 14) {
        index = index % 7;
        topPosition = 1 * 50;
        leftPosition = index * 14.285714286;
      }

      return 'left: ' + leftPosition + '%; top: ' + topPosition + '%; ' + 'width:14.285714286%; height:50%';
    }),

    didInsertElement: function didInsertElement() {
      var _this = this;

      run.scheduleOnce('afterRender', this, function () {
        jQuery(_this.element).on('mouseenter', function () {
          _this.mouseEnter();
        });

        jQuery(_this.element).on('mouseleave', function () {
          _this.mouseLeave();
        });
      });
    },

    mouseEnter: function mouseEnter() {
      this.send('hoverDidChange');
    },

    mouseLeave: function mouseLeave() {
      this.send('hoverDidChange');
    },

    actions: {
      hoverDidChange: function hoverDidChange() {
        this.sendAction('hoverDidChange', this.get('index'));
      }
    }
  });

});
define('softglas/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('softglas/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('softglas/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'softglas/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('softglas/initializers/export-application-global', ['exports', 'ember', 'softglas/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('softglas/router', ['exports', 'ember', 'softglas/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {});

  // Re open config
  Router.reopen({
    notifyGoogleAnalytics: (function () {
      return ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
    }).on('didTransition')
  });

  exports['default'] = Router;

});
define('softglas/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 0
          }
        },
        "moduleName": "softglas/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","footer");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("MOVE ME");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","social-links-group");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","soundcloud-player");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"width","100%");
        dom.setAttribute(el3,"height","100");
        dom.setAttribute(el3,"scrolling","no");
        dom.setAttribute(el3,"frameborder","no");
        dom.setAttribute(el3,"src","https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/219116652&color=000000&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","photo-frame",[],["rows",7,"columns",2,"width",900,"height",600],["loc",[null,[1,0],[5,14]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('softglas/templates/components/intro-overlay', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 0
            }
          },
          "moduleName": "softglas/templates/components/intro-overlay.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","instructions-container");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","instructions");
          var el4 = dom.createTextNode("Use mouse/finger to move me");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","divider");
          var el4 = dom.createTextNode(" ~ ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","play-btn");
          var el4 = dom.createTextNode("play");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [0]);
          var element1 = dom.childAt(element0, [1, 5]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [
          ["attribute","class",["concat",["overlay ",["get","showing",["loc",[null,[2,22],[2,29]]]]]]],
          ["element","action",["exit"],[],["loc",[null,[6,26],[6,43]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "softglas/templates/components/intro-overlay.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","isActive",["loc",[null,[1,6],[1,14]]]]],[],0,null,["loc",[null,[1,0],[9,7]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('softglas/templates/components/photo-frame', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 8,
              "column": 2
            }
          },
          "moduleName": "softglas/templates/components/photo-frame.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","trackable-area",[],["index",["subexpr","@mut",[["get","index",["loc",[null,[4,12],[4,17]]]]],[],[]],"hoverDidChange","hoverDidChange","totalColumns",["subexpr","@mut",[["get","columns",["loc",[null,[6,19],[6,26]]]]],[],[]],"totalRows",["subexpr","@mut",[["get","rows",["loc",[null,[7,16],[7,20]]]]],[],[]]],["loc",[null,[3,4],[7,22]]]]
        ],
        locals: ["index"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "softglas/templates/components/photo-frame.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","frame");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'style');
        morphs[1] = dom.createMorphAt(element0,1,1);
        return morphs;
      },
      statements: [
        ["attribute","style",["get","inlineStyles",["loc",[null,[1,27],[1,39]]]]],
        ["block","each",[["get","cells",["loc",[null,[2,10],[2,15]]]]],[],0,null,["loc",[null,[2,2],[8,11]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('softglas/templates/components/trackable-area', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 0
          }
        },
        "moduleName": "softglas/templates/components/trackable-area.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('softglas/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('softglas/tests/components/intro-overlay.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/intro-overlay.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/intro-overlay.js should pass jshint.'); 
  });

});
define('softglas/tests/components/photo-frame.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/photo-frame.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/photo-frame.js should pass jshint.'); 
  });

});
define('softglas/tests/components/trackable-area.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/trackable-area.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/trackable-area.js should pass jshint.'); 
  });

});
define('softglas/tests/helpers/resolver', ['exports', 'ember/resolver', 'softglas/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('softglas/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('softglas/tests/helpers/start-app', ['exports', 'ember', 'softglas/app', 'softglas/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('softglas/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('softglas/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.ok(false, 'router.js should pass jshint.\nrouter.js: line 16, col 12, \'ga\' is not defined.\n\n1 error'); 
  });

});
define('softglas/tests/test-helper', ['softglas/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('softglas/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('softglas/config/environment', ['ember'], function(Ember) {
  var prefix = 'softglas';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("softglas/tests/test-helper");
} else {
  require("softglas/app")["default"].create({"contentSecurityPolicy":{"default-src":"'none' https://*.soundcloud.com/*","script-src":"'self' 'unsafe-inline' 'unsafe-eval'","font-src":"'self' http://fonts.googleapis.com/* http://fonts.gstatic.com/*","frame-src":"*soundcloud.com","connect-src":"'self' ","img-src":"'self'","style-src":"'unsafe-inline' 'unsafe-eval'","media-src":"'self'"},"name":"softglas","version":"0.0.0+39ed920b"});
}

/* jshint ignore:end */
//# sourceMappingURL=softglas.map