/* tab切换
 * @param cfg.tit 				tab按钮选择器
 * @param cfg.cont 				tab内容选择器
 * @param cfg.par 				按钮、容器公共父元素
 * @param [cfg.cur]				当前tab高亮class
 * @param [cfg.callback]		每次点击都会触发的函数
 * @param [cfg.index]			默认显示第几个
 */
'use strict';
var $ = require('Zepto');
var options = {
	tit: '',
	cont: '',
	par: '',
	cur: 'cur',
	index: 0,
	callback: null
};
var tabs = function(cfg){
	var opt = $.extend({}, options, cfg);
	var $pars = $(opt.par);
	$pars.find(opt.tit).click(function(){
		var $me = $(this),
			i = $me.index(),
			$cont = $me.closest(opt.par).find(opt.cont);
		$me.addClass(opt.cur).siblings().removeClass(opt.cur);
		$cont.eq(i).show().siblings().hide();
		opt.callback && opt.callback($me.closest(opt.par), i);
		return false;
	});
	//如果有两个或以上相同的结构 都引用了这个模块，那要保证两个结构都有默认打开的tab
	$pars.each(function(k, v){
		var $el = $(v);
		$el.find(opt.tit).eq(opt.index).addClass(opt.cur);
		$el.find(opt.cont).eq(opt.index).show();
		opt.callback && opt.callback($el, opt.index);
	});

	// $tit.eq(opt.index).addClass(opt.cur);
	// $cont.eq(opt.index).show();
	// opt.callback && opt.callback($tit.eq(opt.index));
};
module.exports = tabs;