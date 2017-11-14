'use strict';

//初始化状态
var STATE_INITIAL = 0;

//开始状态
var STATE_START = 1;

//停止状态
var STATE_STOP = 2;

/**
动画库类
*@constructor
*/
function Animation(){
	this.taskQueue = [];// 任务链
	this.index = 0;// 任务索引
	this.state = STATE_INITIAL;
}

/**
*添加一个同步任务，预加载图片
*@param imglist 图片数组
*/
Animation.prototype.loadImage = function(imglist){
	
};

/**
*改变图片背景位置
*@el image标签
*@positions 背景位置数组
*@imgUrl 图片地址
*/
Animation.prototype.changePosition = function(el, positions, imgUrl){

};

/**
*通过改变image标签的src来实现动画
*@el image标签
*@imglist 图片数组
*/
Animation.prototype.changeSrc = function(el, imglist){

};

/**
*每帧动画执行的函数
*@callback
*/
Animation.prototype.enterFrame = function(callback){

};

/**
*动画循环的次数
*@times 循环次数
*/
Animation.prototype.repeat = function(times){

};

/**
*无限重复上一次动画
*/
Animation.prototype.repeatForever = function(){

};

/**
*每个动画执行完后等待的时间
@time 等待的时间
*/
Animation.prototype.wait = function(time){

};

/**
*动画执行完成后的回调函数
*@callback 回调函数
*/
Animation.prototype.then = function(callback){

};

/**
*动画开始执行
*@interval 动画执行的间隔
*/
Animation.prototype.start = function(interval){

};

/**
*动画暂停
*/
Animation.prototype.pause = function(){

};

/**
*动画从上一次暂停处重新执行
*/
Animation.prototype.restart = function(){

};

/**
*释放资源
*/
Animation.prototype.dispose = function(){

};