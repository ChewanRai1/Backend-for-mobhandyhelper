//fir sending rquest
const request = require("supertest");

//server main file(index.js)
const app = require("../index");

//Making test collection
//describe is the collection of test cases
// (It) is a function that is used to define a test case
describe("API Testing", () => {
  //Test case 1(/test)
  it("GET/test|Response text", async () => {
    //making api request to /test
    const response = await request(app).get("/test");
    //out response should have 200 status code
    expect(response.statusCode).toBe(200);

    //Test Api is working...
    expect(response.text).toEqual("Test API is working....!");
  });

  // get all services
  it("GET/api/service/get_all_services | Fetch all services", async () => {
    const response = await request(app).get("/api/service/get_all_services");
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("service fetched successfully!");
  });

  //Register API- Post
  it("POST/api/user/create | Response with message", async () => {
    const response = await request(app).post("/api/user/create").send({
      firstName: "Chewan",
      lastName: "Rai",
      email: "crai@gmail.com",
      password: "123qwe",
    });

    //id already exist
    if (!response.body.success) {
      expect(response.body.message).toEqual("User Already Exists!");
    } else {
      expect(response.statusCode).toBe(200);
      expect(response.body)
        .expect(response.body.message)
        .toEqual("User Created successfully");
    }
  });
});

//Task
//Login test
//Update service(try)
