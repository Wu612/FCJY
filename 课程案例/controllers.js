angular.module('starter.controllers', [])
//主页
.controller('homeCtrl', function($scope,$ionicSideMenuDelegate) {
		//侧边菜单
		$scope.toggleLeft=function(){
				$ionicSideMenuDelegate.toggleLeft();
		}
		
	
	
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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
