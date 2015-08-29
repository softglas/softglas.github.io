import Ember from 'ember';

let {
  $,
  run
} = Ember;

export default Ember.Component.extend({
  isActive: true,
  showing: true,
  willDestroyElement: function() {
    let clone = $().clone();
    $().parent().append(clone);
    clone.fadeOut();
  },
  actions: {
    exit() {

      $('.overlay').addClass('showing');
      run.later(this, () => {
        this.toggleProperty('isActive');
      }, 2000);

    }
  }
});
