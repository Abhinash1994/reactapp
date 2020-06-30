import { combineReducers } from "redux";
import fuse from "./fuse";
import auth from "app/auth/store/reducers";
import quickPanel from "app/fuse-layouts/shared-components/quickPanel/store/reducers";
import branch from "./branch";
import setting from "./setting";
import dashboardReducer from "./dashboard";
import transactionReducer from "./transaction";
const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    fuse,
    quickPanel,
    branch,
    setting,
    dashboardReducer,
    transactionReducer,
    ...asyncReducers,
  });

export default createReducer;
