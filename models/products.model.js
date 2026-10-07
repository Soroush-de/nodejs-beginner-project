const fs = require("fs/promises");
const { productServices } = require("../services/productServices");
async function productGetList({ searchParams }) {
  const price = searchParams.get("price");
  const title = searchParams.get("title");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const stock = searchParams.get("stock");
  const sort = searchParams.get("sort");
  const sortType = searchParams.get("sortType");
  const search = searchParams.get("search");
  const { filterByQueries, filterBySearch, sortProducts } = productServices;
  const productList = await fs
    .readFile("../nodejs-beginner-project/db/products.json", "utf-8")
    .then((data) => filterBySearch({ products: JSON.parse(data), search }))
    .then((data) =>
      filterByQueries({
        products: data,
        price,
        title,
        category,
        brand,
        stock,
      }),
    )
    .then((data) =>
      sortProducts({ products: data, sort, sortType: sortType ? sortType : 1 }),
    );

  return productList;
}

async function productGetById(id) {
  if (!id) return console.error("id is required");
  const product = await fs
    .readFile("../nodejs-beginner-project/db/products.json", "utf-8")
    ?.then((data) => JSON?.parse(data)?.find((item) => item?.id == id));
  return product;
}

async function productDeleteById(id) {
  if (!id) throw new Error("id is required");

  const data = await fs.readFile(
    "../nodejs-beginner-project/db/products.json",
    "utf-8",
  );

  const products = JSON.parse(data);

  const deletedProduct = products.find((item) => item.id == id);

  await fs.writeFile(
    "../nodejs-beginner-project/db/products.json",
    JSON.stringify(products.filter((item) => item.id != id)),
  );

  return deletedProduct;
}
module.exports.productModels = {
  productDeleteById,
  productGetById,
  productGetList,
};
