export default (state = {}, action) => {

  if (state.modules.core.sensors.humidity > state.modules.core.settings.dehumidifier.off) {

    state.modules.core.controls.freshAir = true;
    state.modules.core.controls.fan = true;
    return state;

  }

  state.modules.core.controls.freshAir = false;
  state.modules.core.controls.fan = false;
  state.modules.core.events.state = null;

  return state;

};
