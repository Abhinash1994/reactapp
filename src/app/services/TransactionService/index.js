import api from "../../../app/ApiConfig";
import { Apis } from "../../../config";
import { NotificationManager } from "react-notifications";
import isEmpty from "app/helper/utils/isEmpty";

const createTransaction = async (data) => {
  try {
    // data.date = moment().format();
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
};

const updateTransaction = async (data) => {
  try {
    // data.date = moment().format();
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
};

const GetVoucherNumber = async (type) => {
  try {
    // data.date = moment().format();
    let result = await api.post(Apis.GetVoucherNumber, { type });
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createVoucher = async (data) => {
  try {
    // data.date = moment().format();
    let result = await api.post(Apis.CreateVoucher, data);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getTransactionsVoucher = async (type) => {
  try {
    let result = await api.post(Apis.GetTransactionsVoucher, { type });
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const removeTransactionsVoucher = async (id) => {
  try {
    let result = await api.post(Apis.RemoveTransaction, { id });
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getTransactions = async (type) => {
  try {
    let result = await api.post(Apis.GetTransactionsApi, { type });
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getFilterTransactions = async (data) => {
  try {
    let result = await api.post(Apis.GetFilterTransactions, data);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const removeCurrentVoucher = async (type) => {
  try {
    let result = await api.post(Apis.RemoveCurrentVoucher, { type });
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getBookTransactions = async (filter) => {
  console.log(filter);
  try {
    let result = await api.post(Apis.GetBookTransactions, filter);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCashBook = async (filter) => {
  console.log(filter);
  try {
    let result = await api.get(
      Apis.GetCashBook +
        `?fromDate=${filter.from}&toDate=${filter.to}
        &userId=${filter.user}&PageSize=${filter.pageSize}&PageNumber=${filter.pageIndex}`
    );
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getVoucherDetails = async (filter) => {
  //console.log(filter);
  //debugger;
  try {
    let result = await api.get(
      Apis.GetVoucherDetails +
        `?${!isEmpty(filter.fromDate) ? `fromDate=` + filter.fromDate : ""}${
          !isEmpty(filter.toDate) ? `&toDate=` + filter.toDate + `&` : ""
        }tranType=${filter.tranType}&userId=${filter.userId}`
    );
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getVoucherByVoucherNo = async (voucherNo) => {
  try {
    let result = await api.get(
      Apis.GetVoucherByVoucherNumber + `?voucherNo=${voucherNo}`
    );
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getCharKhata = async (filter) => {
  console.log(filter);
  try {
    let result = await api.get(
      Apis.getCharKhata +
        `?fromDate=${filter.from}&toDate=${filter.to}
        &userId=${filter.user}&PageSize=${filter.pageSize}&PageNumber=${filter.pageIndex}`
    );
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};


export default {
  createTransaction,
  getTransactionsVoucher,
  removeTransactionsVoucher,
  getTransactions,
  createVoucher,
  updateTransaction,
  removeCurrentVoucher,
  getBookTransactions,
  getFilterTransactions,
  GetVoucherNumber,
  getVoucherDetails,
  getVoucherByVoucherNo,
  getCashBook,
  getCharKhata,
};
