import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getQuotationDetails = async () => {
  try {
    let result = await api.post(Apis.GetQuotationDetailslApi);
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
const getQuotationDetailsByInv = async id => {
  try {
    let result = await api.post(Apis.GetQuotationDetailsByInvApi, { id });
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
const getQuotationDetail = async () => {
  try {
    let result = await api.post(Apis.GetQuotationDetailApi);
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
const createQuotationDetail = async data => {
  try {
    // console.log(data);
    data.date = moment().format();
    let result = await api.post(Apis.CreateQuotationDetailApi, data);
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
const updateQuotationDetails = async data => {
  try {
    let result = await api.post(Apis.UpdateQuotationDetailsApi, data);
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
const removeQuotationDetails = async id => {
  try {
    let result = await api.post(Apis.RemoveQuotationDetailsApi, { id });
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
  getQuotationDetails,
  getQuotationDetailsByInv,
  getQuotationDetail,
  createQuotationDetail,
  updateQuotationDetails,
  removeQuotationDetails
}