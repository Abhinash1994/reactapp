import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';
const createCompany = async data => {
  try {
    let result = await api.post(Apis.CreateCompanyApi, data);
    if (result.data.error) {
      console.log(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getCompanys = async () => {
  try {
    let companys = await api.get(Apis.getAllCompanysApi);
    if (companys.data.error) {
      NotificationManager.error(companys.data.error);
      return [];
    } else {
      return companys.data;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
const updateCompany = async (data) => {
  try {
    // if (data.logo.name) {
    //   var form_data = new FormData();
    //   form_data.append('filepath', 'company_logo');
    //   form_data.append('file', data.logo, data.logo.name);
    //   let logo = await FileService.uploadFile(form_data);
    //   data.logo = logo;
    //   await api.post(Apis.updateLogoApi, data);
    // }
    let result = await api.post(Apis.updateCompanyApi, data);
    if (result.data.error) {
      console.log(result.data.error);
      return null;
    }
    return await getCompanys();
  } catch (error) {
    console.log(error);
    return null;
  }
}

const removeCompany = async id => {
  try {
    let result = await api.post(Apis.removeCompany, { id });
    if (result.data === true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default {
  createCompany,
  getCompanys,
  updateCompany,
  removeCompany
}