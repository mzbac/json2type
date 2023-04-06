import { generateTypeScriptTypes } from "./generateTypeScriptTypes";

describe("generateTypeScriptTypes", () => {
  test("should generate types for simple JSON", () => {
    const json = `{
        "name": "John",
        "age": 30
      }`;

    const expected = `interface JsonDataType {
  name: string;
  age: number;
}`;

    expect(generateTypeScriptTypes(json)).toBe(expected);
  });

  test("should generate types for nested objects", () => {
    const json = `{
        "user": {
          "name": "John",
          "age": 30
        }
      }`;

    const expected = `interface UserJsonDataType {
  name: string;
  age: number;
}

interface JsonDataType {
  user: UserJsonDataType;
}`;

    expect(generateTypeScriptTypes(json)).toBe(expected);
  });

  test("should generate union types for arrays with different element types", () => {
    const json = `{
        "values": [1, "two", true, { "key": "value" }]
      }`;

    const expected = `interface ValuesJsonDataType3 {
  key: string;
}

interface JsonDataType {
  values: number | string | boolean | ValuesJsonDataType3[];
}`;

    expect(generateTypeScriptTypes(json)).toBe(expected);
  });

  it("should handle root level arrays", () => {
    const json = `[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]`;
    const expectedResult = `interface RootElement0 {
  id: number;
  name: string;
}

type JsonDataType = RootElement0[];`;

    const result = generateTypeScriptTypes(json);
    expect(result).toEqual(expectedResult);
  });

  it("should handle root level arrays with different element types", () => {
    const json = `[{"id": 1, "name": "John"}, {"age": 30, "city": "New York"}]`;
    const expectedResult = `interface RootElement0 {
  id: number;
  name: string;
}

interface RootElement1 {
  age: number;
  city: string;
}

type JsonDataType = RootElement0 | RootElement1[];`;

    const result = generateTypeScriptTypes(json);
    expect(result).toEqual(expectedResult);
  });
});
