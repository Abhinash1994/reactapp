import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
const getAllFiscal = async () => {
    try {
        let result = await api.post(Apis.GetAllFiscalsApi);
        console.log(result);
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

const createFiscal = async data => {
    try {
        data.fromdate=moment(data.fromdate).format('YYYY-MM-DD');
        data.todate=moment(data.todate).format('YYYY-MM-DD');
        let result = await api.post(Apis.CreateFiscalApi, data);
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

const updateFiscal = async data => {
    try {
        data.fromdate=moment(data.fromdate).format('YYYY-MM-DD');
        data.todate=moment(data.todate).format('YYYY-MM-DD');
        let result = await api.post(Apis.UpdateFiscalApi, data);
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
const removeFiscal = async data => {
    try {
        let result = await api.post(Apis.RemoveFiscalApi, { id: data });
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
    createFiscal,
    getAllFiscal,
    updateFiscal,
    removeFiscal
}
