export default (state = {}, action) => {

  state.modules.core.controls.light = true;
  state.modules.core.events.state = null;
  return state;

};
