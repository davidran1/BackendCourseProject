// test/costManager.test.js
import mocha from 'mocha';
const { before, after, describe, it, expect } = mocha;
import request from "supertest";
import app from "./index.js"; // Your Express app
import mongoose from "mongoose";
import CostModel from "./models/cost.model.js";
//import UserModel from "../models/user"; // The user model
import { connectDB } from "./utils/db.js";

// Test suite for POST /api/add (Adding a Cost Item)
describe("POST /api/add", () => {
  it("should add a new cost item and return the created cost item", async () => {
    const newCost = {
      description: "Lunch",
      category: "Food",
      userid: "123123",
      sum: 10,
    };

    const response = await request(app)
      .post("/api/add")
      .send(newCost)
      .expect(200); // Status code 200 for successful creation

    // Validate response data
    expect(response.body.description).toBe("Lunch");
    expect(response.body.category).toBe("Food");
    expect(response.body.userid).toBe("123123");
    expect(response.body.sum).toBe(10);

    // Optionally check if the data was actually inserted in MongoDB
    const costItem = await CostModel.findById(response.body._id);
    expect(costItem).not.toBeNull();
    expect(costItem.sum).toBe(10);
  });

  it("should return an error if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/add")
      .send({ description: "Missing category" })
      .expect(400); // Expect error code 400 for bad request

    expect(response.body.error).toBeTruthy();
  });
});

// Test suite for GET /api/report (Getting Monthly Report)
describe("GET /api/report", () => {
  it("should return the correct monthly report for a user", async () => {
    const response = await request(app)
      .get("/api/report?id=123123&year=2025&month=01")
      .expect(200);

    expect(response.body).toHaveProperty("categories");
    expect(response.body.categories.food).toBeDefined(); // Check for categories
  });

  it("should return an error for invalid user id", async () => {
    const response = await request(app)
      .get("/api/report?id=invalidid&year=2025&month=01")
      .expect(400); // Bad request

    expect(response.body.error).toBeTruthy();
  });
});

// Test suite for GET /api/users/{id} (Getting User Details)
describe("GET /api/users/:id", () => {
  it("should return user details along with the total cost", async () => {
    const userId = "123123";
    const response = await request(app).get(`/api/users/${userId}`).expect(200);

    expect(response.body.id).toBe(userId);
    expect(response.body.first_name).toBeDefined();
    expect(response.body.last_name).toBeDefined();
    expect(response.body.total).toBeDefined();
  });

  it("should return an error for an invalid user id", async () => {
    const response = await request(app).get("/api/users/invalidid").expect(400);

    expect(response.body.error).toBeTruthy();
  });
});

// Test suite for GET /api/about (Getting Developer Team Info)
describe("GET /api/about", () => {
  it("should return a list of team members", async () => {
    const response = await request(app).get("/api/about").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0); // Check for at least one team member
  });
});

// Before each test, we can connect to an in-memory MongoDB database or a mock database
before(async () => {
  // Connect to in-memory MongoDB
  connectDB();
});
