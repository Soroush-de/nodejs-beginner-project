const server = require("http").createServer();
const { productControllers } = require("./controllers/productController");
const { userController } = require("./controllers/userController");
server.on("request", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = url;

  if (req.url == "/favicon.ico") {
    return res.end();
  }
  if (pathname == "/api/products/productsGetList") {
    return productControllers.get(res, searchParams);
  } else if (pathname == "/api/products/productGetById") {
    return productControllers.getById(res, searchParams.get("id"));
  } else if (pathname == "/api/products/deleteById") {
    return productControllers.deleteById(res, searchParams.get("id"));
  } else if (pathname == "/api/users/usersGetList") {
    return userController.get({ res, searchParams });
  } else if (pathname == "/api/users/userGetById") {
    return userController.getById({ id: searchParams.get("id"), res });
  } else if (pathname == "/api/users/userDeleteById") {
    return userController.deleteById(searchParams.get("id"), res);
  }
  res.statusCode = 400;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1> Error </h1>");
});

server.listen(3000, "127.0.0.1");
