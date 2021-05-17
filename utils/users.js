let UserData = require('../models/userModel');
let RoomData = require('../models/roomModel');

/**
 * Creates an empty user array
 */
const users = [];

/**
 * Join user to chat
 */
function userJoin(id, username, room, score) {
  const user = { id, username, room, score };

  // Pushes user into user array
  users.push(user);
  return user;
}

/**
 * Get current user
 */
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

/**
 * User leaves chat
 */
function userLeave(id) {
  // Find user in the user array
  const index = users.findIndex((user) => user.id === id);

  // Removes user
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

/**
 * Get room users
 */
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}


/**
 *
 * BACK END FUNCTIONALITY START
 *
 */

/**
 * Finds room ID
 */
function GetRoomIdByName(roomname) {
  RoomData.find({ name: roomname })
    .exec()
    .then((r) => {
      const roomId = r[0].id;
      return roomId;
    });
}

/**
 * Finds user ID
 */
function GetUserIdByName(username) {
  UserData.find({ username: username })
    .exec()
    .then((x) => {
      const userId = x[0]._id;
      return userId;
    });
}

/**
 * Delete user from room in MongoDB
 */
function DeleteUserFromRoom(roomId, userId) {
  RoomData.updateOne({ _id: roomId }, { $pull: { currentMembers: { $in: `${userId}` } } })
    .exec();
}

/**
 * Deletes user from MongoDB
 */
function DeleteUser(userId) {
  UserData.deleteOne({ _id: userId }).exec();
}

/**
 * Removes user from room, then from user 
 */
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
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          DeleteUser(userId);
        })
        .catch((err) => {
          console.log(err);
        })
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
  DisaggregateUserAndRoom,
};
