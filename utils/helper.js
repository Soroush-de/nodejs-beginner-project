function methodHandler({ req, res, method }) {
  if (req.method?.toLowerCase()?.trim() !== method?.toLowerCase()?.trim()) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Method not allowed",
        statusCode: 403,
      }),
    );
    return true;
  }
  return false;
}
const routeMethods = {
  "/api/products/productsGetList": "GET",
  "/api/products/productGetById": "GET",
  "/api/products/deleteById": "DELETE",
  "/api/users/usersGetList": "GET",
  "/api/users/userGetById": "GET",
  "/api/users/userDeleteById": "DELETE",
  "/api/user/saveUser": "POST",
  "/api/products/saveProduct": "POST",
  "/api/user/multiSave": "POST",
  "/api/products/multiSave": "POST",
  "/api/products/deleteByIds": "POST",
  "/api/products/deleteAll": "DELETE",
};
module.exports = {
  methodHandler,
  routeMethods,
};
