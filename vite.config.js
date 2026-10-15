import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';
import WindiCSS from 'vite-plugin-windicss';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let outDir;
  if (env.target === 'web') outDir = 'www';
  else if (env.target === 'desktop') outDir = 'desktop/resources';
  else outDir = 'dist';

  const afterBuildPlugin = () => {
    return {
      name: 'after-build',
      apply: 'build',

      async closeBundle() {
        if (env.target === 'web') {
          fs.copyFileSync(
            path.resolve(process.cwd(), 'home.html'),
            path.resolve(process.cwd(), 'www/home.html'),
          );
        }
        fs.renameSync(
          path.resolve(
            process.cwd(),
            `${outDir}/index-${env.target ?? 'mobile'}.html`,
          ),
          path.resolve(process.cwd(), `${outDir}/index.html`),
        );
      },
    };
  };

  return {
    // 构建后的资源路径使用相对路径
    base:
      env.target === 'web'
        ? 'https://cdn.jsdmirror.com/gh/k34869/hymnal-library@main/www/'
        : './',
    build: {
      outDir: outDir,
      rollupOptions: {
        input: path.resolve(
          process.cwd(),
          `index-${env.target ?? 'mobile'}.html`,
        ),
        output: {
          // 合并 Chunks
          manualChunks() {
            return 'index';
          },
        },
      },
      copyPublicDir: env.target === 'web' ? false : true,
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 所有以 mdui- 开头的标签名都是 mdui 组件
            isCustomElement: tag => tag.startsWith('mdui-'),
          },
        },
      }),
      WindiCSS(),
      afterBuildPlugin(),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
  };
});
