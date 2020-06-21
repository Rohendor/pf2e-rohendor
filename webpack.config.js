var webpack = require("webpack"); // eslint-disable-line no-unused-vars
var path = require("path");
var fs = require('fs-extra');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function getFoundryConfig() {
    const configPath = path.resolve(process.cwd(), 'foundryconfig.json');
    let config;

    if (fs.existsSync(configPath)) {
        config = fs.readJSONSync(configPath);
        return config;
    }
}
module.exports = (env, argv) => {
    let config = {
        context: __dirname,
        entry: {
            main: "./src/pf2e.js",
        },
        mode: "none",
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { "targets": { "node": "current" } }]
                            ],
                            plugins: ["@babel/plugin-proposal-optional-chaining"]
                        }
                    }
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader?url=false'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        }
                    ]
                }
            ],
        },
        plugins: [
            //new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                { from: 'static' },
                { from: 'system.json' },
            ], {
                writeToDisk: true
            }),
            new WriteFilePlugin(),
            new MiniCssExtractPlugin({
                filename: 'styles/pf2e.css'
            })
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: "[name].bundle.js",
        },
    };

    const foundryConfig = getFoundryConfig();
    if (foundryConfig !== undefined)
        config.output.path = path.join(foundryConfig.dataPath, 'Data', 'systems', foundryConfig.systemName);

    if (argv.mode === 'production') {
    } else {
        config.devtool = 'inline-source-map';
        config.watch = true;
    }

    return config;
};