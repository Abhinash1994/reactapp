import api from '../../../app/ApiConfig';
import { Apis } from '../../../config';
import { NotificationManager } from 'react-notifications';

const getTaxList = async () => {
    try {
        // data.date = moment().format();
        let result = await api.post(Apis.GetTaxList);
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

const createTax = async (data) => {
    try {
        let result = await api.post(Apis.CreateTax, data);
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

const updateTax = async (data) => {
    try {
        let result = await api.post(Apis.UpdateTax, data);
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

const removeTax = async (id) => {
    try {
        // data.date = moment().format();
        let result = await api.post(Apis.RemoveTax, { id });
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

const getTaxReport = async (filter) => {
    try {
        // data.date = moment().format();
        let result = await api.post(Apis.GetTaxReport, filter);
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

const getTaxLedgers = async () => {
    try {
        // data.date = moment().format();
        let result = await api.post(Apis.GetTaxLedgers);
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

export default {
    getTaxList,
    createTax,
    removeTax,
    updateTax,
    getTaxReport,
    getTaxLedgers
};