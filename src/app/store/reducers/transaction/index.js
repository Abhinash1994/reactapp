import {
  SET_ACCOUNT_ALL_VOUCHER,
  ACCOUNT_ALL_VOUCHER_LOADING,
} from "../../actions/types";
const init_state = {
  voucherDetails: { loading: true, value: [] },
};
export default (state = init_state, action) => {
  switch (action.type) {
    case ACCOUNT_ALL_VOUCHER_LOADING:
      return {
        ...state,
        voucherDetails: { loading: true, value: [] },
      };
    case SET_ACCOUNT_ALL_VOUCHER:
      return {
        ...state,
        voucherDetails: { loading: false, value: action.payload },
      };

    default:
      return state;
  }
};
