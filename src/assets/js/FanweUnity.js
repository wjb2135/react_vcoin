/**
 * 检测操作
 * @type {Object}
 */
const checkAction = {

	/**
	 * 检测字符串最小长度
	 * @param  {String}  value  指定字符串
	 * @param  {Number}  length 指定长度
	 * @param  {Boolean} isByte 是否字节检测
	 * @return {Boolean}         true: 该字符串不小于指定长度; false: 该字符串小于指定长度
	 */
	minLength: function(value, length , isByte){
		var strLength = value.trim().length;
	    if(isByte)
	        strLength = this.getStringLength(value);
	        
	    return strLength >= length;
	},

	/**
	 * 检测字符串最大长度
	 * @param  {String}  value  指定字符串
	 * @param  {Number}  length 指定长度
	 * @param  {Boolean} isByte 是否字节检测
	 * @return {Boolean}         true: 该字符串不大于指定长度; false: 该字符串大于指定长度
	 */
	maxLength: function(value, length , isByte){
		var strLength = value.trim().length;
	    if(isByte)
	        strLength = this.getStringLength(value);
	        
	    return strLength <= length;
	},

	/**
	 * 检测手机号是否合法
	 * @param  {Number} value 指定手机号
	 * @return {Boolean}       true: 合法; false: 不合法
	 */
	checkMobilePhone: function(value){
		var regMobile = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
		if(value.trim()!='')
			return true;
	    else
	        return false;
	},

	/**
	 * 	检测邮箱地址是否合法
	 * @param  {String} val 指定邮箱地址
	 * @return {Boolean}     true: 合法; false: 不合法
	 */
	checkEmail: function(val){
		var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; 
		return reg.test(val);
	},

	/**
	 * 检测数值是否为整数
	 * @param  {Number} val 指定数值
	 * @return {Boolean}     true: 是整数; false: 不是整数
	 */
	checkint: function(val){
		return val%1 === 0
	},

	/**
	 * 检测指定对象是否为空
	 * @param  {任意类型} val 指定对象
	 * @return {Boolean}     true: 为空; false: 不为空
	 */
	checkEmpty: function(val){
	    switch (typeof val){
	        case 'undefined' : return true;
	        case 'string'    : if(val.trim().length == 0) return true; break;
	        case 'boolean'   : if(!val) return true; break;
	        case 'number'    : if(0 === val) return true; break;
	        case 'object'    :
	            if(null === val) return true;
	            if(undefined !== val.length && val.length==0) return true;
	            for(var k in val){return false;} return true;
	            break;
	    }
	    return false;
	}

},

/**
 * 对象值操作
 * @type {Object}
 */
objAction = {
	/**
	 * 从数组中删除指定值元素
	 * @param  {Array} arr 指定数组
	 * @param  {[type]} val 要删除的元素
	 * @return {Array}     返回删除后的数组
	 */
	removeByValue: function(arr, val){
	 	for(var i=0; i<arr.length; i++) {
	    	if(arr[i] == val) {
	      		arr.splice(i, 1);
	      		break;
	    	}
  		}
	},

	/**
	 * 获取字符串长度
	 * @param  {String} str 指定字符串
	 * @return {Number}     返回该字符串长度
	 */
	getStringLength: function(str){
	 	str = str.trim();
	    if(str=="")
	        return 0; 
	        
	    var length=0; 
	    for(var i=0;i <str.length;i++) 
	    { 
	        if(str.charCodeAt(i)>255)
	            length+=2; 
	        else
	            length++; 
	    }
	    return length;
	},

	/**
	 * 获取地址栏请求参数
	 * @param  {String} name 指定地址栏参数属性
	 * @return {[type]}      返回参数属性值
	 */
	getQueryString: function(name) {
     	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     	var r = window.location.search.substr(1).match(reg);
     	if(r!=null)return  unescape(r[2]); return null;
	},

	/**
	 * 限制只能输入金额
	 * @param  {[type]} th 指定对象
	 * @return {[type]}    [description]
	 */
	amount: function(th){
	    var regStrs = [
	        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
	        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
	        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
	        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
	    ];
	    for(var i=0; i<regStrs.length; i++){
	        var reg = new RegExp(regStrs[i][0]);
	        th.value = th.value.replace(reg, regStrs[i][1]);
	    }
	}
};

export { checkAction, objAction };