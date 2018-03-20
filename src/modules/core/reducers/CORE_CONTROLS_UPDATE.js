export default (state = {}, action) => {

  state.modules.core.controls = {
    fan: action.fan,
    humidifier: action.humidifier,
    light: action.light,
    freshAir: action.freshAir,
  };
  return state;

};
