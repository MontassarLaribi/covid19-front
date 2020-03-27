import { combineReducers } from "redux";
import fuse from "./fuse";
import informer from "./informerReducer";
import auth from "app/auth/store/reducers";
import quickPanel from "app/fuse-layouts/shared-components/quickPanel/store/reducers";

const createReducer = asyncReducers =>
  combineReducers({
    auth,
    informer,
    fuse,
    quickPanel,
    ...asyncReducers
  });

export default createReducer;
