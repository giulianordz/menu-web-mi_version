import http from "node:http";
import { laHome, categoryPage, productPage } from "./pages.js";
import { resolvePage } from "./router.js";
import path from "node:path";
import { stat, readFile } from "node:fs/promises";
const PORT = process.env.PORT || 8000;

const routes = [
  {
    match: /^\/$/,
    resolver: laHome,
  },
  {
    match: /\/categorias\/\w+/g,
    resolver: categoryPage,
  },
  {
    match: /\/productos\/\w+/g,
    resolver: productPage,
  },
];

async function resolvePublic(req, res, next) {
  const url = req.url;
  // console.log(import.meta.url);
  const filePath = path.resolve("public/", url.slice(1));
  try {
    await stat(filePath);
    const fileContent = await readFile(filePath);
    res.end(fileContent);
  } catch (e) {
    return next(req, res);
  }
}

async function resolveRouter(req, res, next) {
  const html = await resolvePage(routes, req);
  if (html) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } else {
    res.statusCode = 404;
    res.end();
  }
  return true;
}

// Create a local server to receive data from
const server = http.createServer(async (req, res) => {
  await resolvePublic(req, res, resolveRouter);
});

server.listen(PORT, function () {
  console.log("Running on http://localhost:" + PORT);
});

console.log("No entiendo esto pero voy a hacer como si lo entendiera")
