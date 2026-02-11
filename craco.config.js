/* eslint-env node */
module.exports = {
  webpack: {
    configure: (webpackConfig) => {

      // Удалить ModuleScopePlugin
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        plugin => plugin.constructor.name !== 'ModuleScopePlugin'
      );
      
      return webpackConfig;
    },
  },
};