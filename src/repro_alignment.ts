import { format } from "./formatter/formatter";
import * as assert from "assert";

const input = `Table users {
  id integer
  username varchar

  email varchar
  created_at timestamp
}`;

const expected = `Table users {
  id       "integer"
  username "varchar"

  email      "varchar"
  created_at "timestamp"
}
`;

const actual = format(input);

console.log("Expected:");
console.log(expected);
console.log("Actual:");
console.log(actual);

if (actual === expected) {
  console.log("Test Passed");
} else {
  console.error("Test Failed");
  process.exit(1);
}
