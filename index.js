const server = require("http").createServer();

const url = require("url");

const { userGetById, userGetBySearchList } = require("./userController");

const { productsGetList, productGetById } = require("./productController");

server.on("request", async (req, res) => {
  if (req.url == "/favicon.ico") {
    return;
  }

  const { pathname, query } = url.parse(req.url, true);

  if (pathname == "/api/users/usersGetList") {
    try {
      const users = await userGetBySearchList({
        search: query.q,
        sort: query.sort,
        sortType: query.sortType,
      });

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");

      return res.end(JSON.stringify(users));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");

      return res.end(
        JSON.stringify({
          message: "There is an error in userGetList api",
          error: err.message,
          status: 500,
        }),
      );
    }
  }

  if (pathname == "/api/users/userGetById") {
    try {
      const foundedById = await userGetById({
        id: query.id,
      });

      res.statusCode = foundedById?.status || 200;
      res.setHeader("Content-Type", "application/json");

      return res.end(JSON.stringify(foundedById));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");

      return res.end(
        JSON.stringify({
          message: "There is an error in userGetById api",
          error: err.message,
          status: 500,
        }),
      );
    }
  }

  if (pathname == "/api/products/productsGetList") {
    try {
      const productList = await productsGetList();

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");

      return res.end(JSON.stringify(productList));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");

      return res.end(
        JSON.stringify({
          message: "There is an error in productGetList api",
          error: err.message,
          status: 500,
        }),
      );
    }
  }

  if (pathname == "/api/products/productGetById") {
    try {
      const foundedById = await productGetById({
        id: query.id,
      });

      res.statusCode = foundedById?.status || 200;
      res.setHeader("Content-Type", "application/json");

      return res.end(JSON.stringify(foundedById));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");

      return res.end(
        JSON.stringify({
          message: "There is an error in productGetById api",
          error: err.message,
          status: 500,
        }),
      );
    }
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");

  return res.end(
    JSON.stringify({
      message: "Route not found",
      path: req.url,
      status: 404,
    }),
  );
});

server.listen(3000, "127.0.0.1");
