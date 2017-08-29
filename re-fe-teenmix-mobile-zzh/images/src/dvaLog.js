import logger from 'w-logger';

const onActionLog = logger('dva.onAction');
// onActionLog.disable();

const onReducerLog = logger('dva.onReducer');
// onReducerLog.disable();

const onStateChangeLog = logger('dva.onStateChange');
// onStateChangeLog.disable();

const onEffectRegisterLog = logger('dva.onEffectRegister');
// onEffectRegisterLog.disable();

const onEffectLog = logger('dva.onEffect');
// onEffectLog.disable();

const extraReducersLog = logger('dva.extraReducers');
// extraReducersLog.disable();

export  default function () {
  return {
    onError (...args) {
      console.error(args);
    },
    onAction ({ dispatch, getState }){
      return (next) => {
        return (action) => {
          onActionLog(` ${action.type}`);
          return next(action)
        }
      }
    },
    // onStateChange(...args) {
    //   onStateChangeLog('', args);
    //   return function () {
    //
    //   }
    // },
    onReducer (reducer) {
      return (state, action)=> {
        onReducerLog(`actionType: ${action.type}`);
        return reducer(state, action);
      }
    },
    onEffect (effect, { put, take, call, apply }, model, actionType) {
      onEffectRegisterLog(`${actionType}`);
      return function*(...args) {
        onEffectLog(`trigger => ${args[0].type}`);
        yield apply(this, effect, args);
      }
    },
    // extraReducers: {
    // 	actionType(state, action) {
    // 		extraReducersLog(`actionType : ${action.type}`);
    // 		return action.type;
    // 	}
    // },
  }
}
