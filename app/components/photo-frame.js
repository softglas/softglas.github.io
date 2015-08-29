import Ember from 'ember';

let {
  run,
  computed
} = Ember;

export default Ember.Component.extend({
  activeIndex: 11,
  beta: null,
  columns: null,
  rows: null,
  classNames: ['container'],


  didInsertElement: function() {
    console.log('didInsertElement >>> ');
    run.scheduleOnce('afterRender', this, this.setupOrientation);
  },

  setupOrientation: function() {
    console.log('setupOrientation >>> ');

    let _this = this;

    Ember.$(window).on('deviceorientation', function(eventData) {

      let beta = eventData.originalEvent.beta;
      run.throttle(_this, 'anotherSetOrientation', beta, 500);

    });

  },

  anotherSetOrientation: function(eventData) {

    console.log('anotherSetOrientation >>> ', eventData);

    this.set('beta', eventData);


    let beta = this.get('beta');
    let index = beta / 14;

    console.log('beta >>> ', index);
    // this.set('activeIndex', index);
  },

    cells: computed('columns', 'rows', function() {
      let numberOfCells = this.get('columns') * this.get('rows');
      var arrayOfCells = new Array(numberOfCells);

      return arrayOfCells;
    }),

    activePosition: computed('activeIndex', function() {
      let activeIndex = this.get('activeIndex');
      let rows = this.get('rows');

      let height = this.get('height');
      let width = this.get('width');

      let columnFromOrigin = Math.floor(activeIndex / rows);
      let rowFromOrigin = activeIndex % rows;

      let yAxis = columnFromOrigin * -1;
      let xAxis = rowFromOrigin * -1;

      let position = { x: rowFromOrigin, y: columnFromOrigin };
      return position;
    }),

    inlineStyles: computed('activePosition', function() {
      let xAxis = this.get('activePosition.x');
      let yAxis = this.get('activePosition.y');
      let rows = this.get('rows');
      let xSum = (xAxis / 7);
      let styles = `background-position: ${ xAxis * 16.7 }% ${ yAxis * 100 }%;`;

     return styles;
    }),

    actions: {
      hoverDidChange(index) {
        this.set('activeIndex', index);
      }
    }
  });
