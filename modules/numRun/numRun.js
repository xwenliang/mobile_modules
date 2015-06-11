/* 数字滚动 
 * @param $el 		zepto节点对象
 * @param target	需要滚动到多少
 * @param slices	滚动多少次
 * @param digit 	滚动过程中，显示几位小数
 */

var $ = require('Zepto');

//支持带,的target
var _target;
function numRun($el, target, slices, digit){
	var cur, step;
	_target = _target || target;
	target = target.split(',').join('');
	cur = parseFloat($el.text().split(',').join(''));
	step = parseFloat((target/slices).toFixed(digit));
	//滚动数值太小
	if( step*Math.pow(10, digit) < 1 || cur >= target ){
		$el.text(_target);
		return false;
	}

	clearTimeout($el.numRunTimer);
	$el.numRunTimer = setTimeout(function(){
		var now = cur + step;
		$el.text(now.toFixed(digit));
		if( now < target ){
			numRun($el, target, slices, digit);
		}
		else{
			$el.text(_target);
		}
	}, 60);
};

module.exports = numRun;

