import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
export default {
  getAllUsers: async () => {
    try {
      let result = await api.post(Apis.GetAllUsersApi);
      if (result.data.error) {
        NotificationManager.error(result.data.error);
        return [];
      }
      return result.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  createUser: async data => {
    try {
      let result = await api.post(Apis.CreateUserApi, data);
      if (result.data.error) {
        NotificationManager.error(result.data.error);
        return null;
      }
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  updateUser: async data => {
    try {
      // data.status = 0;
      // data.created_by = 0;
      let result = await api.post(Apis.UpdateUserApi, data);
      if (result.data.error) {
        NotificationManager.error(result.data.error);
        return null;
      }
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  updatePassword: async data => {
    try {
      let result = await api.post(Apis.ResetUserPasswordApi, data);
      if (result.data.error) {
        NotificationManager.error(result.data.error);
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  deleteUser: async id => {
    try {
      console.log(id);
      let result = await api.post(Apis.DeleteUserApi, { id });
      if (result.data.error) {
        NotificationManager.error(result.data.error);
        return false;
      }
      return result.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}