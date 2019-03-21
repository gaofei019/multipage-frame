# 基于webpack集成的多页应用开发脚手架

在一个项目中可以同时使用`vue`、`react`、`zepto`等其他前端框架，也可以直接用`ES6`开发


## 前端开发模块结构

1. `dist` 打包后的静态文件目录
2. `src`  入口文件和静态资源目录
3. `view` html模板目录

## 运行命令

1. 测试命令  `npm run dev`
2. 打包命令  `npm run build`

## 备注
开发代码中如果使用了`webpack`的代码拆分功能，静态资源打包上线之前，静态资源地址参数`publicPath`需要改成提前设置好的线上`cdn`地址或者本地测试服务的地址再打包使用。因为`webpack`自动拆分出来的文件地址是用的参数`publicPath`配置好的绝对地址。如果不提前配置好，则自动拆分出来的文件会默认相对地址，导致文件找不到而产生错误。

```
output:{//出口
	path:path.resolve(__dirname,'dist'),
	//publicPath:'http://10.30.1.52:8860/bobo-h5-share/dist/', //本地静态服务测试地址
	//publicPath:'https://wsqncdn.miaopai.com/static2018/wap/h5_push/bobo-h5-share/20181030/dist/', //线上cdn地址
	publicPath:'', //默认本地测试地址
	filename:'js/[name].js'
}

```
在`webpack.config.js`文件中配置静态资源的引用地址

## 发布上线

1. 静态资源
打包后把`dist`里的`css`、`img`、`js`目录传到`cdn`。

2. html模板文件
	* 如果都是前端渲染的小项目的少量页面，可以直接放到服务器上，通过配置`nginx`访问。
	* 如果需要后端渲染的项目，则需要搭建`nodejs`代理服务，将项目`html`文件按照代理服务规则添加到代理服务上，通过配置`nginx`反向代理访问。
