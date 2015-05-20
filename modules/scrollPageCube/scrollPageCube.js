/*
 * @description     3D上下滚屏模块
 * @depends         zepto
 */

var $ = require('Zepto');

var opt = {
	bonus: 50//垂直移动距离超过该值，就触发滚动
};
function scrollPageCube(config){
	if(!(this instanceof scrollPageCube)){
		return new scrollPageCube(config);
	}
	this.init(config);
};
scrollPageCube.prototype = {
	constructor: scrollPageCube,
	init: function(config){
		
	},
	beforeAction: function(){

	},
	doAction: function(){

	},
	afterAction: function(){

	}
};

module.exports = scrollPageCube;