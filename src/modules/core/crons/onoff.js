import _ from 'lodash';
import * as constants from '../constants';

export default (store) => {

  let { modules: { core: { settings, sensors, events, controls } } } = store.getState();

  // If hour is >= on, turn light on
  if (sensors.time 
    && sensors.time.hours() >= settings.light.on
    && controls.light === false
    && !events.state
    && _.map(events.queue, 'state').indexOf(constants.CORE_EVENT_LIGHT_ON) === -1) {

    store.dispatch({
      type: constants.CORE_EVENT_START,
      state: constants.CORE_EVENT_LIGHT_ON,
      queueable: true,
    });

  }

  // If hour is <= on, turn light off
  if (sensors.time 
    && sensors.time.hours() < settings.light.on
    && controls.light === true
    && !events.state
    && _.map(events.queue, 'state').indexOf(constants.CORE_EVENT_LIGHT_ON) === -1) {

    store.dispatch({
      type: constants.CORE_EVENT_START,
      state: constants.CORE_EVENT_LIGHT_OFF,
      queueable: true,
    });

  }

  // When things get too dry
  if (sensors.humidity
    && sensors.humidity <= settings.humidifier.on
    && !events.state
    && _.map(events.queue, 'state').indexOf(constants.CORE_EVENT_OVER_HUMIDIFIER_TICK) === -1) {

    store.dispatch({
      type: constants.CORE_EVENT_START,
      state: constants.CORE_EVENT_OVER_HUMIDIFIER_TICK,
    });

  }

  // // When things get too humid
  // if (sensors.humidity
  //   && sensors.humidity >= settings.dehumidifier.on
  //   && !events.state
  //   && _.map(events.queue, 'state').indexOf(constants.CORE_EVENT_DEHUMIDIFIER_TICK) === -1) {

  //   store.dispatch({
  //     type: constants.CORE_EVENT_START,
  //     state: constants.CORE_EVENT_DEHUMIDIFIER_TICK,
  //   });

  // }

};
