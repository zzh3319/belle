import logger from 'w-logger';
const log = logger('movieshow.models');
import api from 'src/api/api.dev';

function   *getMovieShowStata(){
    return yield fetch(`${api.movieShow}`).then((response)=>{
        return  response.json();
    });
}

export  default  {
    namespace: 'movieshow',
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
        *getImg({ payload }, { call, put, select }){
            log('effects.getImg');
            let imagesData=yield call(getMovieShowStata);

            yield put({
                type: 'set',
                payload:{imagesData}
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
                type: 'getImg'
            });
        }
    }
}