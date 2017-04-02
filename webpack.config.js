const webpack = require('webpack');
const generateExternals = require('webpack-generate-umd-externals');

const { externals, NamedAMDModulesPlugin } = generateExternals({
    'matreshka/calc': 'Matreshka.calc',
    'matreshka/on': 'Matreshka.on',
    'matreshka/ondebounce': 'Matreshka.onDebounce',
    'matreshka/trigger': 'Matreshka.trigger',
    'matreshka/set': 'Matreshka.set',
});

module.exports = {
    devtool: 'source-map',
    entry: './src/index',
    output: {
        path: `${__dirname}/bundle`,
        filename: 'matreshka-router.min.js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            }
        ]
    },

    externals,

    plugins: [
        new NamedAMDModulesPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
