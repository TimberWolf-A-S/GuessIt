const http = require('http');
const axios = require('axios');
describe("Loading pages", () => {
    test("it should load the front page with http", done => {
        http.get("http://localhost:3000", response => {
                expect(response.statusCode).toBe(200);
                done();
        });
    });
    test("it should load the front page with axios", () => {
        axios.get("http://localhost:3000").then(response => {
            expect(response.statusCode).toBe(404);
        });
    })
});

describe("Loading image", () => {
    test("Should load image in helper with http", done => {
        http.get("http://localhost:3000/game/helper", response => {
                expect(response.statusCode).toBe(200);
                done();
        });
    });
    test("Should load image in helper with axios", () => {
        axios.get("http://localhost:3000/game/helper").then(response => {
            expect(response.statusCode).toBe(200);
        });
    })
});


const {MongoClient} = require('mongodb');

describe('insert user', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
        });
        db = await connection.db(global.__MONGO_DB_NAME__);
    });

    afterAll(async () => {
        await connection.close();
        await db.close();
    });

    it('should insert a doc into collection', async () => {
        const users = db.collection('users');

        const mockUser = {_id: 'some-user-id', name: 'John'};
        await users.insertOne(mockUser);

        const insertedUser = await users.findOne({_id: 'some-user-id'});
        expect(insertedUser).toEqual(mockUser);
    });
});


/*const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../views/index.js'), 'utf8');

jest
    .dontMock('fs');

describe('button', function () {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    afterEach(() => {
        // restore the original func after test
        jest.resetModules();
    });

    it('button exists', function () {
        expect(document.getElementById('disable')).toBeTruthy();
    });
});*/
