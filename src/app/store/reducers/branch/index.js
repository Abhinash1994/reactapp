import {
    SET_BRANCH
} from '../../actions/types'

const init_state = {
    branchs: []
}
export default (state = init_state, action) => {
    switch (action.type) {
        case SET_BRANCH:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}