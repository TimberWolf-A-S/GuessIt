const http = require("http");

let UserData = require("../models/userModel");
let RoomData = require("../models/roomModel");
let ImageData = require("../models/imageModel");

const dev_db_url = require('../MongoDB/connection');
let mongoose = require("mongoose");
let mongoDB = process.env.MONGODB_URI || dev_db_url;

describe("Loading pages", () => {
  test("Load front page", (done) => {
    http.get("http://localhost:3000", (response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  }),
    test("Load game page", (done) => {
      http.get("http://localhost:3000/game", (response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    }),
    test("Load help page", (done) => {
      http.get("http://localhost:3000/help", (response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    }),
    test("Load lobby page", (done) => {
      http.get("http://localhost:3000/lobby", (response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
});

describe("Loading image", () => {
  beforeAll(async () => {
    mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Load Helper Page", (done) => {
    http.get("http://localhost:3000/game/helper", (response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  }),
    it("Checks if hint is the same on the image", async () => {
      const fetchedRoom = await RoomData.findOne({ name: "Room 1" });
      const fetchedImage = await ImageData.findOne({ name: fetchedRoom.hint });
      expect(fetchedImage.name).toEqual(fetchedRoom.hint);
    }),
    it("Checks if there is an image assigned to room", async () => {
      const fetchedRoom = await RoomData.findOne({ name: "Room 1" });
      expect(fetchedRoom.image).not.toBe(null);
    });
});

const userInformation = {
  username: "Test User",
  room: "Test Room",
  role: "Tester",
  score: 0,
};

describe("Data Layer Tests", () => {
beforeEach(async () => {
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.Promise = Promise;
  await UserData.deleteMany({});
});

afterEach(async () => {
  // Wipes the users collection after each use.
  UserData.deleteMany({});
  await mongoose.connection.close();
});

// afterAll(async () => {
//   // Closes the connection to the db and wipes
//   UserData.deleteMany({});
//   await mongoose.connection.close();
// });

  it("can create a user", async () => {
    await new UserData(userInformation).save();
    const userCount = await UserData.countDocuments();
    expect(userCount).toEqual(1);
  }),
    it("can fetch a user document", async () => {
      const user = await new UserData(userInformation).save();
      const fetchedUser = await UserData.findOne({ _id: user._id });
      expect(user._id).toEqual(fetchedUser._id);
    }),
    it("can update a user document", async () => {
      const user = await new UserData(userInformation).save();
      const fetchedUser = await UserData.findOneAndUpdate(
        { _id: user._id },
        { $inc: { score: 1 } },
        { new: true }
      );
      expect(fetchedUser.score).toEqual(1);
    });
});