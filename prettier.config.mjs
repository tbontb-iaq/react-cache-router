/**@type import("prettier").Config */
export default {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^[./]", "^@/(.*)$", "<THIRD_PARTY_MODULES>"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  // importOrderSortByLength: "desc", // no use
};
