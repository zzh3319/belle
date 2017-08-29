import logger from 'w-logger';
const log = logger('contactus.models');
import api from 'src/api/api.dev';

function   *getAddressData(){
    return yield fetch(`${api.contactUsAddress}`).then((response)=>{
        return  response.json();
    });
}

export  default  {
    namespace: 'contactus',
    state: {
        value: 0
    },
    reducers: {
        set(state, { payload }){
            log('reducers.set');
            return {
                ...state,
                ...payload
            };
        }
    },
    effects: {
        *getAddress({ payload }, { call, put, select }){
            log('effects.getAddress');
            let addressData=yield call(getAddressData);

          

            yield put({
                type: 'set',
                payload:{addressData}
            });
            
        },
        *reload(){
            log('effects.reload');
        }
    },
    subscriptions: {
        init ({ dispatch }, done) {
            log('subscriptions.init');
            dispatch({
                type: 'getAddress'
            });
        }
    }
}