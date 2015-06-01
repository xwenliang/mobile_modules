var $ = require('Zepto');
//默认配置
var _default = {
	//外容器选择器对象
	elem: '',
	//所有的标签(选择器对象)
	tags: [],
	//标签10个一组
	picLength: 15,
	//文字范围(圆的半径)
	R: 300,
	//自动轮播索引
	ii: 0,
	//随即大小
	randSize: ['10px', '14px', '16px', '18px', '24px', '26px', '28px', '32px'],
	//随即颜色
	randColor: ['#ed5450', '#e78419', '#329cb6', '#4894f6', '#598527', '#c6c6c6'],
	//默认动画效果由近及远(1)或由远及近(-1)
	torwards: -1,
	//是否自动切换(false或者空为不循环)
	auto: false,
	//定时器id
	autoId: null
};

var Tornado = function(cfg){
	if( !(this instanceof Tornado) ){
		return new Tornado(cfg);
	}
	var opt = this.opt = $.extend({}, _default, cfg);
	var len = opt.picLength;
	//分割数组分配到每一组
	var picHtml = '';
	var elem = $(opt.elem);
	opt.picTotal = Math.ceil(opt.tags.length/len);
	for(var i=0;i<opt.picTotal;i++){
		picHtml += '<div></div>';
	}
	elem.append(picHtml);
	opt.pics = elem.find('div');
	opt.pics.each(function(key, val){
		var me = $(val);
		for(var i=(key*len);i<(key*len)+len;i++){
			me.append(opt.tags[i]);
		}
		me.css({
			'position': 'absolute',
			'left': '50%',
			'top': '50%',
			'width': '100%',
			'height': '100%',
			'opacity': 0
		});
	});
	elem.css({
		'position': 'relative',
		'-webkit-perspective': '1000px'
	});
	opt.tags.css('opacity', '1');
	this.init();
};

Tornado.prototype = {
	constructor: Tornado,
	init: function(){
		var opt = this.opt;
		this.perspectiveShow($(opt.elem).find('div').eq(opt.ii));
		this.listener();
		opt.auto && this.autoRun();
	},
	//将某一个pic中的标签 随机排布位置和样式 并且不覆盖
	// @param pic($elem)  		某个分组容器对象
	setRandom: function(pic){
		var self = this;
		var opt = this.opt;
		var pic = $(pic);
		//文字范围(圆的半径)
		var R = opt.R;
		var measureArr = [];
		var randSize = opt.randSize;
		var randSizeLen = randSize.length;
		var randColor = opt.randColor;
		var randColorLen = randColor.length;
		//将pic置于一个完整动画的初始帧
		pic.css({
			'display': 'block',
			'-webkit-transition': 'none',
			'-webkit-transform': 'translateZ(' + 1000*opt.torwards + 'px)'
		});
		pic.siblings().css({
			'display': 'none'
		});
		opt.tags.each(function(){
			var size = randSize[Math.floor(Math.random()*randSizeLen)];
			var color = randColor[Math.floor(Math.random()*randColorLen)];
			var me = $(this);
			var randomPos;
			var width;
			var height;
			var left;
			var top;
			//渲染节点，以获取其尺寸
			me.css({
				'width': size,
				'height': size,
				'border-radius': parseInt(size)/2 + 'px',
				'background': color,
				'position': 'absolute',
			});
			width = me.width();
			height = me.height();

			do{
				randomPos = createRandomPos(R);
				left = randomPos.left - width/2;
				top = randomPos.top - height/2;
			}
			while(guessCovered(width, height, randomPos));

			measureArr.push({
				width: width,
				height: height,
				left: left,
				top: top
			});
			me.css({
				'left': left + 'px',
				'top': top + 'px',
			});
		});
		//产生 以直径为r的圆内的随机位置
		function createRandomPos(r){
			var randR = r*Math.random();
			var randT = 2*Math.random()*Math.PI;
			return {
				left: randR*Math.cos(randT),
				top: randR*Math.sin(randT)
			};
		};
		//判断是否遮盖
		function guessCovered(width, height, pos){
			var l = pos.left - width/2;
			var t = pos.top - height/2;
			var isCovered = false;
			$.each(measureArr, function(){
				var ww = this.width;
				var hh = this.height;
				var ll = this.left;
				var tt = this.top;
				if( l < ll+ww+20
					&& l+width+20 > ll
					&& t < tt+hh+20
					&& t+height+20 > tt
				){
					isCovered = true;
				}
			});
			return isCovered;
		};
	},
	//由远及近/由近及远效果
	// @param pic($elem)  		某个分组容器对象
	perspectiveShow: function(pic){
		var opt = this.opt;
		this.setRandom(pic);
		pic.css({
			'-webkit-transition': 'all 1s cubic-bezier(0, 1.0, 0.5, 1.0)',
			'-webkit-transform': 'translateZ(0px)',
			'opacity': 1
		});
	},
	//循环
	loop: function(){
		var opt = this.opt;
		opt.ii++;
		if(opt.ii > opt.picTotal - 1){
			opt.ii = 0;
		}
		this.perspectiveShow(opt.pics.eq(opt.ii));
	},
	//自动轮播
	autoRun: function(){
		if(!this.opt.auto){
			return false;
		}
		
		var self = this;
		var opt = this.opt;
		var time = opt.auto;
		(function _auto(){
			opt.autoId = setTimeout(function(){
				if(opt.ii === 0){
					time = 0;
				}
				else{
					time = opt.auto;
				}
				self.loop();
				_auto();
			}, time);
		})();
	},
	//事件监听
	listener: function(){
		var self = this;
		var opt = this.opt;
		$(opt.elem).swipeLeft(function(){
			clearTimeout(opt.autoId);
			opt.torwards = -1;
			self.loop();
			self.autoRun();
			return false;
		});
		$(opt.elem).swipeRight(function(){
			clearTimeout(opt.autoId);
			opt.torwards = 1;
			self.loop();
			self.autoRun();
			return false;
		});
	}
};
module.exports = Tornado;