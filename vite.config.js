import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
// import handlebars from "@vituum/vite-plugin-handlebars";

export default {
  root: "src",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        //input: ["index.hbs.html"],
        main: "./src/index.html",
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
    }),
  ],
};
