const { productModels } = require("../models/products.model");

async function get(res = null, searchParams) {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const productList = await productModels.productGetList({
      searchParams,
    });
    res.end(JSON.stringify(productList));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1> Error </h1>");
  }
}
async function getById(res, id) {
  
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const productById = await productModels.productGetById(id);
    res.end(JSON.stringify(productById));
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1> Error </h1>");
  }
}
async function deleteById(res, id) {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const deletedProduct = await productModels.productDeleteById(id);
    res.end(JSON.stringify(deletedProduct));
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1> Error </h1>");
  }
}
module.exports.productControllers = {
  get,
  deleteById,
  getById,
};
