import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
const createBudget = async data => {
  try {
    let result = await api.post(Apis.CreateBudgetApi, data);
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
const getBudget = async id => {
  try {
    let result = await api.post(Apis.GetBudgetApi, {id});
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
const getBudgets = async () => {
  try {
    let companys = await api.post(Apis.GetBudgetsApi);
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
const updateBudget = async (data) => {
  try {
    let result = await api.post(Apis.UpdateBudgetApi, data);
    if (result.data.error) {
      console.log(result.data.error);
      return null;
    }
    return await getBudgets();
  } catch (error) {
    console.log(error);
    return null;
  }
}

const removeBudget = async id => {
  try {
    let result = await api.post(Apis.RemoveBudgetApi, { id });
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
  createBudget,
  getBudget,
  getBudgets,
  updateBudget,
  removeBudget
}