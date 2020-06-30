import api from '../../ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const getStockAdjustments = async () => {
    try {
        let result = await api.post(Apis.GetStockAdjustments);
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
const getStockAdjustment = async (id) => {
    try {
        let result = await api.post(Apis.GetStockAdjustment, { id });
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

const getAdjustmentNumber = async () => {
    try {
        let result = await api.post(Apis.GetAdjustmentNumber);
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

const createStockAdjustment = async data => {
    try {
        // console.log(data);
        data.date = moment().format();
        let result = await api.post(Apis.CreateStockAdjustment, data);
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
const updateStockAdjustment = async data => {
    try {
        let result = await api.post(Apis.UpdateStockAdjustment, data);
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
const removeStockAdjustment = async id => {
    try {
        let result = await api.post(Apis.RemoveStockAdjustment, { id });
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
    createStockAdjustment,
    getStockAdjustment,
    getAdjustmentNumber,
    getStockAdjustments,
    updateStockAdjustment,
    removeStockAdjustment
}