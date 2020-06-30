import {combineReducers} from 'redux';
import payment from './payment.reducer';
// import user from './user.reducer';

const reducer = combineReducers({
    payment,
    // user
});

export default reducer;
