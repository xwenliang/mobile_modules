/*
 * @date 2015-2-5
 * @desc 下/上拉刷新
 * @params
 * @param container(str)			容器
 * @param distance(num)				临界值
 * @param pullUpAction(fn)			上拉触发的函数
 * @param pullDownAction(fn)		下拉触发的函数
 * @param probeType(num)			scroll事件触发中探针的活跃度
 * @param click(boolen)				iscroll的click属性
 */
var $ = require('Zepto');
var iscroll = require('iScroll');

var config = {
	container: '',
	distance: 50,
	pullUpAction: null,
	pullDownAction: null,
	probeType: 3,
	click: false
};
function zRefresh(opt){
	if(!(this instanceof zRefresh)){
		return new zRefresh(opt);
	}
	this.opt = $.extend({}, config, opt);
	this.init();
};
zRefresh.prototype = {
	constructor: zRefresh,
	init: function(){
		var me = this;
		var myscroll = me.myscroll = new iscroll(me.opt.container, {
			probeType: me.opt.probeType,
			topOffset: -me.opt.distance,
			click: me.opt.click
		});
		myscroll.canExec = true;
		myscroll.on('scrollStart', function(){
			//start
		});
		myscroll.on('scroll', function(){
			if(this.isAnimating || !this.canExec){
				return false;
			}

			if(this.y - this.maxScrollY < -me.opt.distance){
				this.canExec = false;
				me.opt.pullUpAction && me.opt.pullUpAction(myscroll);
			}
			else if(this.y > me.opt.distance){
				this.canExec = false;
				me.opt.pullDownAction && me.opt.pullDownAction(myscroll);
			}
		});
		myscroll.on('scrollEnd', function(){
			this.canExec = true;
		});
	}
};

module.exports = zRefresh;