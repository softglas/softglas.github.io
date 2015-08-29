import Ember from 'ember';

let {
  computed,
  run,
  $: jQuery
} = Ember;

export default Ember.Component.extend({
  attributeBindings: ['style', 'data-index'],
  ind: computed.reads('index'),
  'data-index': computed.reads('index'),
  classNames: ['grid'],
  index: null,
  size: null,
  tagName: 'span',

  style: computed('size', function() {
    let index = this.get('index');
    let leftPosition, topPosition;

    if (index < 7){
      console.log('> 7');
      topPosition = 0;
      leftPosition = index * 14.285714286;
    } else if (index < 14){
      index = index % 7;
      console.log('> 14');
      topPosition = 1 * 50;
      leftPosition = index * 14.285714286;
    }

    return `left: ${ leftPosition }%; top: ${ topPosition }%; ` +
      `width:14.285714286%; height:50%`;
  }),

  didInsertElement: function() {

    run.scheduleOnce('afterRender', this, () => {
      // let $area = jQuery(this.element);
      // $area.on('mouseenter', this.mouseEnter);
      // $area.on('mouseleave', this.mouseLeave);

      let _this = this;
      jQuery(this.element).on('mouseenter', function() {
        // run.throttle(_this, 'mouseEnter', 100);
        _this.mouseEnter();
      });

      // jQuery(this.element).on('mouseleave', function(eventData) {
      //   run.throttle(_this, 'mouseLeave', 100);
      // });
    });
  },

  mouseEnter: function() {
    // console.log('ENTER ind >>> ', this.get('ind'));
    this.send('hoverDidChange');
  },

  mouseLeave: function() {
    // console.log('leave ind >>> ', this.get('ind'));
    this.send('hoverDidChange');
  },

  actions: {
    hoverDidChange() {
      let index = this.get('index');
      this.sendAction('hoverDidChange', index);
    }
  }


});
