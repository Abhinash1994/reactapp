import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
export default {
  getAllRoles: async () => {
    try {
      let result = await api.post(Apis.GetAllRolesApi);
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
  createRole: async data => {
    try {
      let result = await api.post(Apis.CreateRoleApi, data);
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
  updateRole: async data => {
    try {
      let result = await api.post(Apis.UpdateRoleApi, data);
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
  deleteRole: async data => {
    try {
      let result = await api.post(Apis.DeleteRoleApi, data);
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
  getUserRole: async data => {
    try {
      let result = await api.post(Apis.GetUserRoleApi, data);
      if (result.data.error) {
        NotificationManager.error(result.data.error);
        return [];
      }
      return result.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}