const { validateProductPayload } = require("../modules/productModule");

test("throws an error if model ID is missing", () => {
  const product = {
    modelName: "Product A",
    price: 100,
  };
  expect(() => {
    validateProductPayload(product);
  }).toThrow("Model ID is mandatory");
});

test("throws an error if model name is missing", () => {
  const product = {
    modelId: "12345",
    price: 100,
  };

  expect(() => {
    validateProductPayload(product);
  }).toThrow("Model Name is mandatory");
});

test("throws an error if model price is missing", () => {
  const product = {
    modelId: "12345",
    modelName: "Product A",
  };

  expect(() => {
    validateProductPayload(product);
  }).toThrow("Model Price is mandatory");
});

test("does not throw an error if all required fields are present", () => {
  const product = {
    modelId: "12345",
    modelName: "Product A",
    price: 100,
  };

  expect(() => {
    validateProductPayload(product);
  }).not.toThrow();
});
