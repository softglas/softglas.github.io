import Ember from 'ember';

let {
  computed,
  run,
  $: jQuery
} = Ember;

export default Ember.Component.extend({
  attributeBindings: ['style', 'data-index'],
  'data-index': computed.reads('index'),
  classNames: ['grid'],
  index: null,
  size: null,
  tagName: 'span',

  style: computed('size', function() {
    let index = this.get('index');
    let leftPosition, topPosition;

    if (index < 7){
      topPosition = 0;
      leftPosition = index * 14.285714286;
    } else if (index < 14){
      index = index % 7;
      topPosition = 1 * 50;
      leftPosition = index * 14.285714286;
    }

    return `left: ${ leftPosition }%; top: ${ topPosition }%; ` +
      `width:14.285714286%; height:50%`;
  }),

  didInsertElement: function() {
    run.scheduleOnce('afterRender', this, () => {
      jQuery(this.element).on('mouseenter', () => {
        this.mouseEnter();
      });

      jQuery(this.element).on('mouseleave', () => {
        this.mouseLeave();
      });
    });
  },

  mouseEnter: function() {
    this.send('hoverDidChange');
  },

  mouseLeave: function() {
    this.send('hoverDidChange');
  },

  actions: {
    hoverDidChange() {
      this.sendAction('hoverDidChange', this.get('index'));
    }
  }
});
