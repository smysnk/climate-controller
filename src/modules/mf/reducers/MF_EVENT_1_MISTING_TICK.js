import moment from 'moment';
import * as constants from '../constants';


export default (state = {}, action) => {

  let terminationTime = moment(state.modules.core.events.startedAt).add(state.modules.mf.settings.mistingDuration, 's');
  if (moment() < terminationTime) {

    state.modules.core.controls.humidifier = true;
    return state;

  }

  // Progress on to next state
  state.modules.core.controls.humidifier = false;
  state.modules.core.events.state = constants.MF_EVENT_2_CONDENSATION_TICK;
  state.modules.core.events.startedAt = moment();

  return state;

};
