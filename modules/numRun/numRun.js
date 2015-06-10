/* 数字滚动 
 * @param $el 		zepto节点对象
 * @param target	需要滚动到多少
 * @param slices	滚动多少次
 * @param digit 	滚动过程中，显示几位小数
 */

var $ = require('Zepto');
function numRun($el, target, slices, digit){
	var cur = parseFloat($el.text());
	var step = parseFloat((target/slices).toFixed(digit));
	//滚动数值太小
	if( step*Math.pow(10, digit) < 1 ){
		$el.text(target.toFixed(digit));
		return false;
	}
	if( cur == target ){
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
			$el.text(target.toFixed(digit));
		}
	}, 60);
};

module.exports = numRun;

