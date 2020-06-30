import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';
const getBanks = async () => {
  try {
    let result = await api.get(Apis.GetBanksApi);
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
const getBank = async () => {
  try {
    let result = await api.get(Apis.GetBankApi);
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
const createBank = async data => {
  try {
    let result = await api.post(Apis.CreateBankApi, data);
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
const updateBank = async data => {
  try {
    let result = await api.put(Apis.UpdateBankApi, data);
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
const remvoeBank = async id => {
  try {
    let result = await api.delete(Apis.RemoveBankApi, { id });
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
const createTransaction = async data => {
  // data.tr_Id = moment().millisecond();
  // data.trans_Id = moment().millisecond();
  // return data;
  try {
    data.date = moment(data.date).toISOString();
    let result = await api.post(Apis.CreateTransactionApi, data);
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
const getTransactions = async type => {
  try {
    let result = await api.post(Apis.GetTransactionsByTypeApi, { type });
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
const updateTransation = async data => {
  try {
    let result = await api.post(Apis.UpdateTransactionApi, data);
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


const remvoeTransaction = async id => {
  try {
    let result = await api.post(Apis.RemoveTransactionApi, { id });
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

const getVoucherNo = async() => {
  try {
    let result = await api.post(Apis.GetVoucherNo);
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


const getBankAmount = async () => {
  try {
    let result = await api.post(Apis.GetBankAmount);
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
  getBank,
  getBanks,
  createBank,
  updateBank,
  remvoeBank,
  getBankAmount,
  getVoucherNo,
  
  createTransaction,
  getTransactions,
  updateTransation,
  remvoeTransaction
}