var HongBao = {
	//红包列表
	packets : [],

	/**
	* 生成红包列表
	* @param len{number} 随机数组长度
	* @param sum{number} 数组总和上限
	* @param maxValue{number} 数组中元素最大值限制
	* @param minValue{number} 数组中元素的最小值限制
	* @param repeat{number} 最大值重复出现的次数, 默认2次
	*/
	setPackets : function(len, sum, maxValue, minValue, repeat){
		var arr = [], times = len, balance = sum;
		// 随机值 和（最大值、最小值）的误差范围：Math.min(总和 / 数组长度 , 最小值) / 2
		var differ = Math.min(sum/len, minValue) / 2; 
		var rValue, random = Math.random, num = 0, flag, minStart = false, stop = false;
		if(sum < len * minValue){
			return arr;
		}
		repeat = (repeat && repeat > 0) ? repeat : 2;
		while(times--){
			flag = !stop;
			// 筛选：大于等于最小值，小于等于最大值
			//      最大值不能连续重复出现 repeat 次
			//     （数组总和上限 - 当前随机数组总和） > （剩余次数 * 最小值）
			while(flag){
				rValue = random() * maxValue;

				if(rValue < minValue){
					continue;
				}
				rValue = (rValue-minValue < differ) ? minValue 
													: (maxValue-rValue < differ) ? maxValue 
																				 : Math.round(rValue*100)/100;

				rValue == maxValue ? num++ : (num = 0);
				if(num > repeat){
					num--;
					continue;
				}

				balance = Math.round((balance - rValue) * 100 ) / 100;
				if(balance*100 < Math.round(times * minValue * 100)){
					balance = Math.round((balance + rValue) * 100 ) / 100;
					if(rValue < minValue * 2){
						rValue = Math.round((balance - times * minValue) * 100) / 100;
						balance = Math.round((balance - rValue) * 100 ) / 100;
						stop = true;
						break;
					}else{
						continue;
					}
				}else if(balance*100 == Math.round(times * minValue * 100)){
					stop = true;
					break;
				}
				flag = false;
			}

			arr[arr.length] = minStart && minValue || rValue;
			if(stop){
				minStart = true;
			}

		}
		this.packets = arr;
		return arr;
	},

	/**
	* 生成红包列表
	* @param len{number} 随机数组长度
	* @param sum{number} 数组总和上限
	* @param maxValue{number} 数组中元素最大值限制
	* @param minValue{number} 数组中元素的最小值限制
	* @param n{number} 保留小数点后的位数, 默认2位, 当为负数时，保留0位
	*/
	setPackets_1 : function(len, sum, maxValue, minValue, n){
		var n = ((typeof n == 'number') && n > 0) ? Math.round(n) : 2; //小数点后位数
		var nn = Math.pow(10, n);
		var toFixed = function(val, n){
			return Math.round(val * nn) / nn;
		},
		random = function(min, max, n){
			var temp = Math.random(), min = Math.min(min, max), max = Math.max(min, max);
			temp = temp < 0.08 ? 0 : (temp > 0.9) ? 1 : temp;
			return toFixed(temp * (max - min) + min, n);
		}
		var arr = [], average = toFixed(sum / len, n), rValue = minValue, currentSum = 0;
		if(sum < len * minValue){ return arr; }
		var s = 0;
		do{ 
			currentSum = 0;
			arr = [];
			for(var i = 0; i < len; i++){
				if(i===0){
					rValue = random(minValue, maxValue, n);
				}else if(i == len-1){
					rValue = sum - currentSum < 0 ? minValue : Math.min(toFixed(sum - currentSum, n), minValue);
				}else{
					if(toFixed(currentSum / i, n) >= average){
						rValue = random(minValue, average, n);
					}else{
						rValue = random(average, maxValue, n);
					}
				}
				currentSum = toFixed(currentSum + rValue, n);
				arr[arr.length] = rValue;
			}
			// console.log(currentSum, sum, currentSum > sum, arr.length);
		}while(currentSum > sum);
		this.packets = arr;
		return arr;
	},

	/**
	* 领红包
	* @return  packet{number} 红包金额，红包领完，返回值为-1；
	*/
	getPacket : function(){

		function _r(len){
			if(!len){
				return 0;
			}
			var num = Math.floor(Math.random() * len + 1);
			return num == len ? len-1 : num;
		}
		var l = _r(this.packets.length);
		// 未打乱顺序返回
		// return this.packets.length && this.packets.shift() || -1;
		// 打乱顺序返回
		return this.packets.length ? this.packets.splice(l, 1)[0] : -1;
	},

	init : function(options){
		var that = HongBao, cfg = {
			count : options.count,              // 红包个数
			total : options.total,              // 总金额
			maxValue : options.max || 1,        // 单个红包最大额度
			minValue : options.min || 0.1,      // 单个红包最小额度
			repeat : options.repeat || 2,       // 最大额度红包连续出现次数上限
			digit : options.digit               // 红包金额保留小数点位数
		};
		// 一些判断获取的红包
		// that.setPackets(cfg.count, cfg.total, cfg.maxValue, cfg.minValue, cfg.repeat);
		// 一个算法获取的红包
		var arr = that.setPackets_1(cfg.count, cfg.total, cfg.maxValue, cfg.minValue, cfg.digit);
		// console.log(arr);
		return {
			getPacket : function(){
				return that.getPacket();
			}
		};
	}
};

module.exports = HongBao.init;

