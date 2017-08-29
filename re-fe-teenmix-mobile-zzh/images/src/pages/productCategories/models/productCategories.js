import logger from 'w-logger';

const log = logger('productCategories.models');
import api from 'src/api/api.dev';

function   *getproductCategories(){
    return yield fetch(`${api.newproduct}`).then((response)=>{
        return  response.json();
    });
}

export  default  {
    namespace: 'productCategories',
    state: {
          navList:{
           "coolParty":{
            "name":"潮酷派对",
            "type":"coolParty",
            "index":1
           },

           "businessConference":{
            "name":"商务会议",
            "type":"businessConference",
            "index":2
           },

           "youthCampus":{
            "name":"青春校园",
            "type":"youthCampus",
            "index":3
           },

           "streetSports":{
            "name":"街头运动",
            "type":"streetSports",
            "index":4
           },

           "outdoorRecreation":{
            "name":"户外休闲",
            "type":"outdoorRecreation",
            "index":5
           },

           "sweetDate":{
            "name":"甜蜜约会",
            "type":"sweetDate",
            "index":6
           },

           "fashionMenShoes":{
            "name":"时尚男鞋",
            "type":"fashionMenShoes",
            "index":7
           }
         }
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
        *getImageData({ payload }, { call, put, select }){
            log('effects.getImageData');
            let imagesData=yield call(getproductCategories);
           
            // let jsondata=yield put({
            //     type: ImagesData
            // });
            //  let jsondata=yield put({
            //     type: ImagesData
            // });

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
                type: 'getImageData'
            });
        }
    }
}