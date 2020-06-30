import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
const getAllBranch = async () => {
    try {
        let result = await api.get(Apis.GetAllBranchApi);
        if (result.data.error) {
            console.log(result.data.error);
            return [];
        }
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const createBranch = async data => {
    try {
        console.log(data);
        let result = await api.post(Apis.CreateBranchApi, data);
        if (result.data.error) {
            console.log(result.data.error);
            return [];
        }
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const updateBranch = async data => {
    try {
        let result = await api.post(Apis.UpdateBranchApi, data);
        if (result.data.error) {
            console.log(result.data.error);
            return [];
        }
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
const removeBranch = async data => {
    try {
        let result = await api.post(Apis.RemoveBranchApi, { id: data });
        if (result.data.error) {
            console.log(result.data.error);
            return [];
        }
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export default {
    createBranch,
    getAllBranch,
    updateBranch,
    removeBranch
}
