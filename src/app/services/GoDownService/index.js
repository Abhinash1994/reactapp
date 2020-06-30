
import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getAllGodown = async () => {
  try {
    let result = await api.get(Apis.GetAllGodowns);
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
const getGodown = async () => {
  try {
    let result = await api.get(Apis.GetGodownApi);
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
const createGodown = async data => {
  try {
    console.log(data);
    let result = await api.post(Apis.CreateGodownApi, data);
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
const updateGodown = async data => {
  try {
    let result = await api.put(Apis.UpdateGodownApi, data);
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
const removeGodown = async Id => {
  try {
    let result = await api.delete(Apis.RemoveGodownApi, Id);
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
  getAllGodown,
  getGodown,
  createGodown,
  updateGodown,
  removeGodown
  
}