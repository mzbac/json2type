function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getType(value: any): string {
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}

export function generateTypeScriptTypes(
  json: string,
  rootTypeName: string = "Root"
): string {
  const data = JSON.parse(json);
  const types: string[] = [];

  function processObject(obj: Record<string, any>, typeName: string): string {
    let typeDef = `interface ${typeName} {\n`;
    for (const key in obj) {
      const valueType = getType(obj[key]);
      const fieldName = key;
      let fieldType = "";

      switch (valueType) {
        case "number":
        case "string":
        case "boolean":
          fieldType = valueType;
          break;
        case "object":
          const nestedTypeName = capitalize(fieldName) + typeName;
          fieldType = processObject(obj[key], nestedTypeName);
          break;
        case "array":
          const nestedArrayTypeName = capitalize(fieldName) + typeName;
          fieldType = processArray(obj[key], nestedArrayTypeName);
          break;
      }

      typeDef += `  ${fieldName}: ${fieldType};\n`;
    }
    typeDef += "}";
    types.push(typeDef);
    return typeName;
  }

  function processArray(arr: any[], typeName: string): string {
    const elementTypes = new Set<string>();

    arr.forEach((element) => {
      const valueType = getType(element);
      let elementType = "";

      switch (valueType) {
        case "number":
        case "string":
        case "boolean":
          elementType = valueType;
          break;
        case "object":
          elementType = processObject(element, typeName);
          break;
        case "array":
          const nestedArrayTypeName = typeName + "Item";
          elementType = processArray(element, nestedArrayTypeName);
          break;
      }

      elementTypes.add(elementType);
    });

    const unionType = Array.from(elementTypes).join(" | ");
    return `${unionType}[]`;
  }

  processObject(data, rootTypeName);

  return types.join("\n\n");
}
