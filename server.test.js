const request = require("supertest");
const app = require("./server");

describe("GET /api/greeting", () => {
  it("should return a default greeting when no name is provided", async () => {
    const response = await request(app).get("/api/greeting");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, Anonymous!");
  });

  it("should return a customized greeting when a name is provided", async () => {
    const name = "John";
    const response = await request(app).get(`/api/greeting?name=${name}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe(`Hello, ${name}!`);
  });
});

describe("GET /products", () => {
  it("should return a product when product Id is provided", async () => {
    const response = await request(app).get("/products?product=-1");
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      '{"products":{"id":1223,"name":"A99-2C0","description":"Newest Bike released in 2023","price":"$ 266.25","image":"images/"}}'
    );
  });
});
