import {combineReducers} from 'redux';
import user from './user.reducer';
import login from './login.reducer';
import register from './register.reducer';
import forgot from './forgot.reducer';

const authReducers = combineReducers({
    user,
    login,
    register,
    forgot
});

export default authReducers;