export default (state = {}, action) => {

  if (state.modules.core.sensors.humidity < state.modules.core.settings.humidifier.off) {

    state.modules.core.controls.humidifier = true;
    return state;

  }

  state.modules.core.controls.humidifier = false;
  state.modules.core.events.state = null;

  return state;

};
