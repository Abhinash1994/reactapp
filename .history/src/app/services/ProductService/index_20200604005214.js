import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getProductServices = async () => {
  try {
    let result = await api.post(Apis.GetProductServicesApi);
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
const getProductService = async () => {
  try {
    let result = await api.post(Apis.GetProductServiceApi);
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
const createProductService = async data => {
  try {
    console.log(data);
    let result = await api.post(Apis.CreateProductServiceApi, data);
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
const updateProductService = async data => {
  try {
    let result = await api.post(Apis.UpdateProductServiceApi, data);
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
const remvoeProductService = async id => {
  try {
    let result = await api.post(Apis.RemoveProductServiceApi, {id});
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
const getProductServiceWithQoh = async () => {
  try {
    let result = await api.get(Apis.GetProductServiceWithQohApi);
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
export default {
  getProductService,
  getProductServices,
  createProductService,
  updateProductService,
  remvoeProductService
}