import * as Actions from '../actions';

const initialState = {
    success: false,
};

const forgot = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.FORGOT_PASSWORD:
        {
            return {
                ...initialState,
                success: true
            };
        }
      
        default:
        {
            return state
        }
    }
};

export default forgot;