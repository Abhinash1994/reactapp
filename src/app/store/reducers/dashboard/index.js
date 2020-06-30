import {
  SET_DASHBOARD_BLOCKS,
  DASHBOARD_BLOCKS_LOADING,
  SET_DASHBOARD_BALANCE,
  DASHBOARD_BALANCE_LOADING,
  SET_DASHBOARD_CUSTOMER,
  DASHBOARD_CUSTOMER_LOADING,
  SET_DASHBOARD_EMPLOYEE,
  DASHBOARD_EMPLOYEE_LOADING,
  SET_DASHBOARD_EXPENSE,
  DASHBOARD_EXPENSE_LOADING,
  SET_DASHBOARD_PROFIT_LOSS,
  DASHBOARD_PROFIT_LOSS_LOADING,
  SET_DASHBOARD_SALES,
  DASHBOARD_SALES_LOADING,
  SET_DASHBOARD_INCOME,
  DASHBOARD_INCOME_LOADING,
} from "../../actions/types";

const init_state = {
  dashboardBlocksData: { loading: true, value: {} },
  dashboardBalance: { loading: true, value: {} },
  dashboardSales: { loading: true, value: {} },
  dashboardEmployee: { loading: true, value: {} },
  dashboardCustomer: { loading: true, value: {} },
  dashboardProfitLoss: { loading: true, value: {} },
  dashboardExpense: { loading: true, value: {} },
  dashboardIncome: { loading: true, value: {} },
};
export default (state = init_state, action) => {
  switch (action.type) {
    case DASHBOARD_BLOCKS_LOADING:
      return {
        ...state,
        dashboardBlocksData: { loading: true, value: {} },
      };
    case SET_DASHBOARD_BLOCKS:
      return {
        ...state,
        dashboardBlocksData: { loading: false, value: action.payload },
      };
    case DASHBOARD_BALANCE_LOADING:
      return {
        ...state,
        dashboardBalance: { loading: true, value: {} },
      };
    case SET_DASHBOARD_BALANCE:
      return {
        ...state,
        dashboardBalance: { loading: false, value: action.payload },
      };
    case DASHBOARD_CUSTOMER_LOADING:
      return {
        ...state,
        dashboardCustomer: { loading: true, value: {} },
      };
    case SET_DASHBOARD_CUSTOMER:
      return {
        ...state,
        dashboardCustomer: { loading: false, value: action.payload },
      };
    case DASHBOARD_EMPLOYEE_LOADING:
      return {
        ...state,
        dashboardEmployee: { loading: true, value: {} },
      };
    case SET_DASHBOARD_EMPLOYEE:
      return {
        ...state,
        dashboardEmployee: { loading: false, value: action.payload },
      };
    case DASHBOARD_EXPENSE_LOADING:
      return {
        ...state,
        dashboardExpense: { loading: true, value: {} },
      };
    case SET_DASHBOARD_EXPENSE:
      return {
        ...state,
        dashboardExpense: { loading: false, value: action.payload },
      };
    case DASHBOARD_PROFIT_LOSS_LOADING:
      return {
        ...state,
        dashboardProfitLoss: { loading: true, value: {} },
      };
    case SET_DASHBOARD_PROFIT_LOSS:
      return {
        ...state,
        dashboardProfitLoss: { loading: false, value: action.payload },
      };
    case DASHBOARD_SALES_LOADING:
      return {
        ...state,
        dashboardSales: { loading: true, value: {} },
      };
    case SET_DASHBOARD_SALES:
      return {
        ...state,
        dashboardSales: { loading: false, value: action.payload },
      };
    case DASHBOARD_INCOME_LOADING:
      return {
        ...state,
        dashboardIncome: { loading: true, value: {} },
      };
    case SET_DASHBOARD_INCOME:
      return {
        ...state,
        dashboardIncome: { loading: false, value: action.payload },
      };
    default:
      return state;
  }
};
