import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getChartOfAccounts = async (type) => {
  try {
    let result = await api.post(Apis.GetChartOfAccountsApi, { type });
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
const getChartOfAccount = async () => {
  try {
    let result = await api.post(Apis.GetChartOfAccountApi);
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
const getAllChartOfAccount = async () => {
  try {
    let result = await api.post(Apis.GetAllChartOfAccount);
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


const createChartOfAccount = async data => {
  try {
    let result = await api.post(Apis.CreateChartOfAccountApi, data);
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
const updateChartOfAccount = async data => {
  try {
    let result = await api.post(Apis.UpdateChartOfAccountApi, data);
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
const remvoeChartOfAccount = async id => {
  try {
    let result = await api.post(Apis.RemoveChartOfAccountApi, { id });
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

const getAccoutLedgerNameList = async () => {
  try {
    let result = await api.post(Apis.GetAccoutLedgerNameList);
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

const CreateAccount = async data => {
  try {
    let result = await api.post(Apis.CreateAccount, data);
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


const getChartOfAccountsa = async (type) => {
  try {
    let result = await api.post(Apis.GetChartOfAccountsaApi, { type });
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

const getCharKhataReport = async (filter) => {
  try {
    let result = await api.get(
      Apis.getCharKhataReportApi +
        `?BranchId=${filter.BranchId}&Type=${filter.Type}&FromDate=${filter.from}&ToDate=${filter.to}`
    );
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

const getAccountPayableReport = async (filter) => {
  try {
    let result = await api.get(
      Apis.getAcpayable +
        `?BranchId=${filter.BranchId}&ToDate=${filter.to}`
    );
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

const getAccountRecieveReport = async (filter) => {
  try {
    let result = await api.get(
      Apis.getRecieveable +
        `?BranchId=${filter.BranchId}&ToDate=${filter.to}`
    );
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

const getShareCapitalReport = async (filter) => {
  try {
    let result = await api.get(
      Apis.getShareCapital +
        `?BranchId=${filter.BranchId}&ToDate=${filter.to}`
    );
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

const getStatementReport = async (filter) => {
  try {
    let result = await api.get(
      Apis.GetStatement +
      `?BranchId=${filter.BranchId}&Type=${filter.Type}&FromDate=${filter.from}&ToDate=${filter.to}&LedgerCode=${filter.LedgerCode}`
    );
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

const getSalaryPayableReport = async (filter) => {
  try {
    let result = await api.get(
      Apis.getSalaryPayable +
        `?BranchId=${filter.BranchId}&ToDate=${filter.to}`
    );
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

const GetLedgerDetailsReport = async (filter) => {
  console.log("GetLedgerDetailsReport -> filter", filter)
  try {
    let result = await api.get(
      Apis.GetLedgerDetails +
      `?BranchId=${filter.BranchId}&FromDate=${filter.from}&ToDate=${filter.to}&LedgerCode=${filter.LedgerCode}`
    );
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
  getChartOfAccount,
  getChartOfAccounts,
  createChartOfAccount,
  updateChartOfAccount,
  remvoeChartOfAccount,
  getAllChartOfAccount,
  getAccoutLedgerNameList,
  CreateAccount,
  getChartOfAccountsa,
  getCharKhataReport,
  getAccountPayableReport,
  getShareCapitalReport,
  getSalaryPayableReport,
  getStatementReport,
  getAccountRecieveReport,
  GetLedgerDetailsReport
}