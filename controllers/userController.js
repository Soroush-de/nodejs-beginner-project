// const fs = require("fs/promises");
const { userModels } = require("../models/users.model");
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
module.exports.userController = {
  get,
  getById,
  deleteById,
  userSave,
  getRequestBody,
};
