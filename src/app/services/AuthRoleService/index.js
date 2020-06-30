import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
const getAuthRoles = async roll_id => {
    try {
        let result = await api.post(Apis.GetAuthRolesApi, {roll_id});
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

const createAuthRole = async data => {
    try {
        let result = await api.post(Apis.CreateAuthRoleApi, data);
        if (result.data.error) {
            NotificationManager.error(result.data.error);
            return [];
        }
        NotificationManager.success("Success create.");
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const getUserRole = async () => {
    try {
        let result = await api.post(Apis.GetUserRoleApi);
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

const updateAuthRole = async data => {
    try {
        let result = await api.post(Apis.UpdateAuthRoleApi, data);
        if (result.data.error) {
            NotificationManager.error(result.data.error);
            return [];
        }
        NotificationManager.success("Success update.");
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
const removeAuthRole = async id => {
    try {
        let result = await api.post(Apis.RemoveAuthRoleApi, { id });
        if (result.data.error) {
            NotificationManager.error(result.data.error);
            return false;
        }
        NotificationManager.success("Success delete.");
        return result.data;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default {
    createAuthRole,
    getUserRole,
    getAuthRoles,
    updateAuthRole,
    removeAuthRole
}
