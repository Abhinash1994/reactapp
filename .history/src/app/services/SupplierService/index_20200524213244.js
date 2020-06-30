import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getSuppliers = async () => {
  try {
    let result = await api.post(Apis.GetSuppliersApi);
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
const getSupplier = async () => {
  try {
    let result = await api.get(Apis.GetSupplierApi);
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
const createSupplier = async data => {
  try {
    console.log(data);
    data.status = true;
    data.ledger = 0;
    data.created_by=0;
    data.type=0;
    let result = await api.post(Apis.CreateSupplierApi, data);
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
const updateSupplier = async data => {
  try {
    let result = await api.post(Apis.UpdateSupplierApi, data);
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
const remvoeSupplier = async id => {
  try {
    let result = await api.post(Apis.RemoveSupplierApi, { id });
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return false;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export default {
  getSupplier,
  getSuppliers,
  createSupplier,
  updateSupplier,
  remvoeSupplier
}