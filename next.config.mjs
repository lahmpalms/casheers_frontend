/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Terser to properly remove console logs in production
  swcMinify: true, // Use SWC minifier by default
  webpack: (config, { dev, isServer }) => {
    // Only run in production client-side builds
    if (!dev && !isServer) {
      // Find the terser plugin in the webpack config
      const terserPluginIndex = config.optimization.minimizer.findIndex(
        (minimizer) => minimizer.constructor.name === 'TerserPlugin'
      );

      if (terserPluginIndex > -1) {
        // Get the terser plugin instance
        const terserPlugin = config.optimization.minimizer[terserPluginIndex];
        
        // Update the terser options to drop console.log statements
        // but keep console.error and console.warn
        const terserOptions = terserPlugin.options.terserOptions || {};
        terserOptions.compress = {
          ...terserOptions.compress,
          drop_console: false, // Don't drop all console statements
          pure_funcs: [
            'console.log',
            'console.info',
            'console.debug',
            'console.time',
            'console.timeEnd',
          ],
        };
        
        // Update the plugin options
        terserPlugin.options.terserOptions = terserOptions;
      }
    }
    
    return config;
  },
};

export default nextConfig;
