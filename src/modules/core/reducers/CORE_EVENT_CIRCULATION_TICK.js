import moment from 'moment';

export default (state = {}, action) => {

  let terminationTime = moment(state.modules.core.events.startedAt).add(state.modules.core.settings.circulation.duration, 'ms');
  if (moment() < terminationTime) {

    state.modules.core.controls.fan = true;
    state.modules.core.controls.freshAir = true;
    return state;

  }

  state.modules.core.controls.fan = false;
  state.modules.core.controls.freshAir = false;
  state.modules.core.events.state = null;

  return state;

};
