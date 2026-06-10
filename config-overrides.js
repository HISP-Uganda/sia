const {override, fixBabelImports, addLessLoader, addWebpackPlugin, addDecoratorsLegacy} = require('customize-cra');
const AntdDayWebpackPlugin = require('antd-dayjs-webpack-plugin');


module.exports = override(
  addDecoratorsLegacy(),
  addWebpackPlugin(new AntdDayWebpackPlugin()),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '@blue-6'},
  }),
);
