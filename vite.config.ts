import pExtend from "postcss-extend";
import pNest from "postcss-nesting";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";
import { defineConfig, createFilter, Plugin } from "vite";

const basePath = fileURLToPath(new URL("./src", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    additionalData({
      "**/*.css": ["@import '@/assets/extends';"],
    }),
  ],
  resolve: {
    alias: {
      "@": basePath,
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
    postcss: {
      plugins: [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        pExtend(),
        pNest(),
      ],
    },
  },
});

function additionalData(dataMap: Record<string, string[]>): Plugin {
  const filters = Object.entries(dataMap).map<
    [(id: unknown) => boolean, string[]]
  >(([p, d]) => [createFilter(p), [...d, ""]]);

  return {
    name: "vite-plugin-addition-data",
    enforce: "pre",
    transform: (code, id) =>
      filters.reduce((c, [f, d]) => (f(id) ? d.join("\n") : "") + c, code),
  };
}
