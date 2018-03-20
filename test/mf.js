/* eslint no-unused-expressions: 0, import/no-extraneous-dependencies: 0 */

// import assert from 'assert';
import 'chai/register-should';
import { expect, assert } from 'chai';
import delay from 'await-delay';

import moment from 'moment';

import * as redux from '../src/redux';
import * as core from '../src/modules/core';
import { crons, constants } from '../src/modules/mf';

describe('Module', () => {

  describe('mf', () => {

    describe('crons', () => {

      describe('start', () => {

        it('should set event correctly', () => {

          let store = redux.createStore({});
          let state = store.getState();

          crons.start(store);

          let { modules: { core: { events } } } = store.getState();
          expect(events.state).to.equal(constants.MF_EVENT_0_COOLDOWN_TICK);

        });

      });

    });

    describe('reducers', () => {

      describe('MF_EVENT_0_COOLDOWN_TICK', () => {

        it('all controls should be off', async () => {

          let store = redux.createStore({});
          let { modules: { core: { controls, events } } } = store.getState();
          events.state = constants.MF_EVENT_0_COOLDOWN_TICK;
          events.startedAt = moment();
          controls.light = true;

          core.crons.events(store);

          ({ modules: { core: { controls, events } } } = store.getState());

          controls.fan.should.equal(false);
          controls.light.should.equal(false);
          controls.humidifier.should.equal(false);
          controls.freshAir.should.equal(false);

        });

        it('should save previous control state', async () => {

          let store = redux.createStore({});
          let { modules: { core: { controls, events } } } = store.getState();
          events.state = constants.MF_EVENT_0_COOLDOWN_TICK;
          events.startedAt = moment();

          // Set prior state
          controls.light = true;
          expect(events.priorControls).to.not.exist;

          core.crons.events(store);

          ({ modules: { core: { controls, events } } } = store.getState());

          expect(events.priorControls.light).to.equal(true);

        });

        it('should move on to the next state after duration is complete', async () => {

          let store = redux.createStore({});
          let state = store.getState();
          state.modules.core.events.state = constants.MF_EVENT_0_COOLDOWN_TICK;
          state.modules.core.events.startedAt = moment().subtract(3, 's');
          state.modules.mf.settings.cooldownDuration = 1;

          core.crons.events(store);

          let { modules: { core: { controls, events } } } = store.getState();

          expect(events.state).to.equal(constants.MF_EVENT_1_MISTING_TICK);

        });

      });

      describe('MF_EVENT_1_MISTING_TICK', () => {

        it('all controls should be off except for humidifier', async () => {

          let store = redux.createStore({});
          let { modules: { core: { controls, events } } } = store.getState();
          events.state = constants.MF_EVENT_1_MISTING_TICK;
          events.startedAt = moment();

          core.crons.events(store);

          ({ modules: { core: { controls, events } } } = store.getState());

          controls.fan.should.equal(false);
          controls.light.should.equal(false);
          controls.humidifier.should.equal(true);
          controls.freshAir.should.equal(false);

        });


        it('should move on to the next state after duration is complete', async () => {

          let store = redux.createStore({});
          let state = store.getState();
          state.modules.core.events.state = constants.MF_EVENT_1_MISTING_TICK;
          state.modules.core.events.startedAt = moment().subtract(3, 's');
          state.modules.mf.settings.mistingDuration = 1;

          core.crons.events(store);

          let { modules: { core: { controls, events } } } = store.getState();

          controls.humidifier.should.equal(false);
          expect(events.state).to.equal(constants.MF_EVENT_2_CONDENSATION_TICK);

        });

      });

      describe('MF_EVENT_2_CONDENSATION_TICK', () => {

        it('all controls should be off except for humidifier', async () => {

          let store = redux.createStore({});
          let { modules: { core: { controls, events } } } = store.getState();
          events.state = constants.MF_EVENT_2_CONDENSATION_TICK;
          events.startedAt = moment();

          core.crons.events(store);

          ({ modules: { core: { controls, events } } } = store.getState());

          controls.fan.should.equal(false);
          controls.light.should.equal(false);
          controls.humidifier.should.equal(false);
          controls.freshAir.should.equal(false);

        });


        it('should move on to the next state after duration is complete', async () => {

          let store = redux.createStore({});
          let state = store.getState();
          state.modules.core.events.state = constants.MF_EVENT_2_CONDENSATION_TICK;
          state.modules.core.events.startedAt = moment().subtract(3, 's');
          state.modules.mf.settings.condensationDuration = 1;

          core.crons.events(store);

          let { modules: { core: { controls, events } } } = store.getState();

          expect(events.state).to.equal(constants.MF_EVENT_3_FANNING_TICK);

        });

      });

    });

  });

});
