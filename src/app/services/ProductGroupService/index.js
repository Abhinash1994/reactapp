import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getProductGroups = async () => {
  try {
    let result = await api.post(Apis.GetProductGroupsApi);
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
const getProductGroup = async () => {
  try {
    let result = await api.post(Apis.GetProductGroupApi);
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
const createProductGroup = async data => {
  try {
    let result = await api.post(Apis.CreateProductGroupApi, data);
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
const updateProductGroup = async data => {
  try {
    let result = await api.post(Apis.UpdateProductGroupApi, data);
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
const remvoeProductGroup = async id => {
  try {
    let result = await api.post(Apis.RemoveProductGroupApi, {id});
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
  getProductGroup,
  getProductGroups,
  createProductGroup,
  updateProductGroup,
  remvoeProductGroup
}