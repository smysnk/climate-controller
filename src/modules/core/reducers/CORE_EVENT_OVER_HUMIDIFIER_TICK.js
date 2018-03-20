import moment from 'moment';

export default (state = {}, action) => {

  if (state.modules.core.sensors.humidity < state.modules.core.settings.humidifier.off
    && !state.modules.core.events.countDown) {

    state.modules.core.controls.humidifier = true;
    return state;

  } else if (state.modules.core.sensors.humidity > 99
    && !state.modules.core.events.countDown) {

    // Start the countdown of over humidifying after we've reached 99 RH
    state.modules.core.controls.humidifier = true;
    state.modules.core.events.countDown = moment();
    return state;

  } else if (state.modules.core.events.countDown) {

    let terminationTime = moment(state.modules.core.events.countDown).add(60 * 3, 's');
    if (moment() > terminationTime) {

      state.modules.core.controls.humidifier = false;
      state.modules.core.events.state = null;
      state.modules.core.events.countDown = null;
      return state;

    }

  }

  return state;

};
