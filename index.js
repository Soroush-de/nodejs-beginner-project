const server = require("http").createServer();
const { productControllers } = require("./controllers/productController");
const { userController } = require("./controllers/userController");
server.on("request", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = url;

  if (req.url == "/favicon.ico") {
    return res.end();
  }
  switch (pathname) {
    case "/api/products/productsGetList":
      return productControllers.get(res, searchParams);

    case "/api/products/productGetById":
      return productControllers.getById(res, searchParams.get("id"));

    case "/api/products/deleteById":
      return productControllers.deleteById(res, searchParams.get("id"));

    case "/api/users/usersGetList":
      return userController.get({ res, searchParams });

    case "/api/users/userGetById":
      return userController.getById({
        id: searchParams.get("id"),
        res,
      });

    case "/api/users/userDeleteById":
      return userController.deleteById(searchParams.get("id"), res);
  }
  if (pathname == "/api/save/saveUser") {
    if (req.method !== "POST") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: "method not allowed",
        }),
      );
    }
    const user = await userController.getRequestBody(req);
    return await userController.userSave(res, user);
  }
  res.statusCode = 400;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1> Error </h1>");
});

server.listen(3000, "127.0.0.1");
