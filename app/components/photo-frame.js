import Ember from 'ember';

let {
  run,
  computed,
  $: jQuery
} = Ember;

let {
  SafeString
} = Ember.Handlebars;

export default Ember.Component.extend({
  activeIndex: 11,
  classNames: ['container'],
  columns: null,
  rows: null,

  didInsertElement: function() {
    run.scheduleOnce('afterRender', this, this.setupOrientation);
  },

  setupOrientation: function() {
    jQuery(window).on('deviceorientation', (eventData) => {
      let event = eventData.originalEvent;

      // run.throttle(this, 'setOrientation', event, 500);
      this.setOrientation(event);
    });

  },

  setOrientation: function(event) {
    let index = this._calculateIndex(event);

    this.set('activeIndex', index);
  },

  cells: computed('columns', 'rows', function() {
    let numberOfCells = this.get('columns') * this.get('rows');
    let arrayOfCells = Ember.A([]);

    for (let i = 0; i < numberOfCells; i++) {
      arrayOfCells.pushObject(i);
    }
    return arrayOfCells;
  }),

  activePosition: computed('activeIndex', function() {
    let activeIndex = this.get('activeIndex');
    let rows = this.get('rows');
    let columnFromOrigin = Math.floor(activeIndex / rows);
    let rowFromOrigin = activeIndex % rows;

    let position = { x: rowFromOrigin, y: columnFromOrigin };
    return position;
  }),

  inlineStyles: computed('activePosition', function() {
    let xAxis = this.get('activePosition.x');
    let yAxis = this.get('activePosition.y');
    let styles = `background-position: ${ xAxis * 16.7 }% ${ yAxis * 100 }%;`;

    return new SafeString(styles);
  }),

  actions: {
    hoverDidChange(index) {
      this.set('activeIndex', index);
    }
  },

  _calculateIndex(event){
    let beta = event.beta;
    let gamma = event.gamma;

    let index = 10;

    if (beta > 0) {
      if (gamma > 0) { //top right

        if (gamma < 15) {
          index = 10;
        } else if (gamma > 15 && gamma < 35 ) {
          index = 11;
        } else if (gamma > 35 && gamma < 55) {
          index = 12;
        } else if (gamma > 55) {
          index = 13;
        }

        if (beta < 4) {
          index = 10;
        } else if (beta > 4 && beta < 8 ) {
          index = 9;
        } else if (beta > 8 && beta < 12) {
          index = 8;
        } else if (beta > 12 && beta < 30) {
          index = 7;
        }

      } else if (gamma < 0) { // top left

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
        } else if (beta > 4 && beta < 8 ) {
          index = 11;
        } else if (beta > 8 && beta < 12) {
          index = 12;
        } else if (beta > 12 && beta < 30) {
          index = 13;
        }

      }
    } else if (beta < 0) {
      if (gamma > 0) { //bottom right

        if (beta > -4 && beta < 0) {
          index = 10;
        } else if (beta < -4 && beta > -8 ) {
          index = 11;
        } else if (beta < -8 && beta > -12) {
          index = 12;
        } else if (beta < -12 && beta > -30) {
          index = 13;
        }

      } else if (gamma < 0) { // bottom left

        if (beta > -4 && beta < 0) {
          index = 10;
        } else if (beta < -4 && beta > -8 ) {
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
