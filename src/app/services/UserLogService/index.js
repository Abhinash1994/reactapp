import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getUserLogs = async () => {
  try {
    let result = await api.post(Apis.GetUserLogsApi);
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
const getUserLog = async () => {
  try {
    let result = await api.post(Apis.GetUserLogApi);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const createUserLog = async data => {
  try {
    let result = await api.post(Apis.CreateUserLogApi, data);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const updateUserLog = async data => {
  try {
    let result = await api.post(Apis.UpdateUserLogApi, data);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const remvoeUserLog = async id => {
  try {
    let result = await api.post(Apis.RemoveUserLogApi, {id});
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
export default {
  getUserLog,
  getUserLogs,
  createUserLog,
  updateUserLog,
  remvoeUserLog
}