﻿/*
* 日期选择器
* by zouwei, 2015-05-10
*
* */
function DateSelecterSK(minView,startView,format,ims){
    this.div = null;
	this.leftBtn = null;
	this.rightBtn = null;
	this.leftBtn1 = null;
	this.rightBtn1 = null;
    this.input = null;
    this.intervalMinutes = typeof(ims)=='undefined'?60:ims; //（上下翻）间隔分钟数，默认6分钟
    this.datetimeSerial = []; //时序
    this.minView = minView;
	//this.minuteStep = 6;
    //创建选择框
    this.createInput = function(){
        var t = this;
        this.div = $("<div style='border:1px solid rgba(65,65,65,0.5);border-radius: 3px;width: 230px;height: 30px;margin-left: -16px;padding-top: 4px;'>");
		this.leftBtn = $("<img>")
			.addClass("dateBtn dateBtnUp")
			.attr("src","imgs/dateBtnUp.png")
			.appendTo(this.div).click(function(){
				var lt = -24;
				if(t.intervalMinutes == 6){
					lt = -10;
				}
				t.changeHours(lt*t.intervalMinutes);
			});
		this.rightBtn = $("<img>")
			.addClass("dateBtn dateBtnDown")
			.attr("src","imgs/dateBtnDown.png")
			.appendTo(this.div).click(function(){
				var lb = 24;
				if(t.intervalMinutes == 6){
					lb = 10;
				}
				t.changeHours(lb*t.intervalMinutes);
			});
        this.input = $("<input>")
            .attr({
                "style":"text-align:center;color:#5B5B5B;height:auto;padding:2px;font-size:15px;",
                "type":"text",
                "value":this.getNowTime(false)
            })
            .appendTo(this.div)
            .datetimepicker(
            {
                language:  "zh-CN",
                weekStart: 1,
                todayBtn:  1,
                autoclose: true,
                todayHighlight: 1,
                startView:typeof(startView) == "undefined"?1:startView,        //首页视图,0-分钟,1-小时,2-日
                minView:typeof(minView) == "undefined"?1:minView,		//最小视图,0-分钟,1-小时,2-日
                forceParse: 0,
                showMeridian: 1,
				//minuteStep: t.minuteStep,		//分钟间隔
                format: typeof(format) == "undefined"?"yyyy-mm-dd hh:00:00":format,
                //initialDate:this.getNowTime(false),
                startDate:"2000-01-01 00:00:00",
                endDate:"2100-12-31 23:59:59"

            });
		this.leftBtn1 = $("<img>")
			.addClass("dateBtn dateBtnUp")
			.attr("src","imgs/dateBtnUp.png")
			.appendTo(this.div).click(function(){
				t.changeHours(-1*t.intervalMinutes);
			});
        this.rightBtn1 = $("<img>")
            .addClass("dateBtn dateBtnDown")
            .attr("src","imgs/dateBtnDown.png")
            .appendTo(this.div).click(function(){
                t.changeHours(t.intervalMinutes);
            });
        $(".datetimepicker").css({
            //"margin-top":"-250px"
        });
    };
    //获取当前时间
    this.getNowTime = function(isZh){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        //var minutes = 0;
        var seconds = 0;
        if(format == "yyyy-mm-dd"){
            return year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2);
        }else if(format == "yyyy-mm-dd hh:00:00"){
			return year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2) + " " + (Array(2).join(0)+hour).slice(-2) + ":00:00";
		}
        if(isZh){
            return year + "年" + (Array(2).join(0)+month).slice(-2) + "月" + (Array(2).join(0)+day).slice(-2) + "日 " + (Array(2).join(0)+hour).slice(-2) + "时";
        }
        else{
            return year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2) + " " + (Array(2).join(0)+hour).slice(-2) + ":" + (Array(2).join(0)+minutes).slice(-2)+":"+(Array(2).join(0)+seconds).slice(-2);
        }
    };
    //获取选择时间
    this.getCurrentTime = function(isZh){
        var curTimeStr =  this.input.val();
        var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/,"$1"));
        var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/,"$1"));
        var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/,"$1"));
        var hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1"));
        var minutes = typeof(this.minView)&&this.minView==0?parseInt(curTimeStr.replace(/\d*-\d*-\d* \d*:(\d*):\d*/,"$1")):0;
        var seconds = 0;
        if(isZh){
            return year + "年" + (Array(2).join(0)+month).slice(-2) + "月" + (Array(2).join(0)+day).slice(-2) + "日 " + (Array(2).join(0)+hour).slice(-2) + "时"+(Array(2).join(0)+minutes).slice(-2) + "分"+(Array(2).join(0)+seconds).slice(-2) + "秒";
        }
        else{
            return year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2) + " " + (Array(2).join(0)+hour).slice(-2)+ ":" +(Array(2).join(0)+minutes).slice(-2) + ":"+(Array(2).join(0)+seconds).slice(-2);
        }
    };
    //获取选择时间，返回Date类型
    this.getCurrentTimeReal = function(){
        var curTimeStr =  this.input.val();
        var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/,"$1"));
        var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/,"$1"));
        var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/,"$1"));
        var hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1"));
        var minutes = 0;
        var seconds = 0;
        var date = new Date();
        date.setFullYear(year,month - 1,day);
        date.setHours(hour, minutes, seconds, 0);
        return date;
    };
    //获取选择整点时间
    this.getCurrentTimeClock = function(isZh){
        var curTimeStr =  this.input.val();
        var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/,"$1"));
        var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/,"$1"));
        var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/,"$1"));
        var hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1"));
        var minutes = 0;
        var seconds = 0;
        if(isZh){
            return year + "年" + (Array(2).join(0)+month).slice(-2) + "月" + (Array(2).join(0)+day).slice(-2) + "日 " + (Array(2).join(0)+hour).slice(-2) + "时"+(Array(2).join(0)+minutes).slice(-2) + "分"+(Array(2).join(0)+seconds).slice(-2) + "秒";
        }
        else{
            return year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2) + " " + (Array(2).join(0)+hour).slice(-2)+ ":" +(Array(2).join(0)+minutes).slice(-2) + ":"+(Array(2).join(0)+seconds).slice(-2);
        }
    };

    //设置当前时间
    this.setCurrentTime = function(curTimeStr){
        var oldTime = this.input.val();
        this.input.val(curTimeStr);
        if(oldTime != curTimeStr)
            this.input.change(); //触发事件
        this.input.datetimepicker('update');
    };
    this.setDatetimeSerial = function(serial){
        this.datetimeSerial = serial;
    };
    //设置（上下翻）分钟数，同时自动跳转到临近的时间
    this.setIntervalMinutes = function(deltaMinutes){
        this.intervalMinutes = deltaMinutes;
        try {
            if (deltaMinutes > 60 && deltaMinutes % 60 == 0) { //如果是整点
                var deltaHour = deltaMinutes/60;
                var curTimeStr = this.input.val();
                var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/, "$1"));
                var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/, "$1"));
                var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/, "$1"));
                var hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/, "$1"));
                var minutes = 0; //既然是整点，那么分钟自然为0
                var seconds = 0;
                var x = 8;
                if (hour >= 8)
                    x = 8 + deltaHour * Math.floor((hour - 8) / deltaHour);
                else
                    x = 8 - deltaHour * Math.floor((8 - hour) / deltaHour + 0.9999);
                x = x < 0 ? 24 + x : x;
                hour = x;
                var timeStr = year + "-" + (Array(2).join(0) + month).slice(-2) + "-" + (Array(2).join(0) + day).slice(-2) + " " + (Array(2).join(0) + hour).slice(-2) + ":" + (Array(2).join(0) + minutes).slice(-2) + ":" + (Array(2).join(0) + seconds).slice(-2);
                this.setCurrentTime(timeStr);
            }
        }
        catch(err){
            console.log("DateSelectSK.setIntervalMinutes "+ err);
        }
    };

    //增加或减少小时数
    this.changeHours = function(value){
        var curTimeStr =  this.input.val();
        //var newTimeStr = curTimeStr;
        if(this.datetimeSerial != null && this.datetimeSerial.length > 0) //从时序中获取
        {
            for(var i=0;i<this.datetimeSerial.length; i++) //从小到大排序过的
            {
                if(value > 0)
                {
                    if(curTimeStr < this.datetimeSerial[i])
                    {
                        curTimeStr = this.datetimeSerial[i];
                        break;
                    }
                }
                else if(value < 0)
                {
                    if(i>0 && curTimeStr <= this.datetimeSerial[i])
                    {
                        curTimeStr = this.datetimeSerial[i-1];
                        break;
                    }
                }
            }
            this.input.val(curTimeStr).change(); //触发事件
            this.input.datetimepicker('update');
            return;
        }
//        if(!newTimeStr.equals(curTimeStr))
//        {
//            this.input.val(newTimeStr);
//            this.input.datetimepicker('update');
//            return;
//        }

        var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d*/,"$1"));
        var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d*/,"$1"));
        var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*)/,"$1"));
        var hour = 0;
        var minutes = 0;
        var seconds = 0;
        if(curTimeStr.length>10){
            year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/,"$1"));
            month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/,"$1"));
            day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/,"$1"));
            hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1"));
            minutes = parseInt(curTimeStr.replace(/\d*-\d*-\d* \d*:(\d*):\d*/,"$1"));;
        }
        var date1 = new Date();
        date1.setFullYear(year);
        date1.setMonth(month-1);
        date1.setDate(day);
        date1.setHours(hour);
        date1.setMinutes(minutes);
        var time = date1.getTime();
        //time += value*60*60*1000; //value以小时为单位
        time += value*60*1000;      //value以分钟为单位，考虑到雷达逐6分钟
        date1.setTime(time);

        var year = date1.getFullYear();
        var month = date1.getMonth()+1;
        var day = date1.getDate();
        var hour = date1.getHours();
        var minutes =date1.getMinutes();
        var seconds =0;
        if(curTimeStr.length>10){
            curTimeStr = year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2) + " " + (Array(2).join(0)+hour).slice(-2) + ":" +(Array(2).join(0)+minutes).slice(-2) + ":"+(Array(2).join(0)+seconds).slice(-2);
        }
        else{
            curTimeStr = year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2);
        }
        this.input.val(curTimeStr);
        this.input.datetimepicker('update');
    };
	this.getDefineCurrentTime = function(hour){
		var curTimeStr =  this.input.val();
		var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/,"$1"));
		var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/,"$1"));
		var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/,"$1"));
		var hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1"))-hour;
		var minutes = typeof(this.minView)&&this.minView==0?parseInt(curTimeStr.replace(/\d*-\d*-\d* \d*:(\d*):\d*/,"$1")):0;
		var seconds = 0;
		return year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2) + " " + (Array(2).join(0)+hour).slice(-2)+ ":" +(Array(2).join(0)+minutes).slice(-2) + ":"+(Array(2).join(0)+seconds).slice(-2);
	};

	//获取选择时间，可选校准adjustTime 单位分钟
	this.getSelectTime = function(isZh,isRad,adjustTime){
		var curTimeStr =  this.input.val();
		var bjSj = new Date(curTimeStr);
		var bjSjMiles = 0;
		if(!(adjustTime == null || typeof(adjustTime) == "undefined" || adjustTime*1 == 0 )){
			bjSjMiles = bjSj.getTime()+(adjustTime*1*60*1000);
		}else{
			bjSjMiles = bjSj.getTime();
		}
		var myCurTime = getTimeStr(bjSjMiles,isRad);
		if(isZh){
			return myCurTime.substr(0,4) + "年" + myCurTime.substr(4,2)+ "月" + myCurTime.substr(6,2) + "日 " + myCurTime.substr(8,2) + "时"+myCurTime.substr(10,2)+"分";
		}else{
			return myCurTime.substr(0,4)+"-"+myCurTime.substr(4,2)+"-"+myCurTime.substr(6,2)+" "+myCurTime.substr(8,2)+":"+myCurTime.substr(10,2)+":00";
		}
	};

	function getTimeStr(tmile,type){
		//格林尼治时间 ，返回类型 雷达/标准
		var dateTemp = new Date(tmile);
		var year = dateTemp.getFullYear();
		var month = dateTemp.getMonth()+1;
		var day = dateTemp.getDate();
		var hour = dateTemp.getHours();
		var minutes =dateTemp.getMinutes();
		var seconds = 0;
		if(type == "rad"){
			if (minutes >= 0 && minutes < 6) {
				minutes = 0;
			} else if (minutes >= 6 && minutes < 12) {
				minutes = 6;
			} else if (minutes >= 12 && minutes < 18) {
				minutes = 12;
			} else if (minutes >= 18 && minutes < 24) {
				minutes = 18;
			} else if (minutes >= 24 && minutes < 30) {
				minutes = 24;
			}else if (minutes >= 30 && minutes < 36) {
				minutes = 30;
			}else if (minutes >= 36 && minutes < 42) {
				minutes = 36;
			} else if (minutes >= 42 && minutes < 48) {
				minutes = 42;
			}else if (minutes >= 48&& minutes < 54) {
				minutes = 48;
			}else if (minutes >= 54 && minutes < 60) {
				minutes = 54;
			}
		}
		return year+ (Array(2).join(0)+month).slice(-2) + (Array(2).join(0)+day).slice(-2) + (Array(2).join(0)+hour).slice(-2)+(Array(2).join(0)+minutes).slice(-2)+(Array(2).join(0)+seconds).slice(-2);
	}
    //初始化
    this.init = function(){
        this.createInput();
    };
    this.init();
}
