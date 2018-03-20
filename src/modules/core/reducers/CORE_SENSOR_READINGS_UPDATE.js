export default (state = {}, action) => {

  state.modules.core.sensors = {
    temperature: action.temperature,
    humidity: action.humidity,
    time: action.time,
  };
  return state;

};
