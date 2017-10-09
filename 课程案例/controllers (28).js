angular.module('starter.controllers', [])
//主页
.controller('homeCtrl', function($scope,$ionicSideMenuDelegate,$http,$rootScope,$ionicSlideBoxDelegate,HomeGoodlistRow,locals) {
		//是否加载引导动画
		if(!(locals.get("isload")=="已加载")){
			
			window.location="#/tab/guide";
			
		}
		
		//侧边菜单
		
		$scope.toggleLeft=function(){
				$ionicSideMenuDelegate.toggleLeft();
		}
		
		//请求主页数据
	$http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=indexshow",'').
		success(function(response){	
			console.log(response);		
			//轮播数据、
			
		$scope.bannerData=response.data.bannerList;
		 //更新轮播图
        $ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
        //让轮播图循环播放
        $ionicSlideBoxDelegate.$getByHandle("slideimgs").loop("true");	
		//好评榜数据
			
        $scope.homeGoodlistRows = [[response.data.goodList[0],response.data.goodList[1]],[response.data.goodList[2],response.data.goodList[3]]];

		//最新课程数据			
		 $scope.homeNewLists = [[response.data.newList[0],response.data.newList[1]],[response.data.newList[2],response.data.newList[3]]];
			
		//猜你喜欢
		 $scope.homechooseLists = response.data.chooseList;
	})
		
		//跳转学习页面
		$scope.tz_study=function(id){
			
			window.location="#/tab/homeStudy/"+id;
			
		}
	
})

//课程列表
.controller('lessonlistCtrl', function($scope,$http,$rootScope,$timeout) {
	//tab切换
	
	$scope.lilist=false;
	$scope.lcolor={color:"#333"};
	$scope.courselist=function(){
		
		$scope.lilist=!$scope.lilist;
		$scope.prlist=false;
			$scope.pcolor={color:"#333"};
		if($scope.lilist==true){
			  $scope.lcolor={color:"#63aafc"};
		}else{
			$scope.lcolor={color:"#333"};
		}
	}
	
	$scope.price=function(){
		$scope.prlist=!$scope.prlist;
		$scope.lilist=false;
		$scope.lcolor={color:"#333"};
		if($scope.prlist==true){
			  $scope.pcolor={color:"#63aafc"};
		}else{
			$scope.pcolor={color:"#333"};
		}
		
	}
	//请求专业分类数据
	$http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=getcategory",'').
	success(function(response){
				console.log(response);
			$scope.courseList=response.data;
	})
	//价格按钮的数据
	 $scope.priceBtns=[
      {id:0, btnName:"全部"},
      {id:1, btnName:"免费"},
      {id:2, btnName:"收费"}
    ]
	 $scope.nowPage=0;
	 
	//存放回来的数据
	$scope.lists = [];
    $scope.searchText='';
    $scope.CategoryId = '';
    $scope.CpriceId = '';
      //上拉加载更多数据loadMore函数
    $scope.moredata = true;//为true时加载数据
	//调取后台数据
	 $scope.goPage=function(pageStart){
	 		//准备要发送数据
	 		$scope.moredata=false;
	 		console.log(pageStart);
	 		var mydata={
	 			searchText:$scope.searchText,
	 			CategoryTwo:$scope.CategoryId,
	 			CpriceId:$scope.CategoryId,
	 			pageStart:pageStart
	 		}
	 		$http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=courseshow",mydata)
	 		.success(function(response){
	 				console.log(response);
	 				//一共有几页
	 				 $scope.totalPage =Math.ceil(response.data.count/response.data.pageSize);
	 				 //把回来的数据进行连接
	 				 $scope.lists= $scope.lists.concat(response.data.list);
	 				 //存储当前页码
	 				 $scope.nowPage=response.data.pageStart;
	 				 
	 				 if($scope.totalPage>response.data.pageStart){
	 				 		$scope.moredata=true;	
	 				 }
	 				 
	 				 
	 		})
	 		
	 }
	 	 //上拉加载
	 $scope.loadMore=function(){
//	 	调取后台数据
//				goPage() --传页数
		if($scope.moredata){
			 $scope.goPage($scope.nowPage+1);
	 	 $scope.$broadcast('scroll.infiniteScrollComplete');
		}
		
	 }
	 //上拉加载更多事件
    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
    })
    
	//搜索和筛选操作
	 $scope.pricouSearch=function(searchText,CategoryTwo,CpriceId){
	 			
	 	$scope.searchText=searchText;
	 	 $scope.CategoryId=CategoryTwo;
    	$scope.CpriceId = CpriceId;
    	$scope.lists=[];
    	//
    $scope.nowPage = 0;
	$scope.moredata=true;
	$scope.$broadcast('scroll.infiniteScrollComplete');
   	  $scope.prlist=false;
      $scope.lilist=false;
      $scope.lcolor={color:"#333"};
      $scope.pcolor={color:"#333"};
    	
    		
}
	//搜索
	$scope.myKeyup=function(e){
		 var keycode = window.event?e.keyCode:e.which;
		 if(keycode==13||keycode==0){
		 $scope.pricouSearch($scope.searchTexts,'','');
		 		$scope.searchTexts="";
		 }
		 
	}
	
	//下拉刷新
	$scope.doRefresh=function(){
		$timeout(function(){
			 $scope.pricouSearch('','全部','');
			 $scope.$broadcast("scroll.refreshComplete");
		},1000)
	}
		
  
})


.controller('mycourseCtrl', function($scope,mycourseList,$rootScope,$http) {
 	 //tab切换
 	$scope.dl_tf=true;//--登录
 	
 	 $scope.data = {
      showDelete: false
    };
 	$scope.color={color:"#63aafc"};
    $scope.colorc={color:"#333"};
    $scope.mycou=true;
    $scope.mycol=false;
 	 $scope.mylesson=function(){
 	 	$scope.data.showDelete=false;
 	 	 $scope.mycou=true;
 	 	  $scope.mycol=false;
 	 	  $scope.color={color:"#63aafc"};
 	 	  $scope.colorc={color:"#333"};
 	 }
 	 
 	 $scope.course=function(){
 	 	$scope.data.showDelete=false;
 	 	$scope.mycol=true;
 	 	$scope.mycou=false;
 	 	$scope.colorc={color:"#63aafc"};
 	 	$scope.color={color:"#333"};
 	 }
   		
   		//加载我的课程数据
// $scope.Mycourse=mycourseList.all();
   	console.log($scope.courseList);
   	//删除方法
 	$scope.del=function(item){
 			mycourseList.remove(item);
 	}
 	//跳转第二页
 	$scope.tiao=function(page){
 			
 			 $scope.Mycourse=mycourseList.page(page)
 	}
 	//调取我的课程数据
 	$http.get($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=mycourse",'')
 	.success(function(response){
 		$scope.courseData=response.data;
 		$scope.dl_tf=false;
 	})
 	//我的收藏数据
 	$http.get($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=mycollection",'')
 	.success(function(response){
 		$scope.collectionData=response.data;
 		$scope.dl_tf=false;
 	})
 	
 	//删除收藏
 	$scope.onItemDelete=function(item){
 		var data={
 			courseId:item.ID
 		}
 		$http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=deletecollection",data)
 		.success(function(response){
 			
 			$scope.collectionData.splice($scope.collectionData.indexOf(item),1);
 			
 		})
 		
 	}
 	
 	
 	
})
//登录页面
.controller("personalCtrl",function($scope,$http,$rootScope){
		  $rootScope.hideTabs = false;
		//已经登录
		$http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=isLogin",'')
		.success(function(response){
			if(response.success){
				
				window.location="#/tab/information";
				
			}
		})
	
		
		//未登录
		 //输入框数据
		    $scope.loginuser={
		      name:'',
		      password:''
		    };
		
		$scope.doLogin=function(){
				
			if($scope.loginuser.name&&$scope.loginuser.password){
					var mydata={
						userName:$scope.loginuser.name,
						userPwd:$scope.loginuser.password
					}
					
				$http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=login",mydata)
				.success(function(response){
					if(response.err){
						alert(response.err)
					}else{
						
						window.location="#/tab/information";
					}
					
				})
					
				
				
				
			}
			
			
			
			
		}
})
//个人中心
.controller('InformationCtrl',function($scope,$rootScope,$http){
	 //获取个人信息
    $http.get($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=returnuserinfo",'')
      .success(function(response){
   	
   			console.log(response);
   			$scope.name=response.userName;
   			$scope.email=response.email;
   			$scope.phone=response.phone;   
      })
      //退出登录
      $scope.quit=function(){
      	$http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=quit",'')
      	.success(function(response){
      		if(response.success){
      			window.location="#/tab/personal";
      		}
      	})
      
      }
      
      
	
})

//注册
.controller("RegisterCtrl",function($scope,$ionicPopup,$rootScope,$http){
	  /*注册页面输入框数据*/
    $scope.infor={
      name:'',
      email:'',
      phone:'',
      password:'',
      passwordt:''
    };
    
    //注册
    $scope.register=function(infor){
    	  var email_yz  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	  var photo_yz = /^1(3|4|5|7|8)\d{9}$/;
    	if(infor.name&&infor.email&&infor.phone&&infor.password&&infor.passwordt){
    			if(!email_yz.test(infor.email)){
    				$ionicPopup.alert({
    					title:"温馨提示",
    					template:"邮箱错误"
    				})
    			}else if(!photo_yz.test(infor.phone)){
    				$ionicPopup.alert({
    					title:"温馨提示",
    					template:"手机号码格式错误"
    				})
    			}else if(infor.password!=infor.passwordt){
    				$ionicPopup.alert({
    					title:"温馨提示",
    					template:"俩次密码不一致"
    				})
    			}else{
    				//发送给后台
    				
    				var mydata={
    					userName:$scope.infor.name,
    					email:$scope.infor.email,
    					phone:$scope.infor.phone,
			            userPwd:$scope.infor.password,
			            nickname:'',
			            userPic:''
    				}
    				
    			$http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=add",mydata)	
    			.success(function(response){
    					if(response.err){
    						$ionicPopup.alert({
		    					title:"温馨提示",
		    					template:response.err
		    				})
    					}else{
    						$ionicPopup.alert({
		    					title:"温馨提示",
		    					template:"注册成功"
		    				})
    						window.location="#/tab/personal"
    					}
    			})
    				
    				
    				
    		}
    			
    		
    	}else{
    		$ionicPopup.alert({
    			title:"温馨提示",
    			template:"请输入完整内容"
    		})
    		
    	}
    		
    	
    	
    	
    		
   }
	
	
	
})


//------------------课程学习页面
.controller("homeStudyCtrl",function($scope,$stateParams,$ionicModal,$stateParams,$http,$rootScope){
		//tab切换
		$scope.mymulu=true;
		$scope.myxiangqing=false;
		$scope.color={color:"#63aafc"};
		
		$scope.ml_left=function(){
			$scope.mymulu=true;
			$scope.myxiangqing=false;
			$scope.color={color:"#63aafc"};
			$scope.colorc={color:"#333"};
		}
		$scope.xq_right=function(){
			$scope.mymulu=false;
			$scope.myxiangqing=true;
			$scope.color={color:"#333"};
			$scope.colorc={color:"#63aafc"};
		}
		//视频播放
		$scope.broadcast=function(url,id){
			//
			try{
				//视频播放插件
				 window.plugins.html5Video.initialize({
			          "video1" : $rootScope.URLAdmin + url
			        });
			        $scope.pcTrue = false;
			
			        if($scope.video_login==false && $scope.shadow.video_buy==false){
			
			          window.plugins.html5Video.play("video1");
		
		        }
			}catch(e){
				//浏览器播放
				$scope.Vurl=$rootScope.URLAdmin+url;
				$scope.pcTrue = true;
				
			}
			//目录的样式切换
			for(var i=0;i<$scope.CDlists.length;i++){
				for(var j=0;j<$scope.CDlists[i].Vlist.length;j++){
						if(id==$scope.CDlists[i].Vlist[j].ID){
							 $scope.CDlists[i].Vlist[j].isViewing = true;
							
						}else{
							 $scope.CDlists[i].Vlist[j].isViewing = false;
						}
					
				}
				
				
			}
			
			
			
		}
		
		
		
		//获取课程id
		var mydata={
			courseId:$stateParams.myId
		}
		//获取参数
		$scope.myId=$stateParams.myId;
	//购买遮罩
    $scope.shadow = {
      video_buy:false
    }
		//判断是否登录
		$http.post($rootScope.URLAdmin+'/Handler/UserHandler.ashx?action=isLogin')
		.success(function(response){
			if(response.success){
				//已登录--请求课程数据
				$http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=learnshow", mydata)
				.success(function(response){
					//评价可以评论
					console.log(response)
					 $scope.footerPingjia=false;
					//目录数据
					 $scope.CDlists = response.data.CDlist;
					//评价数据
					 $scope.evaluates = response.data.evaluate.list;
					 
					 //课程名称
					  $scope.Cname = response.data.Cname;
					  //显示收藏
					 $scope.collectionStr="";
					 $scope.isActive=response.data.ifColected;
				
					 if($scope.isActive==true){
					 	 $scope.collectionStr="已收藏"
					 }else{
					 	 $scope.collectionStr="收藏";
					 }
					 
		
					  //显示购买
					  $scope.buyStr="";
					  if(response.data.ifPay==true){
					  	//登录遮罩
					  		
					  	  $scope.shadow.video_buy = false;  //提示购买的隐藏
					  	  $scope.test ="active";//为蓝色
					  	 $scope.buyStr="已购买";
					  }else{
					  	$scope.shadow.video_buy = true;
					  	$scope.test ='';
					  	 $scope.buyStr="购买";
					  }
					  //默认播放第一条
					  
					  $scope.broadcast(response.data.CDlist[0].Vlist[0].Vurl,response.data.CDlist[0].Vlist[0].ID);
					  //设置当前播放的课件。
             		 $scope.CDlists[0].Vlist[0].isViewing = true;
				})
				
				
				
				
			}else{
				//未登录
				$http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=learnshow",mydata)
				.success(function(response){
						//目录数据
					 $scope.CDlists = response.data.CDlist;
					//评价数据
					 $scope.evaluates = response.data.evaluate.list;
					
					 //课程名称
					  $scope.Cname = response.data.Cname;
					 $scope.footerPingjia=true;
					 $scope.video_login=true;
					  $scope.buyStr="购买";
					 $scope.collectionStr="收藏";
					 
				})
				
				
				
				
			}
			
		})
	
	
		
		
})
 //学习脚步
 .controller("studyFooterCtrl",function($scope,$ionicModal,$stateParams,$http,$rootScope){
 			
		//创建评价模态
		$ionicModal.fromTemplateUrl("templates/modal.html",{
			 scope: $scope
		}).then(function(modal){
			$scope.modal=modal;
		})
		//收藏
		var mydata={
			courseId:$stateParams.myId
		}
		$scope.scGo=function(){
			$http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=collection",mydata)
			.success(function(response){
				console.log(response)
				$scope.isActive=response.ifColected;
				if($scope.isActive==true){
					 $scope.collectionStr="已收藏"
				}else{
					 $scope.collectionStr="收藏";
				}
				
				
			})
		}
		
		//购买
		$scope.payGo=function(){
			$http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=buy",mydata)
			.success(function(response){
				if(response.success){
					 $scope.test = "active";
					  $scope.buyStr="已购买";
					  $scope.shadow.video_buy=false; 
					
				}
				
			})
			
		}
 	
 })
 //评价控制器
 .controller("TaskCtrl",function($scope,$ionicPopup,$http,$rootScope,$stateParams){
 		
 		$scope.close=function(){
 			$scope.modal.hide();
 		}
 		 $scope.textareaValue = '';
 		//评价
 		$scope.createContact=function(){
 			var pjData={
 				courseId:$stateParams.myId,
 				evaluate:$scope.textareaValue
 			}
 			
 			if(!$scope.textareaValue){
 				$ionicPopup.alert({
 					title:"温馨提示",
 					template:"请输入内容"
 				})
 				
 			}else{
 				$http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=addcoursecomments",pjData)
 				.success(function(response){
 					if(response.success){
 						 $scope.modal.hide();
 					}
 				})
 			}
 			
 		}
 		
 })

//引导控制器
.controller("guideCtrl",function($scope,locals){
		$scope.goIndex=function(){
			
			locals.set("isload","已加载");
			window.location="#/tab/home";
			
		}
})



/*底部tabs隐藏显示的指令*/
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      
      link: function(scope, element, attributes) {
      	console.log(attributes)
        scope.$on('$ionicView.beforeEnter', function(){
          $rootScope.hideTabs=attributes.hideTabs;
         	
        });

        scope.$on('$ionicView.beforeLeave', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  })

