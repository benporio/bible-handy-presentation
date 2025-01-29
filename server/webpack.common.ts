import path2 from 'path';
import nodeExternals from 'webpack-node-externals';

module.exports = {
    entry: './index.ts',
    target: "node",
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
        path: path2.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
};