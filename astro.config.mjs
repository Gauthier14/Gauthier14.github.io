import { defineConfig } from 'astro/config';
import { astroImageTools } from "astro-imagetools";

// https://astro.build/config
export default defineConfig({
    site: 'https://gauthier14.github.io',
    integrations: [astroImageTools],
});

