import { NotificationManager } from "react-notifications";
import api from "../../../app/ApiConfig";
import { Apis } from "../../../config";

const getDashboardData = async () => {
  try {
    let result = await api.get(Apis.GetDashboardData);
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

const getTotalIncome = async (data) => {
  try {
    let result = await api.get(
      Apis.GetTotalIncome + `?fromDate=${data.fromDate}&toDate=${data.toDate}`
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
const getTotalExpense = async (data) => {
  try {
    let result = await api.get(
      Apis.GetTotalExpense + `?fromDate=${data.fromDate}&toDate=${data.toDate}`
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
const getTotalSales = async (data) => {
  try {
    let result = await api.get(
      Apis.GetTotalSales + `?fromDate=${data.fromDate}&toDate=${data.toDate}`
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
const getTotalProfitLoss = async (data) => {
  try {
    let result = await api.get(
      Apis.GetProftLoss + `?fromDate=${data.fromDate}&toDate=${data.toDate}`
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
const getTotalEmployee = async (data) => {
  try {
    let result = await api.get(
      Apis.GetTotalEmployee + `?fromDate=${data.fromDate}&toDate=${data.toDate}`
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
const getNewCustomer = async (data) => {
  console.log(data);
  try {
    let result = await api.get(
      Apis.GetNewCustomer + `?fromDate=${data.fromDate}&toDate=${data.toDate}`
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
  getDashboardData,
  getTotalSales,
  getTotalExpense,
  getTotalIncome,
  getNewCustomer,
  getTotalEmployee,
  getTotalProfitLoss,
};
