import logger from 'w-logger';
const log = logger('newListing.models');
import api from 'src/api/api.dev';

function   *getNewListingStata(){
    return yield fetch(`${api.carouselshow}`).then((response)=>{
        return  response.json();
    });
}

export  default  {
    namespace: 'newListing',
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
            let imagesData=yield call(getNewListingStata);
 

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