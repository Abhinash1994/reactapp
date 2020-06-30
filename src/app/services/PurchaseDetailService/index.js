import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getPurchaseDetails = async () => {
  try {
    let result = await api.post(Apis.GetPurchaseDetailsApi);
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
const getPurchaseDetailsByInv = async id => {
  try {
    let result = await api.post(Apis.GetPurchaseDetailsByInvApi, { id });
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

const getPurchaseDetail = async () => {
  try {
    let result = await api.post(Apis.GetPurchaseDetailApi);
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
const createPurchaseDetail = async (data) => {
    try {
      let result = await api.post(Apis.CreatePurchaseDetailApi, data);
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
const updatePurchaseDetail = async data => {
  try {
    let result = await api.post(Apis.UpdatePurchaseDetailApi, data);
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
const remvoePurchaseDetail = async id => {
  try {
    let result = await api.post(Apis.RemovePurchaseDetailApi, { id });
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
  getPurchaseDetail,
  getPurchaseDetails,
  getPurchaseDetailsByInv,
  createPurchaseDetail,
  updatePurchaseDetail,
  remvoePurchaseDetail
}