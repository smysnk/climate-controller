/* eslint no-unused-expressions: 0, import/no-extraneous-dependencies: 0 */

// import assert from 'assert';
import 'chai/register-should';
import { expect, assert } from 'chai';
import delay from 'await-delay';

import moment from 'moment';

import * as redux from '../src/redux';
import { crons, constants } from '../src/modules/core';

describe('Module', () => {

  describe('core', () => {

    describe('crons', () => {

      describe('onoff', () => {

        it('should trigger humidifier when humidity is too low', () => {

          let store = redux.createStore({});
          let state = store.getState();
          state.modules.core.sensors = {
            humidity: 5,
            temperature: 5,
            time: moment('Mon, 06 Mar 2017 02:00:00 MST'),
          };

          crons.onoff(store);

          let { modules: { core: { events } } } = store.getState();
          expect(events.state).to.equal(constants.CORE_EVENT_HUMIDIFIER_TICK);

        });

        it('should trigger dehumidifier when humidity is too high', () => {

          let store = redux.createStore({});
          let state = store.getState();
          state.modules.core.sensors = {
            humidity: 100,
            temperature: 5,
            time: moment('Mon, 06 Mar 2017 02:00:00 MST'),
          };

          crons.onoff(store);

          let { modules: { core: { events } } } = store.getState();
          expect(events.state).to.equal(constants.CORE_EVENT_DEHUMIDIFIER_TICK);

        });

        it('should turn on the lights if time == on time', () => {

          let store = redux.createStore({});
          let state = store.getState();
          state.modules.core.settings.light = {
            on: 12,
            off: 0,
          };
          state.modules.core.sensors = {
            humidity: 5,
            temperature: 5,
            time: moment('Mon, 06 Mar 2017 12:00:00 MST'),
          };

          crons.onoff(store);

          let { modules: { core: { events } } } = store.getState();
          expect(events.state).to.equal(constants.CORE_EVENT_LIGHT_ON);

        });

        it('should turn off the lights if time == on time', () => {

          let store = redux.createStore({});
          let state = store.getState();
          state.modules.core.settings.light = {
            on: 12,
            off: 0,
          };
          state.modules.core.sensors = {
            humidity: 5,
            temperature: 5,
            time: moment('Mon, 06 Mar 2017 00:00:00 MST'),
          };

          crons.onoff(store);

          let { modules: { core: { events } } } = store.getState();
          expect(events.state).to.equal(constants.CORE_EVENT_LIGHT_OFF);

        });

      });

    });

    describe('events', () => {

      it('should call event reducer after first cron tick', () => {

        let store = redux.createStore({});
        let { modules: { core } } = store.getState();
        expect(core.events.startedAt).to.be.null;
        expect(core.events.state).to.be.null;

        store.dispatch({
          type: constants.CORE_EVENT_START,
          state: constants.CORE_EVENT_CIRCULATION_TICK,
        });

        ({ modules: { core } } = store.getState());
        expect(moment().diff(core.events.startedAt)).to.be.below(10);
        expect(core.events.state).to.equal(constants.CORE_EVENT_CIRCULATION_TICK);
        expect(core.controls.fan).to.equal(false);

        // Tick the events cron job
        crons.events(store);

        // Fan should have turned on
        ({ modules: { core } } = store.getState());
        expect(core.events.state).to.equal(constants.CORE_EVENT_CIRCULATION_TICK);
        expect(core.controls.fan).to.equal(true);

      });

      it('should instantiate queued event', () => {

        let store = redux.createStore({});
        store.dispatch({
          type: constants.CORE_EVENT_START,
          state: constants.CORE_EVENT_CIRCULATION_TICK,
        });

        let { modules: { core } } = store.getState();
        expect(core.events.queue).to.have.lengthOf(0);

        store.dispatch({
          type: constants.CORE_EVENT_START,
          state: constants.CORE_EVENT_CIRCULATION_TICK,
          queueable: true,
        });

        ({ modules: { core } } = store.getState());
        expect(core.events.queue).to.have.lengthOf(1);

        // Tick the events cron job to complete the event
        core.settings.circulation.duration = 0;

        crons.events(store);
        ({ modules: { core } } = store.getState());
        expect(core.events.state).to.be.null;

        crons.events(store);
        ({ modules: { core } } = store.getState());
        expect(core.events.state).to.equal(constants.CORE_EVENT_CIRCULATION_TICK);
        expect(core.events.queue).to.have.lengthOf(0);

      });

    });

    describe('reducers', () => {

      describe('CORE_SENSOR_READINGS_UPDATE', () => {

        it('should update sensors', async () => {

          let store = redux.createStore({});

          let { modules: { core: { sensors } } } = store.getState();

          expect(sensors.humidity).to.be.null;
          expect(sensors.temperature).to.be.null;
          expect(sensors.time).to.be.null;

          let time = moment();

          store.dispatch({
            type: constants.CORE_SENSOR_READINGS_UPDATE,
            humidity: 5,
            temperature: 6,
            time,
          });

          ({ modules: { core: { sensors } } } = store.getState());

          sensors.humidity.should.equal(5);
          sensors.temperature.should.equal(6);
          sensors.time.should.equal(time);

        });

      });

      describe('CORE_CONTROLS_UPDATE', () => {

        it('should update controls', async () => {

          let store = redux.createStore({});

          let { modules: { core: { controls } } } = store.getState();

          controls.fan.should.equal(false);
          controls.light.should.equal(false);
          controls.humidifier.should.equal(false);
          controls.freshAir.should.equal(false);

          store.dispatch({
            type: constants.CORE_CONTROLS_UPDATE,
            fan: true,
            light: true,
            humidifier: true,
            freshAir: true,
          });

          ({ modules: { core: { controls } } } = store.getState());

          controls.fan.should.equal(true);
          controls.light.should.equal(true);
          controls.humidifier.should.equal(true);
          controls.freshAir.should.equal(true);

        });

      });

      describe('CORE_EVENT_START', () => {

        it('should initate event', () => {

          let store = redux.createStore({});
          let { modules: { core } } = store.getState();
          expect(core.events.startedAt).to.be.null;
          expect(core.events.state).to.be.null;
          core.events.queue.should.have.lengthOf(0);

          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_CIRCULATION_TICK,
          });

          ({ modules: { core } } = store.getState());
          core.events.startedAt.should.be.an.instanceof(moment);
          core.events.state.should.equal(constants.CORE_EVENT_CIRCULATION_TICK);
          core.events.queue.should.have.lengthOf(0);

        });

        it('should queue event if one is already active and event is queueable', () => {

          let store = redux.createStore({});
          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_CIRCULATION_TICK,
          });

          let { modules: { core } } = store.getState();
          core.events.queue.should.have.lengthOf(0);

          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_CIRCULATION_TICK,
            queueable: true,
          });
          ({ modules: { core } } = store.getState());
          core.events.queue.should.have.lengthOf(1);

        });

        it('should not queue event if one is already active and event is not queueable', () => {

          let store = redux.createStore({});
          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_CIRCULATION_TICK,
          });

          let { modules: { core } } = store.getState();
          core.events.queue.should.have.lengthOf(0);

          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_CIRCULATION_TICK,
            queueable: false,
          });
          ({ modules: { core } } = store.getState());
          core.events.queue.should.have.lengthOf(0);

        });

      });

      describe('CORE_EVENT_CIRCULATION', () => {

        it('should start the fan after the first tick', () => {

          let store = redux.createStore({});

          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_CIRCULATION_TICK,
          });

          let { modules: { core } } = store.getState();
          core.controls.fan.should.equal(false);

          // Tick the events cron job
          crons.events(store);

          // Fan should have turned on
          ({ modules: { core } } = store.getState());
          core.controls.fan.should.equal(true);

        });

        it('should turn off the fan after duration is exceeded', async () => {

          let store = redux.createStore({});

          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_CIRCULATION_TICK,
          });

          // Tick the events cron job
          crons.events(store);

          // Fan should have turned on
          let { modules: { core } } = store.getState();
          core.controls.fan.should.equal(true);

          // Fan should turn off after duration has exceeded
          await delay(200);
          core.settings.circulation.duration = 100;
          crons.events(store);

          ({ modules: { core } } = store.getState());
          core.controls.fan.should.equal(false);

        });

      });

      describe('CORE_EVENT_LIGHT_ON', () => {

        it('should turn the lights on', () => {

          let store = redux.createStore({});

          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_LIGHT_ON,
          });

          let { modules: { core } } = store.getState();
          core.controls.light.should.equal(false);

          // Tick the events cron job
          crons.events(store);

          // Light should have turned on
          ({ modules: { core } } = store.getState());
          core.controls.light.should.equal(true);

        });

      });

      describe('CORE_EVENT_LIGHT_OFF', () => {

        it('should turn the lights off', () => {

          let store = redux.createStore({});
          let state = store.getState();
          state.modules.core.controls.light = true;

          store.dispatch({
            type: constants.CORE_EVENT_START,
            state: constants.CORE_EVENT_LIGHT_OFF,
          });

          let { modules: { core } } = store.getState();
          core.controls.light.should.equal(true);

          // Tick the events cron job
          crons.events(store);

          // Light should have turned off
          ({ modules: { core } } = store.getState());
          core.controls.light.should.equal(false);

        });

      });

    });

  });

});
