angular.module('starter.controllers', [])
//主页
.controller('homeCtrl', function($scope,$ionicSideMenuDelegate,$http,$rootScope,$ionicSlideBoxDelegate,HomeGoodlistRow) {
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtr l', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
