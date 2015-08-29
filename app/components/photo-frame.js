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

     return new Ember.Handlebars.SafeString(styles);
     // return styles;
    }),

    actions: {
      hoverDidChange(index) {
        this.set('activeIndex', index);
      }
    }
  });
