const fs = require("fs/promises");
const path = require("path");

const { userServices } = require("../services/userServices");
const { connectToMongo } = require("../config/connect_to_mongo");

const usersPath = path.join(__dirname, "../db/users.json");
async function getCollections(db, collection_name) {
  return await db.collection(collection_name);
}
async function getAllUsersList() {
  const db = await connectToMongo();
  const userCollection = db.collection("users");
  return userCollection?.find({})?.toArray();
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
  if (id == null || id === "" || !Number.isSafeInteger(id)) {
    throw new Error("valid id is required");
  }
  const db = await connectToMongo();
  const userCollection = db.collection("users");
  const founded = await userCollection.findOne({ id: Number(id) });
  if (!founded) {
    throw new Error("user not found");
  }
  return founded;
}

async function userDeleteById(id) {
  if (id == null || id === "" || !Number.isSafeInteger(id)) {
    throw new Error("valid id is required");
  }
  const ds = await connectToMongo();
  const userCollection = ds.collection("users");
  const founded = await userCollection.findOneAndDelete({ id: Number(id) });
  if (!founded) {
    throw new Error("user not found");
  }
  return founded;
}
async function userSave(user) {
  if (
    user === null ||
    typeof user !== "object" ||
    Array.isArray(user) ||
    !user?.name
  ) {
    throw new TypeError("user must be a valid object");
  }
  const db = await connectToMongo();
  const userCollection = db.collection("users");
  if (user?.id) {
    const res = await userCollection.updateOne(
      { id: Number(user?.id) },
      { $set: user },
    );
    return res;
  }
  if (!user?.id) {
    const res = await userCollection?.insertOne({ ...user, id: Date.now() });
    return res;
  }
}
module.exports.userModels = {
  userGetById,
  userDeleteById,
  userGetList,
  userSave,
};
