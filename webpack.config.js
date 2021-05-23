const path = require("path");
const os = require('os');
const fs = require("fs");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');
const webpack = require('webpack');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split(".");
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false
        });
    });
}

const getIp = () => {
    const interfaces = os.networkInterfaces();
    const externalInterface = Object.keys(interfaces)
        .reduce((result, id) => [...result, ...interfaces[id]], [])
        .filter(desc => desc.address !== '127.0.0.1' && desc.family === 'IPv4');

    return externalInterface.length ? externalInterface[0].address : null;
};
const htmlPlugins = generateHtmlPlugins("./src/html/pages");
const config = smp.wrap({
    entry: ["./src/js/main.js", "@babel/polyfill", "./src/scss/style.scss"],
    output: {
        filename: "./js/bundle.js",
        path: path.resolve(__dirname, 'local/templates/general'),
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
    },
    devtool: "source-map",
    mode: "production",
    devServer: {
        host: getIp(),
        port: 4000,
        watchContentBase: true,
        watchOptions: {
            aggregateTimeout: 100,
            poll: true
        }
    },
    optimization: {

        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
                extractComments: true,
                parallel: true,
                cache: true
            })
        ]
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
            use: [
                {
                    loader: 'cache-loader',
                },
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        // presets: ['@babel/preset-env'],
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        browsers: 'IE 10',
                                    },
                                }
                            ]
                        ]
                    }
                }]
        },
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, "src/scss"),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: false,
                            url: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            sourceMap: false,
                            plugins: () => [
                                require("cssnano")({
                                    preset: [
                                        "default",
                                        {
                                            discardComments: {
                                                removeAll: true
                                            }
                                        }
                                    ]
                                })
                            ]
                        }
                    },
                    {
                        // loader: "sass-loader",
                        loader: 'fast-sass-loader',
                        options: {
                            //     sourceMap: false,
                            //     sourceComments: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, "src/html/includes"),
                use: ["raw-loader"]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./css/style.bundle.css"
        }),
        new CopyWebpackPlugin([
            {
                from: "./src/fonts",
                to: "./fonts"
            },
            {
                from: "./src/favicon",
                to: "./favicon"
            },
            {
                from: "./src/img",
                to: "./img"
            },
        ]),
        new webpack.WatchIgnorePlugin([
            path.join(__dirname, "node_modules")
        ]),
        new WebpackShellPlugin({
            onBuildStart: ['echo "Starting build"'],
            onBuildExit: ['echo "Exit"'],
            onBuildEnd: ['echo "Finishing build"']
        }),
        {
            apply: (compiler) => {

                compiler.hooks.done.tap('DonePlugin', (stats) => {
                    if (compiler.options.mode === 'production') {
                        setTimeout(() => {
                            process.exit(0)
                        });
                    }
                });
            }
        },
        new MomentLocalesPlugin({
            localesToKeep: ['ru'],
        }),
    ].concat(htmlPlugins)
});

// config.entry.unshift("webpack-dev-server/client?http://192.168.1.154:9000/");

module.exports = (env, argv) => {
    if (argv.mode === "production") {
        config.plugins.push(new CleanWebpackPlugin());
    }
    return config;
};

