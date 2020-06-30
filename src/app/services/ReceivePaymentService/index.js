import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getReceivePayments = async () => {
    try {
        let result = await api.post(Apis.GetReceivePayments);
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

const createReceivePayment = async (data) => {
    try {
        let result = await api.post(Apis.CreateReceivePayment, data);
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

const removeReceivePayments = async (id) => {
    try {
        let result = await api.post(Apis.RemoveReceivePayments, { id });
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



export default {
    getReceivePayments,
    createReceivePayment,
    removeReceivePayments
}