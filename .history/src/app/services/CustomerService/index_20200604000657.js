import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getCustomerServices = async () => {
  try {
    let result = await api.get(Apis.GetCustomersApi);
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
const getCustomerService = async () => {
  try {
    let result = await api.post(Apis.GetCustomerApi);
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
const createCustomerService = async data => {
  try {
    console.log(data);
    data.status = true;
    data.ledger = 0;
    data.created_by=0;
    data.type=0;
    let result = await api.post(Apis.CreateCustomerApi, data);
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
const updateCustomerService = async data => {
  try {
    let result = await api.put(Apis.UpdateCustomerApi, data);
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
const remvoeCustomerService = async id => {
  try {
    let result = await api.delete(`${Apis.RemoveCustomerApi}/${id}`);
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

const getCustomerWithBalance = async () => {
  try {
    let result = await api.get(Apis.GetCustomerWithBalanceApi);
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
  getCustomerService,
  getCustomerServices,
  createCustomerService,
  updateCustomerService,
  remvoeCustomerService
}