import { merge } from 'webpack-merge';
import * as common from './webpack.common';

console.log('DEVELOPMENT: ', __filename)

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map'
});