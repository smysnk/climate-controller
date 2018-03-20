import moment from 'moment';
import _ from 'lodash';

let dht;
let relayFan;
let relayLight;
let relayHumidifier;
let relayFreshAir;

// Initialize things
if (process.env.LOCAL_DEVELOPMENT) {

  class Dht {

    read() {

      return {
        temperature: 0.0,
        humidity: 75.0,
        time: moment(),
      };

    }

  }
  dht = new Dht();

} else {

  let Gpio = require('onoff').Gpio;
  let rpiDhtSensor = require('rpi-dht-sensor');
  dht = new rpiDhtSensor.DHT22(2);

  // Initialize relays
  relayFan = new Gpio(3, 'out');
  relayHumidifier = new Gpio(4, 'out');
  relayLight = new Gpio(14, 'out');
  relayFreshAir = new Gpio(15, 'out');

}

// Datadog middleware
export default ({ getState }) => next => action => {

  // Call the next dispatch method in the middleware chain.
  let returnValue = next(action);

  let state = getState();

  // Only try and control relays when running in production env
  if (!process.env.LOCAL_DEVELOPMENT) {

    // Inverse logic, relays 1 = off
    relayFan.writeSync(state.modules.core.controls.fan ? 0 : 1);
    relayLight.writeSync(state.modules.core.controls.light ? 0 : 1);
    relayHumidifier.writeSync(state.modules.core.controls.humidifier ? 0 : 1);
    relayFreshAir.writeSync(state.modules.core.controls.freshAir ? 0 : 1);

  }

  return returnValue;

};

export { dht };
