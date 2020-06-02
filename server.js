import express from "express";
import compression from "compression";
import {renderToString} from "hyperapp-render";
import fs from "fs";
import { state, view } from "./src/page.js";
import {fetchComments} from "./src/commentsHttpClient.js";
import "isomorphic-fetch";

const server = express();
const assetsDir = process.env.NODE_ENV === "production" ? "./build" : ".";
const htmlTemplate = fs.readFileSync(`${assetsDir}/index.html`, "UTF-8");
const headTemplate = fs.readFileSync(`${assetsDir}/head.html`, "UTF-8");
const bodyTemplate = fs.readFileSync(`${assetsDir}/body.html`, "UTF-8");
server.use(compression());
server.get("/ssr", async function(req, res) {
  const comments = await fetchComments();
  const content = renderToString(view({...state, comments}));
  res.send(htmlTemplate.replace("<section></section>", content));
});
server.get("/flush", async function(req, res) {
  res.write(headTemplate);
  res.flush();
  const comments = await fetchComments();
  setTimeout(function() {
    const content = renderToString(view({...state, comments}));
    res.end(bodyTemplate.replace("<section></section>", content));
  }, 5000);
});
server.get("/data.json", (req, res) => {
  fs.createReadStream("./data.json").pipe(res);
});
server.get("./data.ndjson", (req, res) => {
  fs.createReadStream("./data.ndjson").pipe(res);
});
server.use(express.static(assetsDir));

server.listen(3000, () => console.log("Example app listening on port 3000!"));