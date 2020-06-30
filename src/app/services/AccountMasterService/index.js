import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

export default {
  getAllAccountMaster: async () => {
    try {
      let result = await api.get(Apis.GetAllAccountMaster);
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
}