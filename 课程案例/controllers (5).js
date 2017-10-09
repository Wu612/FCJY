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
.controller('lessonlistCtrl', function($scope, Chats) {
	

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
  
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtr l', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
