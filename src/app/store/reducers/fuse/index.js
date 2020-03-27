import { combineReducers } from "redux";
import navigation from "./navigation.reducer";
import settings from "./settings.reducer";
import navbar from "./navbar.reducer";
import message from "./message.reducer";
import dialog from "./dialog.reducer";
import routes from "./routes.reducer";
import modal from "./modal.reducer";

const fuseReducers = combineReducers({
  navigation,
  settings,
  navbar,
  message,
  dialog,
  routes,
  modal
});

export default fuseReducers;
