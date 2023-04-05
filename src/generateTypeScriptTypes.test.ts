import { generateTypeScriptTypes } from "./generateTypeScriptTypes";

describe("generateTypeScriptTypes", () => {
  test("should generate types for simple JSON", () => {
    const json = `{
      "name": "John",
      "age": 30
    }`;

    const expected = `interface Root {
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

    const expected = `interface UserRoot {
  name: string;
  age: number;
}

interface Root {
  user: UserRoot;
}`;

    expect(generateTypeScriptTypes(json)).toBe(expected);
  });

  test("should generate union types for arrays with different element types", () => {
    const json = `{
      "values": [1, "two", true, { "key": "value" }]
    }`;

    const expected = `interface ValuesRoot {
  key: string;
}

interface Root {
  values: number | string | boolean | ValuesRoot[];
}`;

    expect(generateTypeScriptTypes(json)).toBe(expected);
  });
});
