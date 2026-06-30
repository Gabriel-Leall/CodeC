function parseValue(value: string): number;
function parseValue(value: number): string;
function parseValue(value: string | number) {
  return value;
}

const points = parseValue("42");
const label = parseValue(42);
