/*
 * @description     3D上下滚屏模块
 * @depends         zepto
 */

var $ = require('Zepto');

var options = {
	par: '.scroll-page-cube-perspective',
	box: '.scroll-page-cube-box',
	item: '.scroll-page-cube-item',
	left: '.scroll-page-cube-left',
	right: '.scroll-page-cube-right',
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
		var opt = this.opt = $.extend({}, options, config);
		opt.$par = $(opt.par);
		opt.$box = opt.$par.find(opt.box);
		opt.$item = opt.$par.find(opt.item);
		opt.$left = opt.$par.find(opt.left);
		opt.$right = opt.$par.find(opt.right);
		//构建一个3d盒子，盒子的两个侧面应该是正方形
		opt.size = this.getSize();
		opt.$box.css({
			//先将整个box的中心移到z轴 -h/2的地方，再将当前page移到z轴 0的地方，这样看上去旋转的各个page正好呈现在页面最前面
			'-webkit-transform': 'translateZ(-' + opt.size.h/2 + 'px)'
		});
		opt.$left.css({
			'width': opt.size.h + 'px',
			//将该page的中心移至box的中心，再进行计算
			'left': (opt.size.w - opt.size.h)/2 + 'px',
			//旋转的时候，坐标轴也旋转了
			'-webkit-transform': 'rotateY(-90deg) translateZ('+ opt.size.w/2 +'px)'
		});
		opt.$right.css({
			'width': opt.size.h + 'px',
			'left': (opt.size.w - opt.size.h)/2 + 'px',
			'-webkit-transform': 'rotateY(90deg) translateZ('+ opt.size.w/2 +'px)'
		});
		opt.$item.eq(0).css({
			'-webkit-transform': 'translateZ(' + opt.size.h/2 + 'px)'
		});
		opt.curIndex = 0;
		this.beforeAction();
		this.followFinger();
		this.preventDefault();
	},
	getSize: function(){
		var size = {
			w: this.opt.$par.width(),
			h: this.opt.$par.height()
		};
		if(!size.h){
			console.log('Warn: check the height of container');
		}
		return size;
	},
	getRotateYZ: function(angle){
		return {
			'0': 'rotateY('+ angle +'deg)',
			'90': 'rotateZ(' + -angle + 'deg)',
			'180': 'rotateY(' + -angle + 'deg)',
			'270': 'rotateZ(' + angle + 'deg)'
		}
	},
	beforeAction: function(){
		var opt = this.opt;
		opt.$box.removeClass('scroll-page-cube-tweening');

		if(opt.curIndex < opt.$item.length - 1){
			opt.$item.eq(opt.curIndex+1).css({
				'-webkit-transform': 'rotateX('+ -90*(opt.curIndex+1) + 'deg) translateZ(' + opt.size.h/2 + 'px)',
				'z-index': opt.curIndex + 1
			});
		}
	},
	afterAction: function(){
		var opt = this.opt;
		//只显示当前的一组三个
		$.each(opt.$item, function(k, v){
			if(k >= opt.curIndex-1 && k <= opt.curIndex+1){
				$(v).css('display', 'block');
			}
			else{
				$(v).css('display', 'none');
			}
		});
	},
	followFinger: function(){
		var opt = this.opt;
		var me = this;
		opt.$par.on({
			touchstart: function(e){
				me.beforeAction();
				this.movestart = {
					x: e.touches[0].pageX,
					y: e.touches[0].pageY
				};
			},
			touchmove: function(e){
				this.moving = {
					x: e.touches[0].pageX - this.movestart.x,
					y: e.touches[0].pageY - this.movestart.y
				};
				var trangle = {
					x: -(this.moving.y/opt.size.h)*90 + opt.curIndex*90,
					y: (this.moving.x/opt.size.w)*30//y轴要限制一下
				};
				//第一页
				if(opt.curIndex === 0 && this.moving.y > 0){
					trangle.x = 0;
					opt.edge = true;
				}
				//最后一页
				else if(opt.curIndex === opt.$item.length - 1 && this.moving.y < 0){
					trangle.x = opt.curIndex*90;
					opt.edge = true;
				}
				else{
					opt.edge = false;
				}

				var rotateConf = me.getRotateYZ(trangle.y);
				opt.$box.css(
					'-webkit-transform', 'translateZ(-' + opt.size.h/2 + 'px) '
										+'rotateX('+ trangle.x +'deg) '
										+rotateConf[opt.curIndex%4*90]
				);
			},
			touchend: function(e){
				var moved = this.moving;
				//未达到触发条件
				if(Math.abs(moved.y) < opt.bonus || opt.edge){

				}
				//达到触发条件
				else{
					opt.curIndex -= moved.y/Math.abs(moved.y);

				}
				opt.$box.addClass('scroll-page-cube-tweening');
				opt.$box.css(
					'-webkit-transform', 'translateZ(-' + opt.size.h/2 + 'px) '
										+'rotateX('+ opt.curIndex*90 +'deg) '
										+ me.getRotateYZ(0)[opt.curIndex%4*90]
				);
				this.moving = {
					x: 0,
					y: 0
				};
				me.afterAction();
			}
		});
	},
	preventDefault: function(){
		$(document).on('touchstart', function(e){
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	}
};

module.exports = scrollPageCube;