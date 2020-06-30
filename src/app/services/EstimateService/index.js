import api from '../../ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getQuotations = async () => {
  try {
    let result = await api.post(Apis.GetQuotationsApi);
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
const getQuotation = async (id) => {
  try {
    let result = await api.post(Apis.GetQuotationApi, { id });
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

const getInvoiceNumber = async () => {
  try {
    let result = await api.post(Apis.GetQInvoiceNumber);
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

const createQuotation = async data => {
  try {
    // console.log(data);
    data.date = moment().format();
    let result = await api.post(Apis.CreateQuotationApi, data);
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
const updateQuotation = async data => {
  try {
    let result = await api.post(Apis.UpdateQuotationApi, data);
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
const removeQuotation = async id => {
  try {
    let result = await api.post(Apis.RemoveQuotationApi, { id });
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
  getQuotations,
  getQuotation,
  getInvoiceNumber,
  createQuotation,
  updateQuotation,
  removeQuotation
}