import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/* eslint-config-next 16 đã là flat config, không cần FlatCompat nữa. */
const eslintConfig = [
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  { ignores: [".next/**", "node_modules/**", "public/**"] },
];

export default eslintConfig;
