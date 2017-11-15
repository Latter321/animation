'use strict';

var loadImage = require('./imageLoader');
var Timeline = require('./Timeline');

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

//执行函数callback
function next(callback){
	callback && callback();
}

/**
动画库类
*@constructor
*/
function Animation(){
	this.taskQueue = [];// 任务链
	this.index = 0;// 任务索引
	this.timeline = new Timeline();
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
*添加一个异步定时任务，改变图片背景位置
*@el image标签
*@positions 背景位置数组
*@imgUrl 图片地址
*/
Animation.prototype.changePosition = function(el, positions, imgUrl){
	var len = positions.length;
	var taskFn;
	var type;
	if(len){
		var me = this;
		taskFn = function(next, time){
			if(imgUrl){
				ele.style.backgroundImage = 'url(' + imgUrl + ')';
			}

			// 获得当前背景图片位置索引
			var index = Math.min(time/me.interval|0,len - 1); //time/me.interval看是第几次，|0是取整
			var position = positions[index].spit(' ');

			//改变dom对象的背景图片位置
			ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';

			// 图片到最后一帧时，执行下一个任务
			if(index === len - 1){
				next();
			}
		};
		type = TASK_ASYC;
	}else{
		taskFn = next;
		type = TASK_SYNC;
	}

	return this._add(taskFn,type);
};

/**
*通过改变image标签的src来实现动画
*@el image标签
*@imglist 图片数组
*/
Animation.prototype.changeSrc = function(el, imglist){
	var len = imglist.length;
	var taskFn;
	var type;

	if(len){
		var me = this;
		taskFn = function(next,time){
			// 获得当前图片索引
			var index = Math.min(time/me.interval | 0, len-1);

			//改变image对象的图片地址
			ele.src = imglist[index];
			if(index === len -1){
				next();
			}			
		}
		type = TASK_ASYC;
	}else{
		taskFn = next;
		type = TASK_SYNC;
	}

	return this._add(taskFn, type);
};

/**
*每帧动画执行的函数
*@callback
*/
Animation.prototype.enterFrame = function(taskFn){
	return this._add(taskFn, TASK_ASYC);
};

/**
*动画循环的次数 (将索引值回到上一个)
*@times 循环次数
*/
Animation.prototype.repeat = function(times){
	var me = this;
	var taskFn = function(){
		if(typeof times === 'undefined'){
			// 无线回退到上一个任务
			me.index--;
			me._runTask();
			return;
		}

		if(times){
			times--;
			// 回退
			me.index--;
			me._runTask();
		}else{
			//达到了重复次数，跳转到下一个任务
			var task = me.taskQueue[me.index];
			me._next(task);
		}
	}

	var type = TASK_SYNC;
	return this._add(taskFn, type);
};

/**
*无限重复上一次动画 
*/
Animation.prototype.repeatForever = function(){
	return this.repeat();
};

/**
*每个动画执行完后等待的时间 给一个任务绑定一个等待时长
@time 等待的时间
*/
Animation.prototype.wait = function(time){
	if(this.taskQueue && this.taskQueue.length > 0){
		this.taskQueue[this.taskQueue.length-1].wait = time;
	}
	return this;
};

/**
*动画执行完成后的回调函数
*@callback 回调函数
*/
Animation.prototype.then = function(callback){
	var taskFn = function(next){
		callback();
		next();
	};

	var type = TASK_SYNC;

	return this._add(taskFn,type);
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
	if(this.state === STATE_START){
		this.state = STATE_STOP;
		this.timeline.stop();
		return this;
	}
	return this;
};

/**
*动画从上一次暂停处重新执行
*/
Animation.prototype.restart = function(){
	if(this.state === STATE_STOP){
		this.state = STATE_START;
		this.timeline.restart();
		return this;
	}
	return this;
};

/**
*释放资源
*/
Animation.prototype.dispose = function(){
	if(this.state !== STATE_INITIAL){
		this.state = STATE_INITIAL;
		this.taskQueue = null;
		this.time.stop();
		this.timeline = null;
		return this;
	}
	return this;
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
		me._next(task);
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
	var me = this;
	//定义每一帧执行的回调函数
	var enterFrame = function(time){
		var taskFn = task.taskFn;
		var next = function(){
			// 停止当前任务
			me.timeline.stop();

			//执行下一个任务
			me._next(task);
		};
		taskFn(next,time);
	};
	this.timeline.onenterframe = enterFrame;
	this.timeline.start(this.interval);
};

/**
 * 切换到下一个任务,支持如果当前任务需要等待，则延时执行
 * task 当前任务
 * @private
 */
Animation.prototype._next = function (task) {
	this.index++;

	var me = this;

	task.wait ? setTimeout(function(){
		me._runTask();
	},task.wait) : this._runTask();
};

module.exports = function(){
	return new Animation();
}