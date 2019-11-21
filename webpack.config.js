var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
var uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
//var ImageminPlugin = require('imagemin-webpack-plugin').default;
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
module.exports = {
	entry:getEntryConfig(),
	output:{//出口
		path:path.resolve(__dirname,'dist'),
		//publicPath:'http://10.30.1.52:8860/bobo-h5-share/dist/',
		//publicPath:'https://wsqncdn.miaopai.com/static2018/wap/h5_push/bobo-h5-share/20181030/dist/',
		//publicPath:'https://wsqncdn.miaopai.com/static2018/wap/bobo-m/20181024/dist/',
		publicPath:'',
		filename:'js/[name].js'
	},
	devServer:{ //服务
		contentBase:__dirname+'/dist',
		//host:'localhost',
		//hot: true,
		open:true,
		inline:true,
		progress: true,//显示打包速度
		port:8080/*,
		proxy:{//代理
			"/v2":{//请求v2下的接口都会被代理到 target： http://xxx.xxx.com 中
				target:'https://api.douban.com',
				changeOrigin: true,
				secure: false,// 接受 运行在 https 上的服务
				pathRewrite:{'^/v2':''}


			}
		}*/
	},
	module:{
		rules:[
			{//css loader
				test:/\.css$/,
				use:ExtractTextPlugin.extract({
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
				})
			},
			{//js loader
				test:/\.js$/,
				exclude: /(node_modules|bower_components)/,
				use:{
					loader:'babel-loader',
					query: {
						presets:['react','latest']
					}
				}
			},
			{// img 压缩，，生成hash值
				test: /\.(png|svg|jpg|gif)$/,
				use: ["file-loader?limit=8192&name=[name].[ext]&publicPath=../img/&outputPath=./img",'image-webpack-loader']
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
	        /*{ //引用zepto
				test: require.resolve('zepto'),
		        use: [{
		              loader: 'exports-loader',
		              options: 'Zepto'
		        },{
		              loader: 'exports-loader',
		              options: '$'
		        }]
	        }*/
		]
	},
	devtool:false,//'inline-source-map',
	plugins:[
		/*new ImageminPlugin({
	      disable: process.env.NODE_ENV !== 'production', 
	      pngquant: {
	        quality: '95-100'
	      }

	    }),*/
		/*new htmlWebpackPlugin({ //有几个生成new几个html,生成html
			filename:'index.html',
			title:'首页',
			template:'view/index.html',
			chunks:['index'],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}),
		new htmlWebpackPlugin({ //有几个生成new几个html,生成html
			filename:'vue-page.html',
			title:'使用vue的页面',
			template:'view/vue-page.html',
			chunks:['vue.page'],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}),
		new htmlWebpackPlugin({ //有几个生成new几个html,生成html
			filename:'pc-page.html',
			title:'pc站页面',
			template:'view/pc-page.html',
			chunks:['pc.page'],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}),
		new htmlWebpackPlugin({ //有几个生成new几个html,生成html
			filename:'mobile-page.html',
			title:'移动端页面',
			template:'view/mobile-page.html',
			chunks:['mobile.page'],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}),
		new htmlWebpackPlugin({ //有几个生成new几个html,生成html
			filename:'react-page.html',
			title:'使用react的页面',
			template:'view/react-page.html',
			chunks:['react.page'],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}),*/
		...getTplConfig(),
		//new cleanWebpackPlugin(['dist']),
		new uglifyjsWebpackPlugin(),
		//new cleanWebpackPlugin(['dist']),
		new ExtractTextPlugin({ //提取css
			filename:'css/[name].css',
			disable:false,

			allChunks:true
		}),
		/*new webpack.optimize.CommonsChunkPlugin({ //打包公共js
			//name:['flexible','zepto'],
			name:'common',
			chunks:['./src/lib'],
			minChunks:2,
			minChunks: Infinity
		}),*/
		new webpack.HashedModuleIdsPlugin()
		//new OpenBrowserPlugin({ url: 'http://localhost:8080' }) //自动打开浏览器
	]
};