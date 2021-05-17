const moment = require("moment");

/**
 * Used to format time when a message has been sent
 */
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
