import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
export default {
    uploadFile: async data => {
        try {
            let result = await api.post(Apis.UploadFileApi, data, {
                'content-type': 'multipart/form-data'
            });
            if (result.data.error) {
                console.log(result.data.error);
                return [];
            }
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
}