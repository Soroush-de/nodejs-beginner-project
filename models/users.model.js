const fs = require("fs/promises");
const path = require("path");

const { userServices } = require("../services/userServices");

const usersPath = path.join(__dirname, "../db/users.json");

async function getAllUsersList() {
  const userList = await fs.readFile(usersPath, "utf-8");

  return JSON.parse(userList);
}

async function userGetList({ searchParams }) {
  const userList = await getAllUsersList()
    .then((data) =>
      userServices.userGetListBySearch({ searchParams, userList: data }),
    )
    .then((data) =>
      userServices.userGetListBySort({ searchParams, userList: data }),
    )
    .then((data) =>
      userServices.userGetListByFilterQueries({ searchParams, userList: data }),
    );

  return userList;
}

async function userGetById(id) {
  if (!id) return console.error("id is required");

  const userList = await getAllUsersList();

  const founded = userList.find((item) => item?.id == id);

  if (!founded) return console.error("user not found");

  return founded;
}

async function userDeleteById(id) {
  if (!id) return console.error("id is required");

  const userList = await getAllUsersList();

  const founded = userList.find((item) => item?.id == id);

  if (!founded) return console.error("user not found");

  const filterList = userList.filter((item) => item?.id != id);

  await fs.writeFile(usersPath, JSON.stringify(filterList));

  return founded;
}

module.exports.userModels = {
  userGetById,
  userDeleteById,
  userGetList,
};
