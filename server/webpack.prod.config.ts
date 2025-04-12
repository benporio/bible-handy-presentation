import dotenv from 'dotenv';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

dotenv.config({ path: path.resolve(__dirname, './env/.env-prod') });

module.exports = {
    entry: './index.ts',
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },

    // ENVIRONMENT SPECIFIC CONFIGURATIONS
    ...(process.env.MODE !== 'PROD' ? {
        mode: 'development',
    } : {
        mode: 'production',
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()]
        },
        plugins: [
            new CopyWebpackPlugin({ patterns: [{ from: path.resolve(__dirname, '../client/build'), to: path.resolve(__dirname, 'dist/build') }] })
        ]
    })
};