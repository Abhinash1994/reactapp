import dashboardApis from "../../../services/TransactionService";
import {
  ACCOUNT_ALL_VOUCHER_LOADING,
  SET_ACCOUNT_ALL_VOUCHER,
} from "../../actions/types";

export const getVoucherDetails = (request) => async (dispatch) => {
  try {
    //debugger;
    dispatch({ type: ACCOUNT_ALL_VOUCHER_LOADING });
    let data = await dashboardApis.getVoucherDetails(request);
    let voucherDetails = data;
    dispatch(dispatchAction(SET_ACCOUNT_ALL_VOUCHER, voucherDetails));
  } catch (err) {
    console.log(err);
  }
};

const dispatchAction = (type, data) => (dispatch) => {
  dispatch({
    type: type,
    payload: data,
  });
};
