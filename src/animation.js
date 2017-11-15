'use strict';

var loadImage = require('./imageLoader');

//初始化状态
var STATE_INITIAL = 0;

//开始状态
var STATE_START = 1;

//停止状态
var STATE_STOP = 2;

//同步任务
var TASK_SYNC= 0;

// 异步任务
var TASK_ASYC= 1;

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
	var taskFn = function (next) {
        loadImage(imglist.slice(), next);	 //通过slice方法获得一个副本，这样操作副本不会影响原来的imglist
    }

     var type = TASK_SYNC;

	return this._add(taskFn, type);
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
*@param interval 动画执行的间隔
*/
Animation.prototype.start = function(interval){
	if(this.state === STATE_START){
		return this;
	}

	// 如果任务链中没有任务，则返回
	if(!this.taskQueue.length){
		return this;
	}

	this.state= STATE_START;
	this.interval = interval;
	this._runTask();
	return this;
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

/**
 * 添加一个任务到任务队列中
 * 类内部使用的方法
 * @param taskFn 任务方法
 * @param type  任务类型
 * @private
 */
Animation.prototype._add = function (taskFn, type) {
	this.taskQueue.push({
		taskFn: taskFn,
		type: type
	});
	return this; // 链式调用
};

/**
 * 执行任务
 * @private
 */
Amimation.prototype._runTask = function () {
	if(!this.taskQueue || this.state !== STATE_START){
		return;
	}

	// 任务执行完毕
	if(this.index === this.taskQueue.length){
		this.dispose();
		return;
	}

	//获得任务链上的当前任务
	var task = this.taskQueue[this.index];

	if(task.type === TASK_SYNC){// 同步任务
		this._syncTask(task);
	}else{
		this._asynTask(task);
	}

};

/**
 * 同步任务
 * @param task 执行的任务对象
 * @private
 */
Animation.prototype._syncTask = function (task) {
	var me = this;
	var next = function () {
		//切换到下一个任务
		me._next();
    };
	var taskFn = task.taskFn;
	taskFn(next);//taskFn执行完后会执行next方法，切到下一个任务
};

/**
 * 异步任务
 * @param task 执行的任务对象
 * @private
 */
Animation.prototype._asynTask = function (task) {
	
};

/**
 * 切换到下一个任务
 * @private
 */
Animation.prototype._next = function () {
	this.index++;
	this._runTask();
};