function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getType(value: any): string {
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}

function getObjectSignature(obj: Record<string, any>): string {
  return Object.keys(obj)
    .sort()
    .map((key) => {
      const valueType = getType(obj[key]);
      if (valueType === "object") {
        return `${key}:{${getObjectSignature(obj[key])}}`;
      } else if (valueType === "array") {
        const signatures = new Set<string>();
        obj[key].forEach((element: any) => {
          const elementType = getType(element);
          if (elementType === "object") {
            signatures.add(`{${getObjectSignature(element)}}`);
          } else {
            signatures.add(elementType);
          }
        });

        return `${key}:[${Array.from(signatures).join(" | ")}]`;
      } else {
        return `${key}:${valueType}`;
      }
    })
    .join(",");
}

export function generateTypeScriptTypes(
  json: string,
  rootTypeName: string = "JsonDataType"
): string {
  const data = JSON.parse(json);
  const types: string[] = [];

  const typeCache = new Map<string, string>();

  function processObject(obj: Record<string, any>, typeName: string): string {
    const signature = getObjectSignature(obj);
    if (typeCache.has(signature)) {
      return typeCache.get(signature)!;
    }

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

    if (!types.some((t) => t === typeDef)) {
      types.push(typeDef);
    }

    typeCache.set(signature, typeName);
    return typeName;
  }

  function processArray(arr: any[], typeName: string): string {
    const elementTypes = new Set<string>();

    arr.forEach((element, index) => {
      const valueType = getType(element);
      let elementType = "";

      switch (valueType) {
        case "number":
        case "string":
        case "boolean":
          elementType = valueType;
          break;
        case "object":
          const objectTypeName = `${typeName}${index}`;
          elementType = processObject(element, objectTypeName);
          break;
        case "array":
          const nestedArrayTypeName = `${typeName}${index}Item`;
          elementType = processArray(element, nestedArrayTypeName);
          break;
      }

      elementTypes.add(elementType);
    });

    const unionType = Array.from(elementTypes).join(" | ");
    return `${unionType}[]`;
  }

  if (Array.isArray(data)) {
    types.push(`type ${rootTypeName} = ${processArray(data, "RootElement")};`);
  } else {
    processObject(data, rootTypeName);
  }

  return types.join("\n\n");
}
