const fs = require("fs/promises");
const { productServices } = require("../services/productServices");
const { connectToMongo } = require("../config/connect_to_mongo");
const { randomUUID } = require("crypto");
async function productGetList({ searchParams }) {
  const db = await connectToMongo();
  const productCollection = db.collection("products");
  const productListFromDataBase = await productCollection.find({}).toArray();
  const price = searchParams.get("price");
  const title = searchParams.get("title");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const stock = searchParams.get("stock");
  const sort = searchParams.get("sort");
  const sortType = searchParams.get("sortType");
  const search = searchParams.get("search");
  const { filterByQueries, filterBySearch, sortProducts } = productServices;

  const searched = filterBySearch({
    products: productListFromDataBase,
    search,
  });
  const filtered = filterByQueries({
    products: searched,
    price,
    title,
    category,
    brand,
    stock,
  });

  return sortProducts({
    products: filtered,
    sort,
    sortType: sortType ? sortType : 1,
  });
}
async function productGetById(id) {
  if (!id) throw new Error("id is required");
  const db = await connectToMongo();
  const productCollection = db.collection("products");
  const foundedById = await productCollection.findOne({ id: id });
  if (!foundedById) {
    throw new Error("product not found");
  }
  return foundedById;
}

async function productDeleteById(id) {
  if (!id) throw new Error("id is required");
  const db = await connectToMongo();
  const productCollection = db.collection("products");
  const deleted = await productCollection?.deleteOne({ id: String(id) });
  if (!deleted) {
    throw new Error("product not found");
  }
  return deleted;
}
async function saveProduct(product) {
  const db = await connectToMongo();
  const productCollection = db.collection("products");
  if (product?.id) {
    const updated = await productCollection?.updateOne(
      { id: String(product?.id) },
      { $set: product },
    );
    return updated;
  }
  if (!product?.id) {
    const saved = await productCollection?.insertOne({
      ...product,
      id: Date.now(),
    });
    return saved;
  }
}
async function productMultiSave(productsList) {
  if (
    !Array.isArray(productsList) ||
    productsList?.some((product) => product?.id)
  )
    return;
  const db = await connectToMongo();
  const productCollection = db.collection("products");
  const productsFormatted = productsList?.map((item) => {
    return {
      ...item,
      id: randomUUID(),
    };
  });
  const savedData = await productCollection?.insertMany(productsFormatted);
  const founded = await productCollection
    .find({
      _id: { $in: Object.values(savedData?.insertedIds) },
    })
    ?.toArray();
  return founded;
}
module.exports.productModels = {
  productDeleteById,
  productGetById,
  productGetList,
  saveProduct,
  productMultiSave,
};
