import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
const createBudgetDetail = async data => {
  try {
    let result = await api.post(Apis.CreateBudgetDetailApi, data);
    if (result.data.error) {
      console.log(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getBudgetDetail = async id => {
  try {
    let result = await api.post(Apis.GetBudgetDetailApi, { id });
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    } else {
      return result.data;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getBudgetDetails = async (budget) => {
  try {
    let companys = await api.post(Apis.GetBudgetDetailsApi, { budget });
    if (companys.data.error) {
      NotificationManager.error(companys.data.error);
      return [];
    } else {
      return companys.data;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
const updateBudgetDetail = async (data) => {
  try {
    let result = await api.post(Apis.UpdateBudgetDetailApi, data);
    if (result.data.error) {
      console.log(result.data.error);
      return null;
    }
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const removeBudgetDetail = async id => {
  try {
    let result = await api.post(Apis.RemoveBudgetDetail, { id });
    if (result.data === true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default {
  createBudgetDetail,
  getBudgetDetail,
  getBudgetDetails,
  updateBudgetDetail,
  removeBudgetDetail
}