const fs = require("fs/promises");
async function productsGetList() {
  try { 
    const data = await fs.readFile("./products.json" , "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {
      message: "There is an error in getProductList",
      error: error,
      statusCode: 500,
    };
  }
}
async function productGetById({ id }) {
  if (!id) {
    return {
      message: "Id is required",
      statusCode: 400,
    };
  }
  try {
    const productList = await productsGetList();
    const founded = productList?.find((item) => item?.id == id);
    if (!founded) {
      return {
        message: "Product not found",
        statusCode: 404,
      };
    }
    return founded;
  } catch (error) {
    return {
      error,
      message: "There is an error in productGetById",
      statusCode: 500,
    };
  }
}
module.exports.productsGetList = productsGetList;
module.exports.productGetById = productGetById;
