const { enums } = require("../utils/enums.js");
function userGetListBySearch({ userList, searchParams }) {
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  if (!search) return userList;
  let searchedList = [];
  if (!!sort) {
    for (const user of userList) {
      if (
        String(user[sort])
          ?.toLowerCase()
          ?.trim()
          ?.includes(search?.toLowerCase()?.trim())
      ) {
        searchedList.push(user);
        break;
      }
    }
  } else {
    for (const user of userList) {
      for (const key in user) {
        if (key == "userBasket" || key == "isActive") continue;
        if (
          String(user[key])
            ?.trim()
            ?.toLowerCase()
            ?.includes(String(search)?.toLowerCase()?.trim())
        ) {
          searchedList.push(user);
          break;
        }
      }
    }
  }
  return searchedList;
}
function userGetListBySort({ userList, searchParams }) {
  const sort = searchParams.get("sort");
  const sortType = searchParams.get("sortType") ?? 1;
  if (!sort) return userList;
  return userList?.sort((a, b) => {
    if (typeof a[sort] == "number" && typeof b[sort] == "number") {
      if (sortType == enums.SORT_TYPE_ENUM.ascending) {
        return a[sort] - b[sort];
      } else {
        return b[sort] - a[sort];
      }
    }
    return sortType == enums.SORT_TYPE_ENUM.ascending
      ? String(a[sort]).localeCompare(String(b[sort]))
      : String(b[sort]).localeCompare(String(a[sort]));
  });
}
function userGetListByFilterQueries({ searchParams, userList }) {
  const isActive = searchParams.get("isActive");
  const city = searchParams.get("city");

  if (!(city || isActive)) return userList;

  return userList.filter((user) => {
    if (city && isActive) {
      return (
        user?.city?.toLowerCase() === city.toLowerCase().trim() &&
        String(user?.isActive) === isActive
      );
    }

    if (city) {
      return user?.city?.toLowerCase() === city.toLowerCase().trim();
    }

    return String(user?.isActive) === isActive;
  });
}
module.exports.userServices = {
  userGetListBySearch,
  userGetListBySort,
  userGetListByFilterQueries,
};
