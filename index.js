const server = require("http").createServer();
const { productControllers } = require("./controllers/productController");
const { userController } = require("./controllers/userController");
const { methodHandler, routeMethods } = require("./utils/helper");
server.on("request", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = url;
  if (req.url == "/favicon.ico") {
    return res.end();
  }
  if (routeMethods?.[pathname] !== req.method) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        error: "Method not allowed",
        statusCode: 403,
      }),
    );
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
  if (pathname == "/api/user/saveUser") {
    if (methodHandler({ method: "POST", req, res })) return;
    try {
      const user = await userController.getRequestBody(req);
      return await userController.userSave(res, user);
    } catch (err) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: err.message, status: 400 }));
    }
  }
  if (pathname == "/api/product/saveProduct") {
    if (methodHandler({ method: "POST", req, res })) return;
    const product = await userController.getRequestBody(req);
    return await productControllers.save(res, product);
  }
  if (pathname === "/api/user/multiSave") {
    if (methodHandler({ req, res, method: "POST" })) return;
    try {
      const users = await userController.getRequestBody(req);
      return await userController.userMultiSave(users, res);
    } catch (error) {
      if (res.headersSent) return;
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          error: error.message,
          message: "There is an error in users multi save API",
          statusCode: 400,
        }),
      );
    }
  }
  if (pathname == "/api/products/multiSave") {
    if (methodHandler({ req, res, method: "POST" })) return;
    const productsData = await userController.getRequestBody(req);
    return await productControllers.multiSave(productsData, res);
  }
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1> request not found </h1>");
});

server.listen(3000, "127.0.0.1");
