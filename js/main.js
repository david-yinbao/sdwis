/*
* 主程序
* by zouwei, 2015-05-10
* */
var GDYB = {};
var dmt = new dMapTools();
//page类，负责页面公用js逻辑
GDYB.Page = {
    curPolygon:null,
    curMap: null,
    curPage:null,
    elementData:{},
    LiveData:null,//强天气实况数据
    ConsistentData:null, //检查一致性数据列表，add by pope on 20161114
    //绑定页面事件
    bindPageEvent:function(){
        var t = this;
        function CreateLi(aList){//封闭CreateLi
            var content="";
            for(var i in aList){
                content+="<li id='"+aList[i].id+"'><a data-index='1'><img src='"+aList[i].img+"'><span>"+aList[i].txt+"</span></a></li>";
            }
            return content;
        }
        //强天气监测按钮事件
        /*$("#skjk_btn").click(function(){
            GridForecast.isDLYB = true;
            if(!$(this).hasClass("active")){
                $(".root").find("a.active").removeClass("active");
                $(this).addClass("active");
                t.curPage&&t.curPage.destroy2();
                t.curPage = GDYB.QTQSKPage;
                GDYB.QTQSKPage.active();
            }
            GDYB.Legend.update(null);
        });*/
        //临近预报按钮事件
        /*$("#ljyb_btn").click(function(){
            GridForecast.isDLYB = true;
            if(!$(this).hasClass("active")){
                $(".navigation").find("button.active").removeClass("active");
                $(this).addClass("active");
                t.curPage &&t.curPage.destroy2();
                t.curPage = GDYB.LJYBPage;
                GDYB.LJYBPage.active();
            }
        });*/
        //短时预报按钮事件
		/* change by fanjibing
        $("#dsyb_btn").click(function(){
            if(!$(this).hasClass("active")){
                $(".root").find("a.active").removeClass("active");
                $(this).addClass("active");
                t.curPage&&t.curPage.destroy2();
                t.curPage = GDYB.DLYBPage;
                GDYB.DLYBPage.active();
                $("#nav_menu").html("<li id='menu_dsyb'>"
                    +"<a data-index='1'>"
                    +"    <img src='imgs/img_element.png'>"
                    +"        <span>短时预报</span>"
                    +"    </a></li>");
                GDYB.SideWrapper.setActive("menu_dsyb");
                GDYB.SideWrapper.register();
            }
            GDYB.Legend.update(null);
        });
		*/
		//山洪地质灾害按钮事件 add by pope on 20170111
        $("#dzzh_btn").on("click",function(){
            if(!$(this).hasClass("active")){
                var layout = new Layout();
                $(".navigation").find("button.active").removeClass("active");
                $(this).addClass("active");
                // $("#sideWrapper").hide(); //去除左边列表
                t.curPage && t.curPage.destroy();
                t.curPage = GDYB.DisasterManagePage;
                GDYB.DisasterManagePage.active();
                layout.showNavMenu();
                layout.navMenuEvent();
                GDYB.SideWrapper.setActive("");
                GDYB.SideWrapper.register();
            }
        });
		//给左侧菜单按钮绑定事件
        $("#displayBtn").click(function(){
            if($(this).html()=="&lt;"){//<
                $(this).html("&gt;");//>
				$("#menu").css("width","0px");
				$("#map_div").css("left","5px");
				$("#displayBtn").css("display","block");
                $("#menu").removeClass("menu_normal").addClass("menu_minimize");
                $("#map_div").removeClass("map_normal").addClass("map_maximize");
                //$("#gridDiv").removeClass("grid_normal").addClass("grid_maximize");
                $("#gridws").css("left","5px"); // 改变grid工作空间的宽度自适应屏幕宽度
                $("#gridDiv").css("width","1690px");
                $("#menu_bd").css("display","none");
                $("#ZDYBDiv").css("width",parseInt($("#ZDYBDiv").css("width"))+338);//左侧面板宽度77px
                $("#zdybHeaderdiv").css("width",parseInt($("#zdybHeaderdiv").css("width"))+338);
                $("#zdybMaindiv").css("width",parseInt($("#zdybMaindiv").css("width"))+338);
                t.curPage.map.updateSize();
            }
            else{
				$("#menu").css("width","240px");
                $(this).html("&lt;");//<
                $("#menu").removeClass("menu_minimize").addClass("menu_normal");
                $("#map_div").removeClass("map_maximize").addClass("map_normal");
               // $("#gridDiv").removeClass("grid_maximize").addClass("grid_normal");
			    $("#map_div").css("left","246px");
                $("#gridws").css("left","396px"); // 改变grid工作空间的宽度自适应屏幕宽度
                $("#gridDiv").css("width","1350px");
                $("#menu_bd").css("display","block");
                $("#zdybHeaderdiv").css("width",parseInt($("#zdybHeaderdiv").css("width"))-338);
                $("#zdybMaindiv").css("width",parseInt($("#zdybMaindiv").css("width"))-338);
                $("#ZDYBDiv").css("width",parseInt($("#ZDYBDiv").css("width"))-338);//左侧面板宽度415px
                t.curPage.map.updateSize();
            }
        });
    },
    //入口方法
    main:function(page){

        this.bindPageEvent();

        this.curPage = page;
        page.active();

        var userName = $.cookie("userName");
        var password = $.cookie("password");
        if (userName != null && password != null) {
            GDYB.GridProductClass.currentUserName = userName;
            if(typeof($("#span_user")[0]) != "undefined" && typeof($("#a_exit")[0]) != "undefined"){
                $("#span_user")[0].innerHTML =$.cookie("departName")+'-'+$.cookie("showName");
                $("#a_exit")[0].innerHTML = "退出";
            }
        }
        else{
            if(typeof($("#a_exit")[0]) != "undefined")
                $("#a_exit")[0].innerHTML = "登录";
        }
		$("#setMapBoundsId").unbind("click");
        $("#setMapBoundsId").click(function(){
			 if (!$('#div_mapBoundsContent').hasClass("div_mapBoundsContent")){
                dmt.createMapBoundsSet();
                $('#div_mapBoundsContent').addClass("div_mapBoundsContent");
            }else{
                $('#div_mapBoundsContent').html("");
                $('#div_mapBoundsContent').removeClass("div_mapBoundsContent");
            }
        });
		if (location.search && location.search.indexOf('?zdyb')> -1){
            $(".navigation").find("button.active").removeClass("active");
            $("#zdyb_btn").addClass("active");
            $("#zdyb_btn").css("display", "none");
            $("#sjll_btn").css("display", "none");
            $("#gdyb_btn").css("display", "none");
            $("#xtgl_btn").css("display", "none");
            this.curPage&&this.curPage.destroy();
            this.curPage = GDYB.ZDYBPage;
            GDYB.ZDYBPage.active();
            $("#nav_menu").html("<li id='InitialField'>"
                +"<a data-index='1'>"
                +"    <img src='imgs/img_level.png'>"
                +"        <span>站点预报</span>"
                +"    </a></li>");

            $("#gridws").remove();
        }
		// if (location.search && location.search.indexOf('?manage')> -1){
		// 	this.curPage&&this.curPage.destroy();
		// 	this.curPage = GDYB.ZDYBPage;
		// 	GDYB.ZDYBSZPageClass.active();
		// 	$("#nav_menu").html("<li id='InitialField'>"
		// 		+"<a data-index='1'>"
		// 		+"    <img src='imgs/img_level.png'>"
		// 		+"        <span>站点预报管理</span>"
		// 		+"    </a></li>");
        //
		// 	$("#gridws").remove();
		// }
        //鼠标滑过地图切换DIV
        $(".mapLayer").hover(function(){
            // console.log("houvereee");
            var $this = $(this).find(".moreMapLayer");
            $this.css("display","block");
        },function(){
            var $this = $(this).find(".moreMapLayer");
            $this.css("display","none");
        });
        dmt.initLayerManager();
		dmt.init();
    }
}

GDYB.ConsistencyCheck = new ConsistencyCheck($("#map_div")); //add by pope on 20170522
GDYB.DisasterManagePage = new DisasterManage(); //山洪灾害管理页面
GDYB.SKZLPage = new SKZLPageClass();
GDYB.WXLDPage = new WXLDPageClass();
GDYB.SZMSPage = new SZMSPageClass();
GDYB.DLYBPage = new DLYBPageClass();
GDYB.GDYBPage = new GDYBPageClass();
GDYB.ZDYBPage = new ZDYBPageClass();
GDYB.ZDYB = new ZDYB();
GDYB.XTGLPage = new XTGLPageClass();
GDYB.ZDYBSZPageClass = new ZDYBSZPageClass();
GDYB.ZDGLPage = new ZDGLPageClass();
GDYB.GDZSPage = new DisplayPageClass();
GDYB.CPZSPage = new CPZSPageClass();//产品展示
GDYB.QDLJCPage=new QDLJCPageClass();//强对流监控
GDYB.LJYBPage=new LJYBPageClass();
GDYB.DSYBPage=new DSYBPageClass();
GDYB.SJZDPage=new SJZDPageClass();//上级指导
GDYB.YJZDPage=new YJZDPageClass();//预警指导
GDYB.ZDFXPage=new ZDFXPageClass();//预警信号
GDYB.YJXHPage=new YJXHPageClass();//预警信号
GDYB.ZCDPage=new ZCDPageClass();//中尺度分析
GDYB.GDZSNEWPage = new GridDidplayPageClass();
GDYB.ZHYJPage = new ZHYJPageClass();
GDYB.GridProductClass = new GridProductClass();
GDYB.RadarDataClass = new RadarDataClass();
GDYB.AWXDataClass = new AWXDataClass();
GDYB.MicapsDataClass = new MicapsDataClass();
GDYB.TextDataClass = new TextDataClass();
GDYB.CimissDataClass = new CimissDataClass();
GDYB.DataServer = new DataServer();
GDYB.ChartClass = new ChartClass();

GDYB.SideWrapper = new SideWrapper();

GDYB.Legend = new Legend();
GDYB.LegendCimiss = new LegendCimiss();

GDYB.CorrectAction = new CorrectAction();
GDYB.MagicTool = new MagicTool();
GDYB.FilterTool = new FilterTool();
GDYB.FeatureUtilityClass = new FeatureUtilityClass();

function InputOnChange(e){
    GDYB.ChartClass.refreshChart(e.id, e.value);
}
//add by Dinlerkey on 20170315 短临预报聊天功能
//GDYB.Chat = new Chat(dealWithMessage);
//GDYB.Chat.initialize();
