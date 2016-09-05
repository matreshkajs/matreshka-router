const webpack = require('webpack');
const generateExternals = require('webpack-generate-umd-externals');

const { externals, NamedAMDModulesPlugin } = generateExternals({
    'matreshka/foo': 'Matreshka.foo'
});

module.exports = {
    devtool: 'source-map',
    entry: './src/test',
    output: {
        path: `${__dirname}/bundle`,
        filename: 'matreshka-router.min.js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel']
            }
        ]
    },

    externals,

    plugins: [
        new NamedAMDModulesPlugin()
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })*/
    ]
};
