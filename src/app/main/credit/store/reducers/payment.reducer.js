import * as Actions from '../actions';

const initialState = {
    payment          : {}, 
};

const paymentReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.PAYMENT_SUCCESS:
        {
            return {
                ...state,
                payment   : action.payload,            
            };
        }
        default:
        {
            return state;
        }
    }
};

export default paymentReducer;
