import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const pathSrc = path.resolve(__dirname, "src");

export default defineConfig({
  resolve: {
    alias: {
      "@app": `${pathSrc}/App.vue`,
      "@utils": `${pathSrc}/utils`,
      "@scenes": `${pathSrc}/scenes`,
      "@styles": `${pathSrc}/styles`,
      "@classes": `${pathSrc}/classes`,
      "@schemas": `${pathSrc}/schemas`,
      "@interfaces": `${pathSrc}/interfaces`,
      "@components": `${pathSrc}/components`,
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // ? https://github.com/vitejs/vite/issues/6333#issuecomment-1003318603
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove();
              }
            },
          },
        },
      ],
    },
  },
});

// ? For simple-peer implementation, these config options might be needed:
//
// import rollupNodePolyFill from "rollup-plugin-node-polyfills";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
// import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
//
// import { defineConfig } from "vite";
//
// import path from "path";
//
// export default defineConfig({
//   resolve: {
//     alias: {
//       "@classes": path.resolve(__dirname, "./src/classes"),
//       "@scenes": path.resolve(__dirname, "./src/scenes"),
//       "@utils": path.resolve(__dirname, "./src/utils"),
//       util: "rollup-plugin-node-polyfills/polyfills/util",
//       sys: "util",
//       events: "rollup-plugin-node-polyfills/polyfills/events",
//       stream: "rollup-plugin-node-polyfills/polyfills/stream",
//       path: "rollup-plugin-node-polyfills/polyfills/path",
//       querystring: "rollup-plugin-node-polyfills/polyfills/qs",
//       punycode: "rollup-plugin-node-polyfills/polyfills/punycode",
//       url: "rollup-plugin-node-polyfills/polyfills/url",
//       http: "rollup-plugin-node-polyfills/polyfills/http",
//       https: "rollup-plugin-node-polyfills/polyfills/http",
//       os: "rollup-plugin-node-polyfills/polyfills/os",
//       assert: "rollup-plugin-node-polyfills/polyfills/assert",
//       constants: "rollup-plugin-node-polyfills/polyfills/constants",
//       _stream_duplex:
//         "rollup-plugin-node-polyfills/polyfills/readable-stream/duplex",
//       _stream_passthrough:
//         "rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough",
//       _stream_readable:
//         "rollup-plugin-node-polyfills/polyfills/readable-stream/readable",
//       _stream_writable:
//         "rollup-plugin-node-polyfills/polyfills/readable-stream/writable",
//       _stream_transform:
//         "rollup-plugin-node-polyfills/polyfills/readable-stream/transform",
//       timers: "rollup-plugin-node-polyfills/polyfills/timers",
//       console: "rollup-plugin-node-polyfills/polyfills/console",
//       vm: "rollup-plugin-node-polyfills/polyfills/vm",
//       zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
//       tty: "rollup-plugin-node-polyfills/polyfills/tty",
//       domain: "rollup-plugin-node-polyfills/polyfills/domain",
//       "readable-stream": "vite-compatible-readable-stream",
//     },
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       // ? Node.js global to browser globalThis
//       define: {
//         global: "globalThis",
//       },
//       // ? Enable esbuild polyfill plugins
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           process: true,
//           buffer: true,
//         }),
//         NodeModulesPolyfillPlugin(),
//       ],
//     },
//   },
//   build: {
//     chunkSizeWarningLimit: 1000,
//     rollupOptions: {
//       plugins: [
//         // ? Enable rollup polyfills plugin
//         // used during production bundling
//         rollupNodePolyFill(),
//       ],
//     },
//   },
// });
