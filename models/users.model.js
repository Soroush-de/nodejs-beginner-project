const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");
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
  const founded = await userCollection.findOne({ id: String(id) });
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
  const founded = await userCollection.findOneAndDelete({ id: String(id) });
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
      { id: String(user?.id) },
      { $set: user },
    );
    return res;
  }
  if (!user?.id) {
    const res = await userCollection?.insertOne({ ...user, id: randomUUID() });
    return res;
  }
}
async function userMultiSave(usersList) {
  if (!usersList?.length || !Array.isArray(usersList)) return [];

  try {
    const db = await connectToMongo();
    const userCollection = db.collection("users");

    const usersListFormat = usersList?.map((item) => ({
      ...item,
      id: randomUUID(),
    }));
    const saved = await userCollection.insertMany(usersListFormat);
    return saved;
  } catch (error) {
    throw new Error(error);
  }
}
async function userMultiUpdate(usersList) {
  if (!usersList?.length || !Array.isArray(usersList)) return [];
  try {
    const db = await connectToMongo();
    const userCollection = db.collection("users");
    let updatedList = [];
    for (const user of usersList) {
      const updated = await userCollection.updateOne(
        { id: String(user?.id) },
        { $set: user },
      );
      updatedList?.push(updated);
    }
    return updatedList;
  } catch (err) {
    throw new Error(err);
  }
}
module.exports.userModels = {
  userGetById,
  userDeleteById,
  userGetList,
  userSave,
  userMultiUpdate,
  userMultiSave,
};
