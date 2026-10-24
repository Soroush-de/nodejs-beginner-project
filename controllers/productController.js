const { productModels } = require("../models/products.model");

async function get(res, searchParams) {
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
    res.end(
      JSON.stringify({
        message: "there is an error in products get request",
        error: err,
        statusCode: 500,
      }),
    );
  }
}
async function getById(res, id) {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const productById = await productModels.productGetById(id);
    res.end(JSON.stringify(productById));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end(
      JSON.stringify({
        message: "there is an error in products getById request",
        error: err,
        statusCode: 500,
      }),
    );
  }
}
async function deleteById(res, id) {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const deletedProduct = await productModels.productDeleteById(id);
    res.end(JSON.stringify(deletedProduct));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end(
      JSON.stringify({
        message: "there is an error in products delete request",
        error: err,
        statusCode: 500,
      }),
    );
  }
}
async function save(res, product) {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const saved = await productModels.saveProduct(product);
    return res.end(JSON.stringify(saved));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end(
      JSON.stringify({
        message: "there is an error in products save request",
        error: error,
        statusCode: 500,
      }),
    );
  }
}
async function multiSave(prodctsList, res) {
  if (!Array?.isArray(prodctsList)) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        message: "invalid type for productsList",
        statusCode: 500,
      }),
    );
  }
  if (!prodctsList?.length) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        message: "empty list in not valid",
        statusCode: 500,
      }),
    );
  }
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const saved = await productModels.productMultiSave(prodctsList);
    res.end(
      JSON.stringify({
        message: "Success",
        statusCode: 200,
        data: saved,
      }),
    );
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        message: "error in save product controller",
        statusCode: 500,
        error,
      }),
    );
  }
}
module.exports.productControllers = {
  get,
  deleteById,
  getById,
  save,
  multiSave,
};
