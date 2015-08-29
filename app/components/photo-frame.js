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
  columns: null,
  rows: null,
  classNames: ['container'],

  didInsertElement: function() {
    run.scheduleOnce('afterRender', this, this.setupOrientation);
  },

  setupOrientation: function() {
    jQuery(window).on('deviceorientation', (eventData) => {
      let event = eventData.originalEvent;
      run.throttle(this, 'setOrientation', event, 500);
    });

  },

  setOrientation: function(event) {
    let beta = event.beta;
    let gamma = event.gamma;
    let gammaIsPositive = false;

    if (gamma > 0) {
      gammaIsPositive = true
    }

    let index = 3;

    if (beta < 56.25) {
      index = 0;
    } else if (beta > 56.25 && beta < 67.5) {
      index = 1;
    } else if (beta > 67.5 && beta < 78.75) {
      index = 2;
    } else if (beta > 78.75) {
      index = 3;
    }

    if (gammaIsPositive) {
      switch (index) {
          case 0:
              index = 13;
              break;
          case 1:
              index = 12;
              break;
          case 2:
              index = 11;
              break;
          case 3:
              index = 10;
              break;
      }
    } else {
      index = Math.round(index + 7);
    }

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
  }
});
