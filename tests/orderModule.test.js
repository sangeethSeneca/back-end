const { validateOrderPayload } = require("../modules/orderModule");

test("throws an error if order ID is missing", () => {
  const order = {
    customerName: "John Doe",
    products: [],
  };

  expect(() => {
    validateOrderPayload(order);
  }).toThrow("Order ID is mandatory");
});

test("throws an error if customer name is missing", () => {
  const order = {
    modelId: "12345",
    products: [],
  };

  expect(() => {
    validateOrderPayload(order);
  }).toThrow("Customer Name is mandatory");
});

test("throws an error if order is empty", () => {
  const order = {
    modelId: "12345",
    customerName: "John Doe",
    products: [],
  };

  expect(() => {
    validateOrderPayload(order);
  }).toThrow("Order cannot be empty");
});

test("does not throw an error if all required fields are present and order is not empty", () => {
  const order = {
    modelId: "12345",
    customerName: "John Doe",
    products: [
      { productId: "1", productName: "Product A", price: 100 },
      { productId: "2", productName: "Product B", price: 200 },
    ],
  };

  expect(() => {
    validateOrderPayload(order);
  }).not.toThrow();
});
