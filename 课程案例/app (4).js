// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'],function($httpProvider){
		//此方法用于修改$http请求的数据格式，让后台可以按照ajax，传输数据的方式接收
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
 
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
		 /*用于修改安卓tab居下 （在参数里要加入$ionicConfigProvider）*/
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');
  /*用于修改安卓tab居下 --结束*/
	
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,//这是主模板
    templateUrl: 'templates/tabs.html'//模板路径
  })

  // Each tab has its own nav history stack:
	
  .state('tab.home', {
    url: '/home',
    views: {//子模板加views
      'tab-home': {
        templateUrl: 'templates/tab-home.html'
      }
    }
  })
  
  
  .state('tab.lessonlist', {
      url: '/lessonlist',
      views: {
        'tab-lessonlist': {
          templateUrl: 'templates/tab-lessonlist.html'
          
        }
      }
    })
  
  
 
//我的课程
  .state('tab.mycourse', {
    url: '/mycourse',
    cache:'false',
    views: {
      'tab-mycourse': {
        templateUrl: 'templates/tab-mycourse.html',
        controller: 'mycourseCtrl'
      }
    }
  })
//登录
	.state('tab.personal',{
		url:'/personal',
		views:{
			'tab-personal':{
				templateUrl:'templates/tab-personal.html',
				controller:"personalCtrl"
			}
		}
	})
	
   //个人中心信息页
  .state('tab.information', {
    url: '/information',
    cache:'false',
    views: {
      'tab-personal': {
        templateUrl: 'templates/tab-information.html',
        controller: 'InformationCtrl'
      }
    }
  })
//注册页面
	.state("tab.register",{
		url:"/register",
		views:{
			'tab-personal':{
				templateUrl:'templates/tab-register.html',
				controller:'RegisterCtrl'
			}
		}
		
	})
  //课程学习页面
  .state("tab.homeStudy",{
  	url:"/homeStudy/:myId",
  	cache:'false',
  	views:{
  		"tab-home":{
  			templateUrl:"templates/tab-homeStudy.html",
  			controller:"homeStudyCtrl"
  		}
  	}
  	
  })
  
  //课程列表学习页面
  .state("tab.lessonStudy",{
  	url:"/lesslistStudy/:myId",
  	cache:'false',
  	views:{
  		"tab-lessonlist":{
  			templateUrl:"templates/tab-homeStudy.html",
  			controller:"homeStudyCtrl"
  		}
  	}
  	
  })
  //我的课程学习页面
   .state("tab.mycourseStudy",{
  	url:"/mycourseStudy/:myId",
  	cache:'false',
  	views:{
  		"tab-mycourse":{
  			templateUrl:"templates/tab-homeStudy.html",
  			controller:"homeStudyCtrl"
  		}
  	}
  	
  })
  
  //引导动画
  .state("tab.guide",{
  	url:"/guide",
  	views:{
  		"tab-home":{
  			templateUrl:"templates/tab-guide.html",
  			controller:"guideCtrl"
  		}
  	}
  
  })
  
//	默认加载
  $urlRouterProvider.otherwise('/tab/home');

});
