import { app } from "../web_modules/hyperapp.js";
import {view, state, FetchComments} from "./page.js";

app({
  init: [state, FetchComments],
  view,
  node: document.querySelector("section")
});