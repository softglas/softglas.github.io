import Ember from 'ember';

let {
  run,
  computed
} = Ember;

export default Ember.Component.extend({
  activeIndex: 11,
  columns: null,
  rows: null,
  classNames: ['container'],

  didInsertElement: function() {
    run.scheduleOnce('afterRender', this, this.setupOrientation);
  },

  setupOrientation: function() {
    let _this = this;

    Ember.$(window).on('deviceorientation', function(eventData) {

      let event = eventData.originalEvent;
      run.throttle(_this, 'setOrientation', event, 500);

    });

  },

  setOrientation: function(event) {

    // if (event.beta > 25) {
      let alpha = event.alpha;
      let beta = event.beta;
      let gamma = event.gamma;
      let gammaIsPositive = false;


      if (gamma > 0){
        gammaIsPositive = true
      }

      let index = Math.round(beta / 25.714285714);
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

      // index = index * 2;


      // FIXME: this can be fixed up so that when titling to the left
      // we should the slides from the left.

      this.set('activeIndex', index);
    // }
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

    // return styles;
    return new Ember.Handlebars.SafeString(styles);
  }),

  actions: {
    hoverDidChange(index) {
      this.set('activeIndex', index);
    }
  }
});
