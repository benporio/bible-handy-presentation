import path2 from 'path';
import nodeExternals from 'webpack-node-externals';
import copyFiles from 'copy-webpack-plugin';

module.exports = {
    entry: './index.ts',
    target: "node",
    mode: "production",
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/}
        ]
    },
    output: {
        path: path2.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    plugins: [
        new copyFiles({ patterns: [{ from: path2.resolve(__dirname, '../client/build'), to: path2.resolve(__dirname, 'dist/build') }]})
    ],
};