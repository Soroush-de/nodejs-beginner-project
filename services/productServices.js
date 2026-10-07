const { enums } = require("../utils/enums");
const filterBySearch = ({ products, search }) => {
  if (!search) return products;
  let filterArray = [];
  for (const product of products) {
    for (const field in product) {
      if (
        String(product[String(field)])
          ?.toLowerCase()
          ?.trim()
          ?.includes(String(search)?.toLowerCase()?.trim())
      ) {
        filterArray.push(product);
        break;
      }
    }
  }

  return filterArray;
};
function sortProducts({ products, sort = null, sortType = 1 }) {
  if (!sort) return products;
  return products.sort((a, b) => {
    const aValue = a[sort];
    const bValue = b[sort];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortType == enums.SORT_TYPE_ENUM.ascending
        ? aValue - bValue
        : bValue - aValue;
    }

    return sortType == enums.SORT_TYPE_ENUM.ascending
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
}
function filterByQueries({
  products,
  price = null,
  title = null,
  category = null,
  brand = null,
  stock = null,
}) {
  const filters = {
    price,
    title,
    category,
    brand,
    stock,
  };

  return products.filter((product) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        return true;
      }

      return (
        String(product[key]).toLowerCase().trim() ===
        String(value).toLowerCase().trim()
      );
    });
  });
}
module.exports.productServices = {
  filterByQueries,
  sortProducts,
  filterBySearch,
};
