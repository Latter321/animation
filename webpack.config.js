module.exports = {
	entry: { // 输入
		animation: './src/animation.js'
	},
	output: { // 输出
		path: __dirname + '/build',// __dirname为当前目录，在当前目录下创建一个build目录，以备输出
		filename: '[name].js',// name就是entry的key来作为输出的文件名
		library: 'animation', // 会在全局注册一个animation，相当于挂在window下
		libraryTarget: 'umd' //umd支持cmd也支持amd
	}
};