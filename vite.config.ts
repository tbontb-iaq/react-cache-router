import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";
import pExtend from "postcss-extend";
import pNest from "postcss-nesting";
import { Plugin, createFilter, defineConfig } from "vite";

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
    [(id: unknown) => boolean, string]
  >(([p, d]) => [createFilter(p), [...d, ""].join("\n")]);

  return {
    name: "vite-plugin-additional-data",
    enforce: "pre",
    transform: (code, id) =>
      filters.reduce((c, [f, s]) => (f(id) ? s : "") + c, code),
  };
}
