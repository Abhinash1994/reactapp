import * as UserActions from './user.actions';
// import * as Actions from 'app/store/actions';
import jwtService from 'app/services/jwtService';
import history from 'history.js';

export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

export const submitRegister = ({ user_name, password, email }) => async dispatch => {
    try {
        let response = await jwtService.createUser({
            username: user_name,
            password,
            useremail: email
        });
        dispatch(UserActions.setUserData(response.data));
        dispatch({
            type: REGISTER_SUCCESS
        });
        let reDirectUrl = '/';
        switch (response.role) {
            case 'admin':
                reDirectUrl = '/'
                break;
            case 'support':
                reDirectUrl = '/settings/support';
                break;
            case 'customer':
                reDirectUrl = '/credit';
                break;
            default:
                reDirectUrl = '/dashboard';
        }
        history.push(reDirectUrl);
    } catch (error) {
        dispatch({
            type: REGISTER_ERROR,
            payload: error
        });
    }
}
