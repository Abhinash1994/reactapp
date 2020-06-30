import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getPurchases = async () => {
  try {
    let result = await api.post(Apis.GetPurchasesApi);
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
const getPurchase = async (id) => {
  try {
    let result = await api.post(Apis.GetPurchaseApi, { id });
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

const getPurchaseNumber = async () => {
  try {
    let result = await api.get(Apis.GetPurchaseNumber);
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

const createPurchase = async (data, puchasedetail) => {
  try {
    let arr=[];
    var totaldiscount=0;
    puchasedetail.forEach(async (row, index) => { 
      totaldiscount += parseInt(row.discount);
     let value = {"item_id":row.item_id,"unit_id":row.unit_id, "price":row.price, "qty":parseInt(row.qty), "total":row.total, "discount":parseInt(row.discount), "tax":row.vat, "netamount":row.grand ,"inv_no":data.inv_no}
     arr.push(value)
    });
    let alldata = { order_ref: data.order_ref, inv_no:data.inv_no, taxable:data.taxable, tax:data.tax, discount:totaldiscount, netamount:data.netamount, agent_id: data.agent_id, supp_id: data.cust_id, date:(moment(data.date).format()),PurchaseDetailViewModel: arr}

    let result = await api.post(Apis.CreatePurchaseApi, alldata);
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
const updatePurchase = async data => {
  try {
    let result = await api.post(Apis.UpdatePurchaseApi, data);
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
const remvoePurchase = async id => {
  try {
    let result = await api.post(Apis.RemovePurchaseApi, { id });
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
  getPurchase,
  getPurchases,
  createPurchase,
  updatePurchase,
  remvoePurchase,
  getPurchaseNumber
}