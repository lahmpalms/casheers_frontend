/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress console logs in production
  webpack: (config, { isServer, dev }) => {
    // If in production, override console methods
    if (!dev) {
      // This will be executed in the browser
      config.optimization.minimizer.push({
        apply: (compiler) => {
          compiler.hooks.compilation.tap('RemoveConsolePlugin', (compilation) => {
            compilation.hooks.optimizeChunkAssets.tap('RemoveConsolePlugin', (chunks) => {
              for (const chunk of chunks) {
                for (const file of chunk.files) {
                  if (file.endsWith('.js')) {
                    compilation.assets[file] = {
                      source: () => {
                        const src = compilation.assets[file].source();
                        // Replace console.log and console.error with empty functions
                        return src
                          .replace(/console\.log\s*\([^)]*\)\s*;?/g, '')
                          .replace(/console\.error\s*\([^)]*\)\s*;?/g, 'console.error("An error occurred");');
                      },
                      size: () => compilation.assets[file].size(),
                    };
                  }
                }
              }
            });
          });
        },
      });
    }
    return config;
  },
};

export default nextConfig;
