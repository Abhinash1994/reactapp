import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getStockAdjustmentDetail = async () => {
  try {
    let result = await api.post(Apis.GetStockAdjustmentDetail);
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
const getStockAdjustmentDetailByAdjNo = async id => {
  try {
    let result = await api.post(Apis.GetStockAdjustmentDetailByAdjNo, { id });
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
const createStockAdjustmentDetail = async data => {
  try {
    // console.log(data);
    data.date = moment().format();
    let result = await api.post(Apis.CreateStockAdjustmentDetail, data);
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
const updateStockAdjustmentDetail = async data => {
  try {
    let result = await api.post(Apis.UpdateStockAdjustmentDetail, data);
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
const removeStockAdjustmentDetail = async id => {
  try {
    let result = await api.post(Apis.RemoveStockAdjustmentDetail, { id });
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
    getStockAdjustmentDetail,
    getStockAdjustmentDetailByAdjNo,
    createStockAdjustmentDetail,
    updateStockAdjustmentDetail,
    removeStockAdjustmentDetail
}