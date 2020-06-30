import jwtService from 'app/services/jwtService';
import RoleService from '../../../services/RoleService';
import { setUserData } from './user.actions';
// import * as Actions from 'app/store/actions';
import history from 'history.js';
import { NotificationManager } from 'react-notifications';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const submitLogin = ({ email, password, branch_Id }) => async dispatch => {
  try {
    console.log(branch_Id);
    let user = await jwtService.signInWithEmailAndPassword(email, password, branch_Id);
    if (user.error) {
      NotificationManager.error(user.error);
      dispatch({
        type: LOGIN_ERROR,
        payload: user.error
      });
      return;
    }
    if (user) {
      let roles = await RoleService.getUserRole();
      let rolesObject = {};
      roles.forEach(element => {
        rolesObject[element.menu] = element;
      });
      dispatch(setUserData({ ...user, roles: rolesObject }));
      localStorage.setItem('username', user.username)
      localStorage.setItem('userid', user.id)
      history.push({
        pathname: '/dashboard'
      });
      dispatch({
        type: LOGIN_SUCCESS
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_ERROR,
      payload: error
    });
  }
}
