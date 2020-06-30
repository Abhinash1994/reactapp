import {
    SET_SETTING
} from '../../actions/types'

const init_state = {
    company: {}
}
export default (state = init_state, action) => {
    switch (action.type) {
        case SET_SETTING:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}