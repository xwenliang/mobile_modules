
/* 阿拉伯数字金额转中文大写
 * @require 
 * @param   num(number)			要转的金额，支持正负数，小数点后两位
 */

function numToUpperCase(num){
	'use strict';
	if(!num.toString()){
		return '函数 numToUpperCase 参数错误';
	}
	var fraction = ['角', '分'],
		digit = [
			'零', '壹', '贰', '叁', '肆',
			'伍', '陆', '柒', '捌', '玖'
		],
		unit = [
			['元', '万', '亿'],
			['', '拾', '佰', '仟']
		],
		prefix = num < 0 ? '欠' : '',
		suffix = '',
		decimal = num.toString().split('.')[1] || '0';

	num = Math.abs(num);
	for(var i=0; i<2; i++){
		decimal[i] && (suffix += (digit[decimal[i]] + fraction[i]).replace(/零./, ''));
	}
	suffix = suffix || '整';
	num = Math.floor(num);
	for(var i=0, len=unit[0].length, p=''; i<len && num>0; i++){
		for(var j=0, _len=unit[1].length; j<_len && num>0; j++){
			p = digit[num % 10] + unit[1][j] + p;
			num = Math.floor(num / 10);
		}
		suffix = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + suffix;
		p = '';
	}
	return prefix + suffix.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
};

if(typeof module === 'object' && module && typeof module.exports === 'object'){
	module.exports = numToUpperCase;
}
else{
	window.numToUpperCase = numToUpperCase;
}