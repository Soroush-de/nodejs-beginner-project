// const fs = require("fs/promises");
const { randomUUID } = require("crypto");
const { userModels } = require("../models/users.model");
const { userServices } = require("../services/userServices");
async function get({ searchParams, res }) {
  try {
    const userList = await userModels.userGetList({ searchParams });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(userList));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: err,
        status: 500,
        message: "There is an error in get user api",
      }),
    );
  }
}
async function getById({ id, res }) {
  try {
    const founded = await userModels.userGetById(id);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(founded));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: err,
        status: 500,
        message: "There is an error in get user by id api",
      }),
    );
  }
}
async function deleteById(id, res) {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const deleted = await userModels.userDeleteById(id);
    res.end(JSON.stringify(deleted));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error,
        status: 500,
        message: "There is an error in delete user by id api",
      }),
    );
  }
}
async function userSave(res, user) {
  try {
    res.statusCode = 200;
    const saved = await userModels.userSave(user);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(saved));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: err,
        status: 500,
        message: "There is an error in save user api",
      }),
    );
  }
}
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) return reject(new Error("Request body is empty"));
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

async function userMultiSave(usersList, res) {
  if (!Array.isArray(usersList)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        message: "type of users list must be an array",
        statusCode: 400,
      }),
    );
  }

  if (!usersList.length) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        message: "users list should not be empty",
        statusCode: 400,
      }),
    );
  }

  try {
    const userSave = usersList.filter((user) => !user?.id);
    const user_update = usersList.filter((user) => !!user?.id);

    const saved = await userModels.userMultiSave(userSave);
    const updated = await userModels.userMultiUpdate(user_update);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        message: "Success",
        statusCode: 200,
        data: {updated , saved},
      }),
    );
  } catch (error) {
    // throw new Error("error in multi user save: ", error);

    if (res.headersSent) {
      return;
    }

    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        message: "There is an error in user multiSave",
        error: error.message,
        statusCode: 500,
      }),
    );
  }
}
async function userDeleteAll({ res }) {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "appliction/json");
    const deleted = await userModels.deleteAll();
    return res.end(
      JSON.stringify({
        message: "Success",
        statusCode: 200,
        data: deleted,
      }),
    );
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "error in delete all users",
        error: error,
        statusCode: 500,
      }),
    );
  }
}
async function userDeleteByIds({ list, res }) {
  if (!Array.isArray(list) || !list.length) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        message: "error in user delete by ids",
        statusCode: 400,
        error: "list should not be empty or type of list is not valid",
      }),
    );
  }
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const deleted = await userModels.deleteByIds(list);
    res.end(
      JSON.stringify({
        message: "success",
        statusCode: 200,
        data: deleted,
      }),
    );
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "error in delete all users",
        error: error,
        statusCode: 500,
      }),
    );
  }
}
module.exports.userController = {
  get,
  getById,
  deleteById,
  userSave,
  getRequestBody,
  userMultiSave,
  userDeleteAll,
  userDeleteByIds,
};
