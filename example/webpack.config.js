module.exports = {
    entry: [
        './main.ts',
        'file-loader?name=index.html!./index.html',
    ],
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
        ],
    },
}