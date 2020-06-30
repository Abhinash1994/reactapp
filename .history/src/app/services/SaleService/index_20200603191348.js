import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getSales = async () => {
  try {
    let result = await api.get(Apis.GetSalesApi);
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
const getSale = async (id) => {
  try {
    let result = await api.get(Apis.GetSaleApi, { id });
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
    let result = await api.get(Apis.GetInvoiceNumber);
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

const createSale = async (data,saledetail) => {
  try {
    let value = { order_ref: data.order_ref, inv_no:data.inv_no, taxable:data.taxable, tax:data.tax, discount:data.discount, netamount:data.netamount, agent_id: data.agent_id, cust_id: data.cust_id, date:(moment(data.date).format()),SaleDetailModel: saledetail}
    console.log(value)
    let result = await api.post(Apis.CreateSaleApi, value);
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
const updateSale = async data => {
  try {
    let result = await api.post(Apis.UpdateSaleApi, data);
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
const remvoeSale = async id => {
  try {
    let result = await api.post(Apis.RemoveSaleApi, { id });
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
  getSale,
  getSales,
  createSale,
  updateSale,
  remvoeSale,
  getInvoiceNumber
}