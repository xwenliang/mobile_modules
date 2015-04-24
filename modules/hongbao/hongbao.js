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
	},

	/**
	* 领红包
	* @return  packet{number} 红包金额，红包领完，返回值为-1；
	*/
	getPacket : function(){

		return this.packets.length && this.packets.shift() || -1;
	},

	init : function(options){
		var that = HongBao, cfg = {
			number : options.number,            //红包个数
			total : options.total,              //总金额
			maxValue : options.maxValue || 1,   //单个红包最大额度
			minValue : options.minValue || 0.1, //单个红包最小额度
			repeat : options.repeat || 2        //最大额度红包连续出现次数上限
		};
		that.setPackets(cfg.number, cfg.total, cfg.maxValue, cfg.minValue, cfg.repeat);
		return {
			getPacket : function(){
				return that.getPacket();
			}
		};
	}
};

module.exports = HongBao.init;

