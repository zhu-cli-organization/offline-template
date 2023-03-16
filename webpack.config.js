// 项目所有资源编译，构建，打包的配置文件

const path = require('path');
const MiniCssEaxtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const  ReactRefreshWebpackPlugin= require('@pmmmwh/react-refresh-webpack-plugin'); // 更快的热更新
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin'); // webpack5默认内置第三方，并开启多线程压缩。

const isDev = process.env.NODE_ENV==='development';
 const baseConfig= {
    
    entry:{
        index:'./src/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // 文件输出地址，必须是绝对路径
        filename: '[name].[contenthash].js', // bundle的名字,bundle要插入html文件中哦
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        static: {
          directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port:  'auto',
      },
    
    module: {
        rules: [
            {
                test: /\.(m?js|jsx|ts|tsx)$/,
                exclude: /node_modules/, // 排除
                use: {
                    loader: 'swc-loader',
                    options: {
                        sync: true, // 
                        jsc: {
                            minify: {
                                compress: true // 压缩
                            },
                            parser: {
                                syntax: "typescript",
                                tsx: false,
                                decorators: true, // 装饰器
                                dynamicImport: false
                            },
                            transform: {
                                react: {
                                    runtime: 'automatic',
                                    development: isDev,
                                    refresh: isDev,
                                },
                            },
                        },
                        env: {
                            coreJs: 3,
                            mode: 'usage',
                            debug: true
                        },
                    }
                }
            },
            {
                test:/\.(css|less)/,
                use:[
                    isDev?'style-loader':MiniCssEaxtractPlugin.loader, // 将css注入html
                    'css-loader',
                    {
                     loader:'postcss-loader', // 浏览器兼容性前缀
                     options:{
                        postcssOptions:{
                            plugins:[
                                 'postcss-preset-env', // 处理浏览器兼容性问题，集成了autoprefixer
                                 {
                                    'postcss-px-2-viewport': { // 处理不同屏幕像素适配
                                        viewportWidth:375
                                     }
                                 }
                            ]
                        }
                     }
                    },
                    'less-loader',
                    {
                        loader:'style-resources-loader', // 默认每个less文件中引入该资源
                        options:{
                            patterns:[
                                './node_modules/@hupu/api-color/es/theme.css',
                                './node_modules/@hupu/api-color/es/common.font.less',
                                './node_modules/@hupu/api-color/es/functions.less'
                            ]
                        }
                    }
                ]
            },
            {
             test:/\.(png|jpg|jpe?g|svg)/,  
             use: [
                {
                    loader:'url-loader',
                    options:{
                        limit:800
                    }
                }
             ]
            },
            {
            test:/\.(eot|woff2|ttf|otf)/,
            use:[
                {
                    loader:'url-loader',
                    options:{
                        limit:5120
                    }
                }
             ]
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),  //构建前清空目标目录
        new webpack.DefinePlugin({ // 定义dev环境下，process.env全局常量
            PUBLIC_URL:path.resolve('.')
        }),
        isDev? new ReactRefreshWebpackPlugin():null, // 开发时 热更新
        
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html', 
            title:'首页',  
            inject:'body',  
            chunk:['index'], //  
        }),
        new webpack.IgnorePlugin({  // 打包的时候忽略moment的语言包local文件夹
            resourceRegExp:/^\.\/local$/,
            contextRegExp:/moment$/
        })
    ],
    optimization:{
        minimize:true, // 压缩
        minimizer:[
            new TerserPlugin({
                parallel:true, // 并行
            })
        ]
    }
}

module.exports.parallelism=1;
module.exports = baseConfig;
