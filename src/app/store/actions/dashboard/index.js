import dashboardApis from "../../../services/DashboardService";
import {
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
  SET_DASHBOARD_BLOCKS,
  DASHBOARD_BLOCKS_LOADING,
} from "../types";
import isEmpty from "app/helper/utils/isEmpty";

export const getDashboardData = () => async (dispatch) => {
  try {
    dispatch({ type: DASHBOARD_BALANCE_LOADING });
    dispatch({ type: DASHBOARD_CUSTOMER_LOADING });
    dispatch({ type: DASHBOARD_EMPLOYEE_LOADING });
    dispatch({ type: DASHBOARD_EXPENSE_LOADING });
    dispatch({ type: DASHBOARD_PROFIT_LOSS_LOADING });
    dispatch({ type: DASHBOARD_SALES_LOADING });
    dispatch({ type: DASHBOARD_INCOME_LOADING });
    dispatch({ type: DASHBOARD_BLOCKS_LOADING });
    let data = await dashboardApis.getDashboardData();
    if (!isEmpty(data)) {
      let dashboardBalanceData = {
        cashOnHand: data.cashBalance,
        bankDetails: data.bank,
      };
      dispatch(dispatchAction(SET_DASHBOARD_BALANCE, dashboardBalanceData));

      let dashboardSalesData = {
        totalSales: data.salesTotal,
      };
      dispatch(dispatchAction(SET_DASHBOARD_SALES, dashboardSalesData));

      let dashboardEmployeeData = {
        totalEmployee: data.expenseTotal,
      };
      dispatch(dispatchAction(SET_DASHBOARD_EMPLOYEE, dashboardEmployeeData));

      let dashboardCustomerData = {
        totalCustomer: data.customerCount,
      };
      dispatch(dispatchAction(SET_DASHBOARD_CUSTOMER, dashboardCustomerData));

      let dashboardProfitLossData = {
        totalProfitLoss: data.profitAndLoss,
      };
      dispatch(
        dispatchAction(SET_DASHBOARD_PROFIT_LOSS, dashboardProfitLossData)
      );

      let dashboardExpense = {
        totalExpense: data.expenseTotal,
      };
      dispatch(dispatchAction(SET_DASHBOARD_EXPENSE, dashboardExpense));

      let dashboardIncome = {
        totalIncome: data.incomeTotal,
      };
      dispatch(dispatchAction(SET_DASHBOARD_INCOME, dashboardIncome));
    }
    dispatch({ type: SET_DASHBOARD_BLOCKS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getTotalExpense = (request) => async (dispatch) => {
  try {
    let data = await dashboardApis.getTotalExpense(request);
    let dashboardExpense = {
      totalExpense: data,
    };
    dispatch(dispatchAction(SET_DASHBOARD_EXPENSE, dashboardExpense));
  } catch (err) {
    console.log(err);
  }
};

export const getTotalIncome = (request) => async (dispatch) => {
  try {
    let data = await dashboardApis.getTotalIncome(request);
    let dashboardIncome = {
      totalIncome: data,
    };
    dispatch(dispatchAction(SET_DASHBOARD_INCOME, dashboardIncome));
  } catch (err) {
    console.log(err);
  }
};

export const getTotalSales = (request) => async (dispatch) => {
  try {
    let data = await dashboardApis.getTotalSales(request);
    let dashboardSales = {
      totalSales: data,
    };
    dispatch(dispatchAction(SET_DASHBOARD_SALES, dashboardSales));
  } catch (err) {
    console.log(err);
  }
};
export const getTotalProfitLoss = (request) => async (dispatch) => {
  try {
    let data = await dashboardApis.getTotalProfitLoss(request);
    let dashboardProfitLoss = {
      totalProfitLoss: data,
    };
    dispatch(dispatchAction(SET_DASHBOARD_PROFIT_LOSS, dashboardProfitLoss));
  } catch (err) {
    console.log(err);
  }
};
export const getTotalEmployee = (request) => async (dispatch) => {
  try {
    let data = await dashboardApis.getTotalEmployee(request);
    let dashboardEmployee = {
      totalEmployee: data,
    };
    dispatch(dispatchAction(SET_DASHBOARD_EMPLOYEE, dashboardEmployee));
  } catch (err) {
    console.log(err);
  }
};
export const getNewCustomer = (request) => async (dispatch) => {
  try {
    let data = await dashboardApis.getNewCustomer(request);
    let dashboardCustomer = {
      totalCustomer: data,
    };
    dispatch(dispatchAction(SET_DASHBOARD_CUSTOMER, dashboardCustomer));
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
