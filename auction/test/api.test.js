const request = require("supertest");
const app = require("../bin/app");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

var user_cookie =
  "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM5NWVmYWY3MzZmYmVjMDU4NDFhYjI2Iiwicm9sZSI6InVzZXIifSwiaWF0IjoxNjcwNzcwODQ4fQ.lI3NPm6KL7pTjquk4I3S9TAePAY_jo1EEj56kdl1CSM; Path=/; Secure; Expires=Mon, 12 Dec 2022 07:40:48 GMT;";

var admin_cookie =
  "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjBjMWMxZjBlMWIwYTQwMDE1YTFmMWIwamFodXlzIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY3MDY3NzI3MSwiZXhwIjoxNzMwNjc3MjcxfQ.3AoykqMhKn00PyzFDQw4gWDtRFZBUWULYrA2xzRoEfI; Path=/; Secure; HttpOnly; Expires=Sun, 11 Dec 2022 05:41:11 GMT;";

var auction_id1 = "";
var auction_id2 = "";

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

async function dropAllCollections() {
  const collection = mongoose.connection.collections["auctions"];
  try {
    await collection.drop();
  } catch (error) {
    if (error.message === "ns not found") return;
    if (error.message.includes("a background operation is currently running"))
      return;

    console.log(error.message);
  }
}

// Disconnect Mongoose
afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});

describe("Post Create Auction /create_auction", () => {
  describe("Only Admin Can Create Auction", () => {
    it("1st Succesful Registration should return 200 OK", async () => {
      const res = await request(app)
        .post("/create_auction")
        .send({
          name: "Auction 1",
          description: "First Auction ever",
          startingPrice: "400",
          endDate: "2022-12-17",
        })
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(200);
    });
    it("2nd Succesful Registration should return 200 OK", async () => {
      const res = await request(app)
        .post("/create_auction")
        .send({
          name: "Auction 2",
          description: "Second Auction ever",
          startingPrice: "500",
          endDate: "2022-12-17",
        })
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(200);
    });
    it("3rd Succesful Registration should return 200 OK", async () => {
      const res = await request(app)
        .post("/create_auction")
        .send({
          name: "Auction 3",
          description: "Third Auction ever",
          startingPrice: "300",
          endDate: "2022-12-17",
        })
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(200);
    });
    it("Create Auction With End Date Less Than Current Date should return 400 OK", async () => {
      const res = await request(app)
        .post("/create_auction")
        .send({
          name: "Auction 4",
          description: "Fourth Auction ever",
          startingPrice: "300",
          endDate: "2021-12-11",
        })
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(400);
    });
    it("Create Auction Without Authentication should return 401 OK", async () => {
      const res = await request(app).post("/create_auction").send({
        name: "Auction 4",
        description: "Fourth Auction ever",
        startingPrice: "300",
        endDate: "2021-12-17",
      });
      expect(res.statusCode).toEqual(401);
    });
    it("Create Auction With User Authentication should return 401 OK", async () => {
      const res = await request(app)
        .post("/create_auction")
        .send({
          name: "Auction 4",
          description: "Fourth Auction ever",
          startingPrice: "300",
          endDate: "2021-12-17",
        })
        .set("Cookie", [user_cookie]);
      expect(res.statusCode).toEqual(401);
    });
  });
});

describe("Get All Auction /all_auctions", () => {
  describe("Only Admin Can Get All Auctions", () => {
    it("Succesful Get All Auctions should return 200 OK", async () => {
      const res = await request(app)
        .get("/all_auctions")
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(200);
      console.log(res.body);
    });
    it("User Get All Auctions should return 401 OK", async () => {
      const res = await request(app)
        .get("/all_auctions")
        .set("Cookie", [user_cookie]);
      expect(res.statusCode).toEqual(401);
      console.log(res.body);
    });
    it("Without Authentication Get All Auction should return 401 OK", async () => {
      const res = await request(app).get("/all_auctions");
      expect(res.statusCode).toEqual(401);
      console.log(res.body);
    });
  });
});

describe("Get Current Auction /current_auction", () => {
  describe("Only User Can Get Current Auction", () => {
    it("Succesful Get Current Auction should return 200 OK", async () => {
      const res = await request(app)
        .get("/current_auction")
        .set("Cookie", [user_cookie]);
      auction_id1 = res.body.result[0]._id;
      auction_id2 = res.body.result[1]._id;
      expect(res.statusCode).toEqual(200);
    });
    it("Admin Get Current Auction should return 401 OK", async () => {
      const res = await request(app)
        .get("/current_auction")
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(401);
      console.log(res.body);
    });
    it("Without Authentication Get Current Auction should return 401 OK", async () => {
      const res = await request(app).get("/current_auction");
      expect(res.statusCode).toEqual(401);
      console.log(res.body);
    });
  });
});

describe("Put Update Auction /update_auction/:id", () => {
  describe("Only Admin Can Update Auction", () => {
    it("Succesful Update Auction should return 200 OK", async () => {
      const res = await request(app)
        .put(`/update_auction/${auction_id1}`)
        .send({
          name: "Auction Updated 1",
          description: "Updated Auction 1",
          startingPrice: "400",
          endDate: "2022-12-17",
        })
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(200);
    });
    it("Update Auction With End Date Less Than Current Date should return 400 OK", async () => {
      const res = await request(app)
        .put(`/update_auction/${auction_id2}`)
        .send({
          name: "Auction Updated 2",
          description: "Updated Auction 2",
          startingPrice: "400",
          endDate: "2021-12-10",
        })
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(400);
    });
    it("Update Auction Without Authentication should return 401 OK", async () => {
      const res = await request(app)
        .put(`/update_auction/${auction_id2}`)
        .send({
          name: "Auction Update",
          description: "Update Auction ever",
          startingPrice: "400",
          endDate: "2021-12-17",
        });
      expect(res.statusCode).toEqual(401);
    });
    it("Update Auction With User Authentication should return 401 OK", async () => {
      const res = await request(app)
        .put(`/update_auction/${auction_id2}`)
        .send({
          name: "Auction Update",
          description: "Update Auction ever",
          startingPrice: "400",
          endDate: "2021-12-17",
        })
        .set("Cookie", [user_cookie]);
      expect(res.statusCode).toEqual(401);
    });
  });
});

// describe("POST /register", () => {
//     it("1st Succesful Registration should return 200 OK", async () => {
//       const res = await request().post("http://localhost:8000/register").send({
//         name: "Dhiraj",
//         email: "test5@gmail.com",
//         password: "Pass@123",
//         cpassword: "Pass@123",
//       });
//       expect(res.statusCode).toEqual(200);
//     });
//     it("2nd Succesful Registration should return 200 OK", async () => {
//       const res = await request().post("http://localhost:8000/register").send({
//         name: "Gameon",
//         email: "test1@gmail.com",
//         password: "Pass@123",
//         cpassword: "Pass@123",
//       });
//       expect(res.statusCode).toEqual(200);
//     });
//     it("3rd Succesful Registration should return 200 OK", async () => {
//       const res = await request().post("http://localhost:8000/register").send({
//         name: "Internship",
//         email: "test2@gmail.com",
//         password: "Pass@123",
//         cpassword: "Pass@123",
//       });
//       expect(res.statusCode).toEqual(200);
//     });
//     it("Registration Using Admin Email should return 422 OK", async () => {
//       const res = await request().post("http://localhost:8000/register").send({
//         name: "Dhiraj",
//         email: "admin@gmail.com",
//         password: "Pass@123",
//         cpassword: "Pass@123",
//       });
//       expect(res.statusCode).toEqual(422);
//     });
//     it("Fill All Details should return 422 OK", async () => {
//       const res = await request().post("http://localhost:8000/register").send({
//         name: "Dhiraj",
//         email: "",
//       });
//       expect(res.statusCode).toEqual(422);
//     });
//     it("User Exist should return 422 OK", async () => {
//       const res = await request().post("http://localhost:8000/register").send({
//         name: "Dhiraj",
//         email: "test5@gmail.com",
//         password: "Pass@123",
//         cpassword: "Pass@123",
//       });
//       expect(res.statusCode).toEqual(422);
//     });
//   });

//   describe("POST /login", () => {
//     it("Succesful User Login should return 200 OK", async () => {
//       const res = await request().post("http://localhost:8000/login").send({
//         email: "test5@gmail.com",
//         password: "Pass@123",
//       });
//       user_cookie = res.headers["set-cookie"][0];
//       expect(res.statusCode).toEqual(200);
//     });
//     it("Succesful Admin Login should return 200 OK", async () => {
//       const res = await request().post("http://localhost:8000/login").send({
//         email: "admin@gmail.com",
//         password: "admin12345",
//       });
//       admin_cookie = res.headers["set-cookie"][0];
//       expect(res.statusCode).toEqual(200);
//     });
//     it("Fill All Details should return 400 OK", async () => {
//       const res = await request().post("http://localhost:8000/login").send({
//         email: "",
//         password: "Pass@123",
//       });
//       expect(res.statusCode).toEqual(400);
//     });
//     it("Invalid Credential Of User should return 400 OK", async () => {
//       const res = await request().post("http://localhost:8000/login").send({
//         email: "test5@gmail.com",
//         password: "Pass@12",
//       });
//       expect(res.statusCode).toEqual(400);
//     });
//     it("Invalid Credential Of Admin should return 400 OK", async () => {
//       const res = await request().post("http://localhost:8000/login").send({
//         email: "admin@gmail.com",
//         password: "admin123",
//       });
//       expect(res.statusCode).toEqual(400);
//     });
//   });
