import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

export default {
    createNewAttachment: async (data) => {
        try {
            let result = await api.post(Apis.CreateNewAttachment, data);
            if (result.data.error) {
                NotificationManager.error(result.data.error);
                return [];
            }
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    getAllAttachment: async () => {
        try {
            let result = await api.post(Apis.GetAllAttachment);
            if (result.data.error) {
                NotificationManager.error(result.data.error);
                return [];
            }
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    getAttachment: async (id) => {
        try {
            let result = await api.post(Apis.GetAttachment, id);
            if (result.data.error) {
                NotificationManager.error(result.data.error);
                return [];
            }
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    
    updateAttachment: async (data) => {
        try {
            let result = await api.post(Apis.UpdateAttachment, data);
            if (result.data.error) {
                NotificationManager.error(result.data.error);
                return [];
            }
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    
    removeAttachment: async (id) => {
        try {
            let result = await api.post(Apis.RemoveAttachment, id);
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