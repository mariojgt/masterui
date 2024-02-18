import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({
			reactivityTransform: true,
		}),
        ReactivityTransform(),
	],
});
