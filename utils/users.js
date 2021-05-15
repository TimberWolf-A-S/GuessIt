let UserData = require('../models/userModel');
let RoomData = require('../models/roomModel');

const users = [];

// Join user to chat
function userJoin(id, username, room, score, role) {
  const user = { id, username, room, score, role };

  users.push(user);

  return user;
}

//Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

/**
 *
 * BACK END FUNCTIONALITY START
 *
 */

function GetRoomIdByName(roomname) {
  RoomData.find({ name: roomname })
    .exec()
    .then((r) => {
      const roomId = r[0].id;
      console.log('asd', roomId);
      return roomId;
    });
}

function GetUserIdByName(username) {
  UserData.find({ username: username })
    .exec()
    .then((x) => {
      const userId = x[0]._id;

      return userId;
    });
}

function DeleteUserFromRoom(roomId, userId) {
  RoomData.updateOne({ _id: roomId }, { $pull: { currentMembers: { $in: `${userId}` } } })
    .exec()
    .then(console.log(`User (${userId}) has been removed from Room: ${roomId}`));
}

function DeleteUser(userId) {
  UserData.deleteOne({ _id: userId }).exec();
}

function DisaggregateUserAndRoom(username, roomname) {
  UserData.find({ username: username })
    .exec()
    .then((docs) => {
      const userId = docs[0]._id;

      RoomData.find({ name: roomname })
        .exec()
        .then((r) => {
          const roomId = r[0]._id;
          DeleteUserFromRoom(roomId, userId);
        })
        .then(() => {
          DeleteUser(userId);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 *
 * BACK END FUNCTIONALITY END
 *
 */

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  DeleteUserFromRoom,
  DeleteUser,
  GetRoomIdByName,
  GetUserIdByName,
  DisaggregateUserAndRoom,
};
