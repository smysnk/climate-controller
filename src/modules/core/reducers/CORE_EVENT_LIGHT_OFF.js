export default (state = {}, action) => {

  state.modules.core.controls.light = false;
  state.modules.core.events.state = null;
  return state;

};
