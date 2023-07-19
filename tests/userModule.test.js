const { validateUserPayload } = require("../modules/usersModule");

test("throws an error if user ID is missing", () => {
  const user = {
    userName: "John Doe",
    email: "john@example.com",
  };

  expect(() => {
    validateUserPayload(user);
  }).toThrow("User ID is mandatory");
});

test("throws an error if user name is missing", () => {
  const user = {
    userId: "12345",
    email: "john@example.com",
  };

  expect(() => {
    validateUserPayload(user);
  }).toThrow("User Name is mandatory");
});

test("throws an error if user email is missing", () => {
  const user = {
    userId: "12345",
    userName: "John Doe",
  };

  expect(() => {
    validateUserPayload(user);
  }).toThrow("User Email is mandatory");
});

test("does not throw an error if all required fields are present", () => {
  const user = {
    userId: "12345",
    userName: "John Doe",
    email: "john@example.com",
  };

  expect(() => {
    validateUserPayload(user);
  }).not.toThrow();
});
