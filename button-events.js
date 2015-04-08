(function (doc, info) {

  'use strict';

  if (typeof info === 'undefined') {
    throw new Error('GM Button Events requires gm.info');
  }

  /**
   * event names to be triggered during various
   * stages of button pressing
   */
  var Events = {
    DOWN: 'buttondown',
    UP: 'buttonup',
    PRESS: 'buttonpress'
  };

  /**
   * list of currently pressed buttons
   */
  var active = [];

  /**
   * gives back the difference between two arrays
   * @param {array} big
   * @param {array} small
   * @return {array} difference
   */
  function diff (big, small) {
    return big.filter(function (thing) {
      return small.indexOf(thing) === -1;
    });
  }

  /**
   * moves btn to active list and trigger button down event
   * @param {string} btn
   */
  function press (btn) {
    active.push(btn);
    emit(Events.DOWN, btn);
  }

  /**
   * removes button from active list and trigger up/press events
   * @param {string} btn
   */
  function release (btn) {
    active.splice(active.indexOf(btn), 1);
    emit(Events.UP, btn);
    setTimeout(emit, 250, Events.PRESS, btn);
  }

  /**
   * dispatches button event
   * @param {string} eventName
   * @param {string} btn
   */
  function emit (eventName, btn) {
    var customEvent = doc.createEvent('CustomEvent');

    customEvent.initCustomEvent(eventName, true, true, btn);
    doc.dispatchEvent(customEvent);
  }

  /**
   * any away we go!
   * @see gm.info.watchButtons
   */
  info.watchButtons(function (btns) {
    btns = btns || [];
    diff(btns, active).forEach(press);
    diff(active, btns).forEach(release);
  }, function () {
    console.log('Unable to start gm.info.watchButtons!');
  });

}(document, gm.info));