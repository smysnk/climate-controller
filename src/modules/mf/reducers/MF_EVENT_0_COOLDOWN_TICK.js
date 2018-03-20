import moment from 'moment';
import * as constants from '../constants';


export default (state = {}, action) => {

  // Save controls prior to starting this event
  if (!state.modules.core.events.priorControls) {

    state.modules.core.events.priorControls = {
      light: state.modules.core.controls.light,
    };

  }

  let terminationTime = moment(state.modules.core.events.startedAt).add(state.modules.mf.settings.cooldownDuration, 's');
  if (moment() < terminationTime) {

    state.modules.core.controls.light = false;
    return state;

  }

  // Progress on to next state
  state.modules.core.events.state = constants.MF_EVENT_1_MISTING_TICK;
  state.modules.core.events.startedAt = moment();

  return state;

};
