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
    let result = await api.get(Apis.GetSaleApi + `${id}` );
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
    let arr=[];
    var totaldiscount=0;
    saledetail.forEach(async (row, index) => { 
      totaldiscount += parseInt(row.discount)
     let value = {"item_id":row.item_id,"unit_id":row.unit_id, "price":row.price, "qty":parseInt(row.qty), "total":row.total, "discount":parseInt(row.discount), "tax":row.vat, "netamount":row.grand ,"inv_no":data.inv_no}
     arr.push(value)
    });
    let alldata = { order_ref: data.order_ref, inv_no:data.inv_no, taxable:data.taxable, tax:data.tax, discount:totaldiscount, netamount:data.netamount, agent_id: data.agent_id, cust_id: data.cust_id, date:(moment(data.date).format()),SaleDetailModel: arr}

    let result = await api.post(Apis.CreateSaleApi, alldata);
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