import {defineConfig} from 'vite';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createContentApi} from './server/content-api.mjs';
const contentPath=fileURLToPath(new URL('./data/content.json',import.meta.url));
export default defineConfig({
 server:{host:'127.0.0.1',port:5173,strictPort:false,watch:{ignored:['**/data/content.json','**/data/*.bak','**/data/*.tmp']}},
 preview:{host:'127.0.0.1'},
 plugins:[{
  name:'webdust-local-content',
  configureServer(server){server.middlewares.use(createContentApi(contentPath));},
  configurePreviewServer(server){server.middlewares.use(createContentApi(contentPath));},
  async generateBundle(){this.emitFile({type:'asset',fileName:'content.json',source:await fs.readFile(contentPath,'utf8')});}
 }]
});
