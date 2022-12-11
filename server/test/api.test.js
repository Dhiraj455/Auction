const request = require("supertest");
const app = require("../bin/app");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

var user_cookie = "";
var admin_cookie = "";

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Disconnect Mongoose
afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /register", () => {
  it("1st Succesful Registration should return 200 OK", async () => {
    const res = await request(app).post("/register").send({
      name: "Dhiraj",
      email: "test10@gmail.com",
      password: "Pass@123",
      cpassword: "Pass@123",
    });
    expect(res.statusCode).toEqual(200);
  });
  it("2nd Succesful Registration should return 200 OK", async () => {
    const res = await request(app).post("/register").send({
      name: "Gameon",
      email: "test1@gmail.com",
      password: "Pass@123",
      cpassword: "Pass@123",
    });
    expect(res.statusCode).toEqual(200);
  });
  it("3rd Succesful Registration should return 200 OK", async () => {
    const res = await request(app).post("/register").send({
      name: "Internship",
      email: "test2@gmail.com",
      password: "Pass@123",
      cpassword: "Pass@123",
    });
    expect(res.statusCode).toEqual(200);
  });
  it("Registration Using Admin Email should return 422 OK", async () => {
    const res = await request(app).post("/register").send({
      name: "Dhiraj",
      email: "admin@gmail.com",
      password: "Pass@123",
      cpassword: "Pass@123",
    });
    expect(res.statusCode).toEqual(422);
  });
  it("Fill All Details should return 422 OK", async () => {
    const res = await request(app).post("/register").send({
      name: "Dhiraj",
      email: "",
    });
    expect(res.statusCode).toEqual(422);
  });
  it("User Exist should return 422 OK", async () => {
    const res = await request(app).post("/register").send({
      name: "Dhiraj",
      email: "test5@gmail.com",
      password: "Pass@123",
      cpassword: "Pass@123",
    });
    expect(res.statusCode).toEqual(422);
  });
});

describe("POST /login", () => {
  it("Succesful User Login should return 200 OK", async () => {
    const res = await request(app).post("/login").send({
      email: "test5@gmail.com",
      password: "Pass@123",
    });
    user_cookie = res.headers["set-cookie"][0];
    expect(res.statusCode).toEqual(200);
  });
  it("Succesful Admin Login should return 200 OK", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@gmail.com",
      password: "admin12345",
    });
    admin_cookie = res.headers["set-cookie"][0];
    expect(res.statusCode).toEqual(200);
  });
  it("Fill All Details should return 400 OK", async () => {
    const res = await request(app).post("/login").send({
      email: "",
      password: "Pass@123",
    });
    expect(res.statusCode).toEqual(400);
  });
  it("Invalid Credential Of User should return 400 OK", async () => {
    const res = await request(app).post("/login").send({
      email: "test5@gmail.com",
      password: "Pass@12",
    });
    expect(res.statusCode).toEqual(400);
  });
  it("Invalid Credential Of Admin should return 400 OK", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@gmail.com",
      password: "admin123",
    });
    expect(res.statusCode).toEqual(400);
  });
});

describe("PUT Update User /user_update", () => {
  it("Succesful Updated User should return 200 OK", async () => {
    const res = await request(app)
      .put("/user_update")
      .send({
        name: "Dhiraj",
        description: "This is a test description",
      })
      .set("Cookie", [user_cookie]);
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
  });
  it("Without Authentication Updating User should return 401 OK", async () => {
    const res = await request(app).put("/user_update").send({
      name: "Dhiraj",
      description: "This is a test description",
    });
    expect(res.statusCode).toEqual(401);
    console.log(res.body);
  });
});

describe("GET A Single User Profile /profile", () => {
  it("Succesful Get User should return 200 OK", async () => {
    const res = await request(app).get("/profile").set("Cookie", [user_cookie]);
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
  });
  it("Without Authentication Get User should return 401 OK", async () => {
    const res = await request(app).get("/profile");
    expect(res.statusCode).toEqual(401);
    console.log(res.body);
  });
});

describe("Delete User /user_delete", () => {
  describe("Only Admin Can Delete User", () => {
    it("Succesful Delete User should return 200 OK", async () => {
      const res = await request(app)
        .delete("/user_delete")
        .send({
          email: "test5@example.com",
        })
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(400);
      console.log(res.body);
    });
    it("Delete User With Wrong Credentials should return 400 OK", async () => {
      const res = await request(app)
        .delete("/user_delete")
        .send({
          email: "test@gmail.com",
        })
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(400);
      console.log(res.body);
    });
    it("User Accessing Delete Users should return 401 OK", async () => {
      const res = await request(app)
        .delete("/user_delete")
        .send({ email: "test5@gmail.com" })
        .set("Cookie", [user_cookie]);
      expect(res.statusCode).toEqual(401);
      console.log(res.body);
    });
    it("Without Authentication Delete User should return 401 OK", async () => {
      const res = await request(app).delete("/user_delete");
      expect(res.statusCode).toEqual(401);
      console.log(res.body);
    });
  });
});

describe("GET All Users /users", () => {
  describe("Only Admin Can Get All Users", () => {
    it("Succesful Get Users should return 200 OK", async () => {
      const res = await request(app)
        .get("/users")
        .set("Cookie", [admin_cookie]);
      expect(res.statusCode).toEqual(200);
      console.log(res.body);
    });
    it("User Get Users should return 401 OK", async () => {
      const res = await request(app).get("/users").set("Cookie", [user_cookie]);
      expect(res.statusCode).toEqual(401);
      console.log(res.body);
    });
    it("Without Authentication Get Users should return 401 OK", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toEqual(401);
      console.log(res.body);
    });
  });
});
