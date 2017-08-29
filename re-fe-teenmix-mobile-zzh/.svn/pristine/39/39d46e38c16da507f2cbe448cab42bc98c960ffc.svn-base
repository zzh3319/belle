import logger from 'w-logger';
const log = logger('home.models');
import api from 'src/api/api.dev';

function   getHomePiclistStata(){
    return   fetch(`${api.homePicList}`).then((response)=>{
        return  response.json();
    });
}
function   getHomeBannerStata(){
    return  fetch(`${api.homeBanner}`).then((response)=>{
        return  response.json();
    });
}

export  default  {
    namespace: 'home',
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
            let homePicList=yield call(getHomePiclistStata);
            let homeBanner=yield call(getHomeBannerStata);
       

            yield put({
                type: 'set',
                payload:{homePicList,homeBanner}
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