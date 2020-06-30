import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

export default {
    getUnitList: async () => {
        try {
            let result = await api.post(Apis.getUnitList);
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
}