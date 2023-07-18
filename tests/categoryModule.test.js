const { validateCategoryPayload } = require("../modules/categoryModule");

describe("validateCategoryPayload", () => {
  it("should throw an error if Category ID is missing", () => {
    const category = {
      categoryType: "exampleType",
    };

    expect(() => {
      validateCategoryPayload(category);
    }).toThrow("Category ID is mandatory");
  });

  it("should throw an error if Category Type is missing", () => {
    const category = {
      categoryId: "exampleId",
    };

    expect(() => {
      validateCategoryPayload(category);
    }).toThrow("Category Type is mandatory");
  });

  it("should not throw an error if both Category ID and Category Type are provided", () => {
    const category = {
      categoryId: "exampleId",
      categoryType: "exampleType",
    };

    expect(() => {
      validateCategoryPayload(category);
    }).not.toThrow();
  });
});
