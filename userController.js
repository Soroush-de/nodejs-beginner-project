const fs = require("fs/promises");
async function userGetList() {
  try {
    const data = await fs.readFile("./users.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return {
      message: "There is an error in userGetList",
      error: err,
      status: 500,
    };
  }
}
async function userGetById({ id }) {
  if (!id) {
    return {
      message: "id is required",
      status: 400,
    };
  }
  try {
    const userList = await userGetList();
    const founded = userList?.find((item) => item?.id == id);
    if (!founded) {
      return {
        message: "user not found in userGetById",
        // error: err,
        status: 404,
      };
    }
    return founded;
  } catch (err) {
    return {
      message: "There is an error in userGetById",
      error: err,
      status: 500,
    };
  }
}
async function userGetBySearchList({
  search = null,
  sort = null,
  sortType = 1,
}) {
  try {
    const userList = await userGetList();

    let result = userList;

    // SEARCH
    if (search) {
      const normalizedSearch = String(search).toLowerCase().trim();

      result = result.filter((user) => {
        if (sort) {
          return String(user[sort] ?? "")
            .toLowerCase()
            .trim()
            .includes(normalizedSearch);
        }

        return Object.entries(user).some(([key, value]) => {
          if (["isActive", "userBasket"].includes(key)) {
            return false;
          }
          return String(value).toLowerCase().trim().includes(normalizedSearch);
        });
      });
    }

    // SORT
    if (sort) {
      result.sort((a, b) => {
        const valueA = a[sort];
        const valueB = b[sort];

        if (valueA < valueB) {
          return sortType === 1 ? -1 : 1;
        }

        if (valueA > valueB) {
          return sortType === 1 ? 1 : -1;
        }

        return 0;
      });
    }

    return result;
  } catch (err) {
    return {
      message: "There is an error in userGetSearchList",
      error: err,
      status: 500,
    };
  }
}
module.exports.userGetList = userGetList;
module.exports.userGetById = userGetById;
module.exports.userGetBySearchList = userGetBySearchList;
