import moment from 'moment';
import * as constants from '../constants';


export default (state = {}, action) => {

  if (state.modules.core.sensors.humidity > state.modules.mf.settings.fanUntilHumidityLessThan) {

    state.modules.core.controls.fan = true;
    state.modules.core.controls.freshAir = true;
    state.modules.core.controls.light = true;
    return state;

  }

  // Turn things off, set things back to how they use to be
  state.modules.core.controls.fan = false;
  state.modules.core.controls.freshAir = false;
  state.modules.core.controls.light = state.modules.core.events.priorControls.light;

  // Finish things off
  delete state.modules.core.events.priorControls;
  state.modules.core.events.state = null;

  return state;

};
