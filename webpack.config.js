const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

const os = require('os')

const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const WorkboxPlugin = require('workbox-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

let fs = require('fs')

/* 获取入口文件配置 */
function getEntryConfig(){
	let src_files = fs.readdirSync(path.join(__dirname, 'src'))
	let entry_files = src_files.filter(function(item){
		return /\.js$/.test(item)
	})
	let entry_obj = Object.create(null)
	entry_files.forEach((item,index)=>{
		entry_obj[item.replace(/\.js$/,'')]=`${__dirname}/src/${item}`
	})
	return entry_obj
}

/* 获取模板文件配置 */
function getTplConfig(){
	let view_files = fs.readdirSync(path.join(__dirname, 'view'))
	let tpl_files = view_files.filter(function(item){
		return /\.html$/.test(item)
	})
	let tpl_arr = []
	tpl_files.forEach((item,index)=>{
		tpl_arr.push(new htmlWebpackPlugin({ //有几个生成new几个html,生成html
			filename:item,
			title:'模板',
			template:`view/${item}`,
			chunks:[item.replace(/\.html$/,'').replace(/\-page$/,'.page')],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}))
		//tpl_arr.push(item.replace(/\.html$/,'').replace(/\-page$/,'.page'))
	})
	return tpl_arr
}
//var ImageminPlugin = require('imagemin-webpack-plugin').default;
module.exports = {
	entry:getEntryConfig(),
	output:{//出口
		path:path.resolve(__dirname,'dist'),
		//publicPath:'https://yixia-static.oss-cn-beijing.aliyuncs.com/bobo/sem/202003101701/dist/',
		publicPath:'',
		filename:'js/[name].js'
	},
	devServer:{ //服务
		contentBase:__dirname+'/dist',
		//host:'localhost',
		hot: true,
		open:true,
		inline:true,
		progress: true,//显示打包速度
		port:3000/*,
		proxy:{//代理
			"/v2":{//请求v2下的接口都会被代理到 target： http://xxx.xxx.com 中
				target:'https://api.douban.com',
				changeOrigin: true,
				secure: false,// 接受 运行在 https 上的服务
				pathRewrite:{'^/v2':''}


			}
		}*/
	},
	resolve: {
	    modules: [ // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
	        resolve('src'),
	        resolve('node_modules')
	    ],
	    alias: {
	        "@": resolve("src") // 缓存src目录为@符号，避免重复寻址
	    }
	},
	module:{
		rules:[
			{//css loader
				test:/\.css$/,
				/*use:ExtractTextPlugin.extract({
					fallback:'style-loader',
					//use:['css-loader']
					use:[
                        {
                            loader: 'css-loader',
                            options:{
                                minimize: true //css压缩
                            }
                        }
                    ]
				})*/
				use: [
                    //miniCssExtractPlugin.loader,
                    ...(isDev ? ["css-hot-loader", "style-loader"] : [miniCssExtractPlugin.loader]),
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true //css压缩
                        }
                    }
                ]
			},
			{//js loader
				test:/\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: "happypack/loader?id=happyBabel"
				/*use:{
					loader:'babel-loader',
					query: {
						presets:['react','latest']
					}
				}*/
			},
			{// img 压缩，，生成hash值
				test: /\.(png|svg|jpg|gif)$/,
				use: ["file-loader?limit=8192&name=[name].[ext]&publicPath=../img/&outputPath=./img",'image-webpack-loader'],
				enforce: 'pre'
				//use: ["file-loader?limit=8192&name=[name].[ext]&publicPath=../img/&outputPath=./img"]
				/*name=[name].[ext]文件名，publicPath=../css中路径，outputPath=./img打包后的生成地址*/
			},
			{
				 test: /\.(woff|woff2|eot|ttf|otf)$/,
				 use:['file-loader']
			},
			{ //引用zepto
				test: require.resolve('zepto'),
		        use: ['exports-loader?window.Zepto','script-loader']
	        },
	        /*{ //引用jquery
				 test: require.resolve('jquery'),
		          use: [{
		              loader: 'expose-loader',
		              options: 'jQuery'
		          },{
		              loader: 'expose-loader',
		              options: '$'
		          }]
	        }*/

		]
	},
	devtool:isDev?'cheap-module-eval-source-map':'cheap-module-source-map',//'inline-source-map',
	plugins:[
		new HappyPack({
	        //用id来标识 happypack处理那里类文件
	      id: 'happyBabel',
	      //如何处理  用法和loader 的配置一样
	      loaders: [{
	            path: 'babel-loader',
	            cache: true,
				query: {
					presets:['react','latest']
				}
	      }],
	      //共享进程池
	      threadPool: happyThreadPool,
	      //允许 HappyPack 输出日志
	      verbose: true,
	    }),
		/*new ImageminPlugin({
	      disable: process.env.NODE_ENV !== 'production', 
	      pngquant: {
	        quality: '95-100'
	      }

	    }),*/
		...getTplConfig(),
		//new cleanWebpackPlugin(['dist']),
		new miniCssExtractPlugin({ //提取css
            filename:'css/[name].css',
			disable:false,
			allChunks:true
        }),
		new webpack.HashedModuleIdsPlugin(),
		new WorkboxPlugin.GenerateSW({
            cacheId: 'webpack-pwa', // 设置前缀
            skipWaiting: true, // 强制等待中的 Service Worker 被激活
            clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
            swDest: 'service-worker.js', // 输出 Service worker 文件
            /*runtimeCaching: [
                // 配置路由请求缓存
                {
                    urlPattern: /.*\.js/, // 匹配文件
                    handler: 'NetworkFirst', // 网络优先
                    options: {
                    	// Fall back to the cache after 2 seconds.
                    	networkTimeoutSeconds: 2,
				        // Configure which responses are considered cacheable.
				        cacheableResponse: {
				          statuses: [200]
				        }
				    }
                }
            ]*/
        }),
	]
};