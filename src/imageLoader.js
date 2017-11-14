'use strict';

/**
*预加载图片函数
*@param images 加载图片的数组或者对象
*@param callback 全部图片加载完毕后调用的毁掉函数
*@param timeout 加载超时的时长
*/
function loadImage(images,callback,timeout){
	//用来加载完成图片的计数器
	var count = 0;

	//全部图片加载成功的一个标志
	var success = true；

	// 超时timer的id
	var timeoutId = 0;

	// 是否加载超时的标志位
	var isTimeout = false;

	// 对图片数组或对象进行遍历
	for(var key in images){
		// 过滤prototype上的属性
		if(!images.hasOwnProperty(key)){
			continue;
		}

		// 获得每个图片元素
		//期望结果是个object {src: ''}
		var item = images[key];

		if(typeof item === 'string'){
			item = images[key] = {
				src: item
			};
		}

		// 如果格式不满足期望，则进行下一次遍历
		if(!item || !item.src){
			continue;
		}

		//满足条件，则计数器+1
		count++;

		//设置图片元素的id
		item.id = '__img_' + key + getId();

		//设置图片元素的img
		item.img = window[item.id] = new Image();

		doLoad(item);
	}

	// 遍历完成，如果count没有++，即一个加载对象都没有
	if(!count){
		callback(success);
	}else if(timeout){
		timeoutId = setTimeout(onTimeout, timeout);
	}

	//自有方法
	//真正进行图片加载的函数
	// item 图片元素对象
	function doLoad(item){
		item.status = 'loading';

		var img = item.img;

		// 定义图片加载成功的回调函数
		img.onload = function(){
			// 只有每次都是true才为true
			success = success & true;
			item.status = 'loading';
			done();
		};

		// 定义图片加载失败的回调函数
		img.onerror = function(){
			success = false;
			item.status = 'error';
			done();
		};

		//真正发起了http(s)请求
		img.src = item.src;

		//每张图片加载完成的回调函数，不论成功预付。
		function done(){
			// 清理事件，接触事件绑定
			img.onload = img.onerror = null;
			try {
				delete window[item.id];
			} catch(e){ //兼容低版本浏览器

			}

			//每张图片加载完成，计时器减一，
			//当所有图片加载完成且没有超时的情况
			// 清楚超时计时器，且执行回调函数
			if(!--count && !isTimeout){ // 当count减到0时
				clearTimeout(timeoutId);
				callback(success);// 将图片加载成功与否传递给调用方
			}
		}
	}

	function onTimeout(){
		isTimeout = true;
		callback(false);
	}
}

// 当前为模块化闭包环境，不会造成全局污染
var __id = 0;
function getId(){
	return ++__id;
}

module.exports = loadImage; // 将模块暴露
