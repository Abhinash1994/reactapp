import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getAutoNumbers = async () => {
  try {
    let result = await api.post(Apis.GetAutoNumbersApi);
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
const getAutoNumber = async (id) => {
  try {
    let result = await api.post(Apis.GetAutoNumberApi, {id});
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
const createAutoNumber = async data => {
  try {
    // console.log(data);
    data.date = moment().format();
    let result = await api.post(Apis.CreateAutoNumberApi, data);
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
const updateAutoNumber = async data => {
  try {
    let result = await api.post(Apis.UpdateAutoNumberApi, data);
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
const remvoeAutoNumber = async id => {
  try {
    let result = await api.post(Apis.RemoveAutoNumberApi, { id });
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
  getAutoNumber,
  getAutoNumbers,
  createAutoNumber,
  updateAutoNumber,
  remvoeAutoNumber
}