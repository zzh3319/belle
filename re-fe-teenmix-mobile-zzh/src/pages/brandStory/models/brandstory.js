import logger from 'w-logger';

const log = logger('brandstory.models');
import api from 'src/api/api.dev';

function   *getbrandstory(){
    return yield fetch(`${api.brandstory}`).then((response)=>{
        return  response.json();
    });
}

export  default  {
    namespace: 'brandstory',
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
        *getText({ payload }, { call, put, select }){
            log('effects.getText');
            let text=yield call(getbrandstory);
           
       

            yield put({
                type: 'set',
                payload:{text}
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
                type: 'getText'
            });
        }
    }
}