import { merge } from 'webpack-merge';
import * as common from './webpack.common';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path2 from 'path';

console.log('PRODUCTION: ', __filename)

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    plugins: [
        new CopyWebpackPlugin({ patterns: [{ from: path2.resolve(__dirname, '../client/build'), to: path2.resolve(__dirname, 'dist/build') }] })
    ]
});