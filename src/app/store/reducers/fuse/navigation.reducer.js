import * as Actions from '../../actions/fuse/index';
import { navigationConfig } from 'app/fuse-configs/navigationConfig';


const initialState = navigationConfig();
// const initialState = {}
// console.log("**************MENU"+JSON.stringify(initialState))
const navigation = function (state = initialState, action) {

    // navigationConfig().then(res => {

    //     state = res;

    switch (action.type) {
        case Actions.GET_NAVIGATION:
            {
                return [
                    ...state
                ];
            }
        case Actions.SET_NAVIGATION:
            {
                return [
                    ...action.navigation
                ];
            }
        case Actions.RESET_NAVIGATION:
            {
                return [
                    ...initialState
                ];
            }
        default:
            {
                // console.log('***********', state)
                return state;
            }
    }
    // }, err => {
    //     console.log('***********not*************')
    // })

};

export default navigation;
