
import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getAllUnit = async () => {
    try {
        let result = await api.get(Apis.GetUnitApi);
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
const createUnit = async success => {
    try {
        let data = {"UnitCode": success.UnitCode, "UnitName": success.UnitName, "status":success.status};
        let result = await api.post(Apis.CreateUnitApi, data);
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

export default {
    getAllUnit,
    createUnit
}