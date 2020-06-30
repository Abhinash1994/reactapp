import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getSaleDetails = async () => {
  try {
    let result = await api.post(Apis.GetSaleDetailsApi);
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
const getSaleDetailsByInv = async id => {
  try {
    let result = await api.post(Apis.GetSaleDetailsByInvApi, {id});
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
const getSaleDetail = async () => {
  try {
    let result = await api.post(Apis.GetSaleDetailApi);
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
const createSaleDetail = async data => {
  try {
    // console.log(data);
    data.date = moment().format();
    let result = await api.post(Apis.CreateSaleDetailApi, data);
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
const updateSaleDetail = async data => {
  try {
    let result = await api.post(Apis.UpdateSaleDetailApi, data);
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
const remvoeSaleDetail = async id => {
  try {
    let result = await api.post(Apis.RemoveSaleDetailApi, { id });
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
  getSaleDetail,
  getSaleDetails,
  getSaleDetailsByInv,
  createSaleDetail,
  updateSaleDetail,
  remvoeSaleDetail
}