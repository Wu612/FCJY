angular.module('starter.controllers', [])

  //主页
  .controller('HomeCtrl', function($scope,HomeGoodlistRow,$rootScope,$ionicSideMenuDelegate,locals,$http,$ionicSlideBoxDelegate,shareData) {

    //如果是第一次安装app，就跳转到引导页轮播图
    if(!(locals.get("isLoad") == "isLoad")){
      window.location.href = "#/tab/lunbotu";
    }

    //隐藏顶部条备选方法
    //$ionicNavBarDelegate.showBar(false);

    //首页数据请求
    $http.post($rootScope.URLAdmin+'/Handler/OfflineCourseHandler.ashx?action=indexshow', '')
      .success(function(response){
				console.log(response);
        //轮播图数据
        $scope.lunbopics =response.data.bannerList;
        //更新轮播图
        $ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
        //让轮播图循环播放
        $ionicSlideBoxDelegate.$getByHandle("slideimgs").loop("true");

        //好评帮数据
        $scope.homeGoodlistRows = [[response.data.goodList[0],response.data.goodList[1]],[response.data.goodList[2],response.data.goodList[3]]];
        //最新课程
        $scope.homeNewLists= [[response.data.newList[0],response.data.newList[1]],[response.data.newList[2],response.data.newList[3]]];
        //猜你喜欢
        $scope.homechooseLists = response.data.chooseList;

      });
console.log($scope.lunbopics);
    //跳转到学习页
    $scope.tz_study=function(myId){
      window.location="#/tab/homeStudy/"+myId;
    }


    //点击展开侧边栏
    $scope.toggleLeftSideMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    //点击搜索,跳转到课程列表页，并设置需要 传过去的参数
    $scope.doSearch = function(){
      //console.log($scope.searchText);
      if($scope.searchText){
        shareData.set('indexSearchText',$scope.searchText);
        $scope.searchText = '';
        window.location.href = "#/tab/lessonlist";
      }
    };

    //搜索框点击键盘的搜索键
    $scope.myKeyup = function(e){
      var keycode = window.event?e.keyCode:e.which;
      if(keycode==0 || keycode==13){ //keycode==0表示点击手机输入键盘的go按钮，keycode==13表示点击键盘的enter
        $scope.doSearch();
      }
    };


  })


  //课程列表
  .controller('LessonlistCtrl', function($scope, courseLists,$http,$rootScope,$timeout,shareData) {

    //请求专业分类子级内容数据
    $http.post($rootScope.URLAdmin+'/Handler/OfflineCourseHandler.ashx?action=getcategory','')
      .success(function(response){
        //console.log(response.data);
        $scope.courseListBtns = response.data;
      });

   /* $scope.courseListBtns=[
      {id:0, btnName:"全部"},
      {id:1, btnName:"UI"},
      {id:2, btnName:"JAVA"},
      {id:3, btnName:"Android"},
      {id:4, btnName:"IOS"},
      {id:5, btnName:"其它"}
    ]*/

    $scope.priceBtns=[
      {id:0, btnName:"全部"},
      {id:1, btnName:"免费"},
      {id:2, btnName:"收费"}
    ]


    //课程列表单击事件
    $scope.lilist=false;
    $scope.lcolor={color:"#333"};

    $scope.courselist = function () {

      $scope.lilist= !$scope.lilist;
      $scope.prlist = false;
      $scope.pcolor={color:"#333"};

      if($scope.lilist==true){
        $scope.lcolor={color:"#63aafc"};
      }else{
        $scope.lcolor={color:"#333"};
      }

    }


    //价格单击事件
    $scope.price = function () {

      $scope.prlist= !$scope.prlist;
      $scope.lilist = false;
      $scope.lcolor={color:"#333"};

      if($scope.prlist==true){
        $scope.pcolor={color:"#63aafc"};
      }else{
        $scope.pcolor={color:"#333"};
      }

    }

    //定义加载列表数据初始数据
    $scope.nowPage = 0;
    $scope.lists = [];
    $scope.searchText='';
    $scope.CategoryId = '';
    $scope.CpriceId = '';


    //判断是否为首页点击搜索跳转过来的。如果是，执行搜索结果
    if(shareData.get('indexSearchText')){
      $scope.searchText=shareData.get('indexSearchText');
      shareData.set('indexSearchText','');
    }


    $scope.goPage = function(pageStart){
      console.log($scope.moredata);
      //当开始ajax的时候停止加载
      $scope.moredata = false;

      //列表数据请求需提交的数据
      var myData = {
        'pageStart':pageStart,         //第几页
        'searchText':$scope.searchText,//搜索的专业名称
        'CategoryTwo':$scope.CategoryId,//专业id
        'CpriceId':$scope.CpriceId //价格id
      };

      //发起列表数据请求
      $http.post($rootScope.URLAdmin+'/Handler/OfflineCourseHandler.ashx?action=courseshow', myData)
        .success(function(response){
          //console.log($scope.CpriceId);
          $scope.totalPage = Math.ceil(response.data.count/response.data.pageSize);
          $scope.lists = $scope.lists.concat(response.data.list);
          $scope.nowPage = response.data.pageStart;

          if ($scope.totalPage > response.data.pageStart) {
            $scope.moredata = true;//恢复加载
          }
        });
    };

    //$scope.lists = courseLists.page(1);

    //上拉加载更多数据loadMore函数
    $scope.moredata = true;//为true时加载数据
    $scope.loadMore = function() {
      if($scope.moredata){
        $scope.goPage($scope.nowPage+1);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    };

    //上拉加载更多事件
    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
    })


    //点击筛选或搜索执行搜索函数
    $scope.pricouSearch = function(searchText,CategoryId,CpriceId){
      $scope.searchText = searchText;
      $scope.CategoryId = CategoryId;
      $scope.CpriceId = CpriceId;

      $scope.nowPage = 0;
      $scope.lists = [];
      $scope.moredata = true;//没有更多数据停止加载
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.prlist=false;
      $scope.lilist=false;
      $scope.lcolor={color:"#333"};
      $scope.pcolor={color:"#333"};
      $scope.loadMore();
    }

    //点击键盘的go执行搜索
    $scope.myKeyup = function(e){
      var keycode = window.event?e.keyCode:e.which;
      if(keycode==0 || keycode==13){
        //console.log("搜索："+$scope.searchInputText);
        $scope.pricouSearch($scope.searchInputText,'','');
        $scope.searchInputText = '';
      }
    }

    //下拉刷新
    $scope.doRefresh =function(){
      $timeout(function () {
        $scope.pricouSearch('','全部','');
        $scope.$broadcast("scroll.refreshComplete");
      }, 1000);
    }

    //点击进入学习页
    $scope.tz_study=function(myId){
      window.location="#/tab/lesslistStudy/"+myId;
    }

  })


  //我的课程
  .controller('MycourseCtrl', function($scope, courseFirst, courseSecond,$http,$rootScope) {

    //先设置让其显示“请登录”
    $scope.dl_tf=true;

    //我的课程数据 请求
    $http.get($rootScope.URLAdmin+'/Handler/OnCourseHandler.ashx?action=mycourse','')
      .success(function(response){
        $scope.dl_tf=false;
        //console.log(response.data);
        $scope.itemFir = response.data;
      });

    //收藏课程数据
    $http.get($rootScope.URLAdmin+'/Handler/OnCourseHandler.ashx?action=mycollection','')
      .success(function(response){
        console.log(response.data);
        $scope.itemSec = response.data;
      });


    //我的课程 点击
    $scope.mycou=true;
    $scope.mycol=false;
    $scope.color={color:"#63aafc"};
    $scope.colorc={color:"#333"};
    $scope.mylesson = function () {
      $scope.data.showDelete=false;
      $scope.mycou= true;
      $scope.mycol= false;
      $scope.color={color:"#63aafc"};
      $scope.colorc={color:"#333"};
    }

    //收藏课程 点击
    $scope.course = function () {
      $scope.data.showDelete=false;
      $scope.mycou= false;
      $scope.mycol= true ;
      $scope.color={color:"#333"};
      $scope.colorc={color:"#63aafc"};
    }

    //$scope.itemFir=courseFirst.all();

    //先定义的显示隐藏删除按钮的数据
    $scope.data = {
      showDelete: false
    };

    //分享
    $scope.doShare = function(id){
      window.plugins.socialsharing.share('给你分享一个很棒的课程', null, null,$rootScope.URLAdmin+'/www/index.html#/tab/lesslistStudy/'+id)
    };

    //删除我的收藏
    $scope.onItemDelete = function(item) {

      var myId={
        courseId:item.ID
      };
      $http.post($rootScope.URLAdmin+'/Handler/OnCourseHandler.ashx?action=deletecollection',myId)
        .success(function(response){
          console.log(response);
          $scope.itemSec.splice($scope.itemSec.indexOf(item), 1);
        });

    };

    //$scope.itemSec=courseSecond.all();

    //跳转到学习页面
    $scope.tz_study=function(myId){
      window.location="#/tab/myStudy/"+myId;
    }

  })


  //个人中心登录
  .controller('PersonalCtrl', function($scope,$http,$rootScope) {

    //防止页面调试过程中的页面切换导致下部tabs隐藏了，无法切换，这里设置切换到登录页的时候，显示tabs。
    $rootScope.hideTabs = false;

    //是否登录请求，如果已登录，直接跳转到个人信息页
    $http.post($rootScope.URLAdmin+'/Handler/UserHandler.ashx?action=isLogin','')
      .success(function(response){
        console.log(response);
        if(response.success){
          window.location="#/tab/information";
        }
      });

    //输入框数据
    $scope.loginuser={
      name:'',
      password:''
    };
    //登录方法
    $scope.doLogin=function(){
      //如果用户名和密码均输入，则执行登录
      if(!!$scope.loginuser.name && !!$scope.loginuser.password){
        var myData ={
          userName : $scope.loginuser.name,
          userPwd : $scope.loginuser.password
        };
        //console.log(myData);
        //登录请求
        $http.post($rootScope.URLAdmin+'/Handler/UserHandler.ashx?action=login',myData)
          .success(function(response){
            //console.log(response.data);
            if(response.err){
              alert(response.err);
            }else{
              window.location="#/tab/information"
            }

          });


      }
    }

    //点击键盘的go执行登录
    $scope.loginKeyup = function(e){
      var keycode = window.event?e.keyCode:e.which;
      if(keycode==0 || keycode==13){
        //console.log("搜索："+$scope.searchInputText);
        $scope.doLogin();
      }
    }

  })


  //引导动画轮播图
  .controller('LunbotuCtrl', function($scope, locals) {
    $scope.toIndex = function(){
      locals.set("isLoad","isLoad");
      window.location.href = "#/tab/home";
    }
  })


  //注册
  .controller('RegisterCtrl', function($scope,$ionicPopup,$http,$rootScope) {

    /*注册页面输入框数据*/
    $scope.infor={
      name:'',
      email:'',
      phone:'',
      password:'',
      passwordt:''
    };

    /*注册页面判断*/
    $scope.register=function(infor){
      var email_yz  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var photo_yz = /^1\d{10}$/;
      if(!!infor.name && !!infor.email && !! infor.phone && !! infor.password && !!infor.passwordt){
        if(!email_yz.test(infor.email)){
          $ionicPopup.alert({
            title: '提示信息!',
            template: '邮箱格式不正确，请重新输入'
          });
        }else if(photo_yz.test(infor.photo)) {
          $ionicPopup.alert({
            title: '提示信息!',
            template: '请输入正确手机号码'
          });
        }else if(infor.password!=infor.passwordt){
          $ionicPopup.alert({
            title: '提示信息!',
            template: '两次密码不相同，请重新输入'
          });
        }else{
          //注册信息提交
          var myInfor={
            userName:$scope.infor.name,
            email:$scope.infor.email,
            phone:$scope.infor.phone,
            userPwd:$scope.infor.password,
            nickname:'',
            userPic:''
          };
          console.log(myInfor);
          //注册请求
          $http.post($rootScope.URLAdmin+'/Handler/UserHandler.ashx?action=add', myInfor)
            .success(function(response){
              if(response.err){
                $ionicPopup.alert({
                  title: '提示信息!',
                  template: response.err
                });
              }else{
                console.log(response);
                $ionicPopup.alert({
                  title: '提示信息!',
                  template: '注册成功！'
                });
                window.location="#/tab/personal"
              }

            });

        }
      }else{
        $ionicPopup.alert({
          title: '提示信息!',
          template: '请输入内容'
        });

      };
    }


  })


  //个人信息
  .controller('InformationCtrl', function($scope,$http,$rootScope) {

    //获取个人信息
    $http.get($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=returnuserinfo",'')
      .success(function(response){
        //console.log(response)
        $scope.name = response.userName;
        $scope.email = response.email;
        $scope.phone = response.phone;
      })

    //退出
    $scope.quit=function(){
      $http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=quit",'')
        .success(function(response){
          //console.log(response)
          window.location="#/tab/personal"
        })

    }
  })


  //学习
  .controller('StudyCtrl', function($scope,$stateParams,studyList,pingjiaList,$ionicModal,$http,$rootScope,$ionicPopup ) {
    //根据url传过来的id获取当前课程的id
    var mystudy = {
      courseId: $stateParams.myId
    };
    $scope.myId = $stateParams.myId;


    //为video赋值默认值
    $scope.Vurl = 'video/mov_bbb.mp4';
      /*{
      'Vurl':$rootScope.URLAdmin + 'video/mov_bbb.mp4'
    }*/


    //目录和详情标签切换开始
    $scope.mymulu = true;
    $scope.myxiangqing = false;
    $scope.color = {color: "#63aafc"};
    $scope.ml_left = function () {
      $scope.myxiangqing = false;
      $scope.mymulu = true;
      $scope.color = {color: "#63aafc"};
      $scope.colorc = {color: "#333"}
    }

    $scope.xq_right = function () {
      $scope.mymulu = false;
      $scope.myxiangqing = true;
      $scope.color = {color: "#333"};
      $scope.colorc = {color: "#63aafc"}
    }
    //目录和详情标签切换结束

    //提示购买显示和隐藏，因为需要在子孔子器中修改此值，所有需要使用对象的方式定义，而且，在播放的时候，需要判断是否有购买，所以，需要将生命提前到播放方法的前面。
    $scope.shadow = {
      video_buy:false
    }

    //播放方法
    $scope.broadcast = function(url, Id){

      //！！！！！在浏览演示时，播放插件不能用，只能用一般的video标签，使用下面的第一种，封装app使用第二种,并将页面中的video标签更换为第二个（注释掉的那个）。
      /*No.1 浏览器演示的url赋值方式*/
      //$scope.Vurl = $rootScope.URLAdmin + url;

      /*No.2 APP视频播放插件方式，网页浏览时先注释掉，因为会报错*/
      /*//加入视频的插件控制代码开始
       window.plugins.html5Video.initialize({
       "video1" : $rootScope.URLAdmin + url
       });
       window.plugins.html5Video.play("video1");
       //加入视频的代码结束*/


      //视频播放兼容写法
      try{

        window.plugins.html5Video.initialize({
          "video1" : $rootScope.URLAdmin + url
        });
        $scope.pcTrue = false;

        if($scope.video_login==false && $scope.shadow.video_buy==false){

          window.plugins.html5Video.play("video1");

        }

      }catch (e){
        $scope.pcTrue = true;
        $scope.Vurl = $rootScope.URLAdmin + url;

      }

      //根据视频id设置当前播放的课件。
      for(var i=0;i<$scope.CDlists.length; i++){
        for (var j=0; j<$scope.CDlists[i].Vlist.length ; j++){
          if($scope.CDlists[i].Vlist[j].ID == Id){
            $scope.CDlists[i].Vlist[j].isViewing = true;
          }else{
            $scope.CDlists[i].Vlist[j].isViewing = false;
          }
        }
      }
    };



    //判断是否登录，然后根据是否登录请求不同数据。
    $http.post($rootScope.URLAdmin+'/Handler/UserHandler.ashx?action=isLogin')
      .success(function(response){
        if(response.success){
          /*已登录执行的代码*/
          $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=learnshow", mystudy)
            .success(function(response) {

              $scope.CDlists = response.data.CDlist;

              $scope.Cname = response.data.Cname;
              $scope.evaluates = response.data.evaluate.list;
              $scope.footerPingjia=false;

              //判断是否收藏
              $scope.shouchangYN = '';
              $scope.isActive = response.data.ifColected;
              if ($scope.isActive == true) {
                $scope.shouchangYN = '已收藏';
              } else {
                $scope.shouchangYN = '收藏';
              }

              //判断是否已购买
              //console.log(response.data.ifPay);
              $scope.goumaiYN = '';
              if(response.data.ifPay == true) {
                $scope.video_login=false;//提示登录为隐藏
                $scope.test ="active";//为蓝色
                $scope.goumaiYN = '已购买';
                $scope.shadow.video_buy = false;  //提示购买的隐藏

              } else{
                $scope.video_login=false;
                $scope.test ='';
                $scope.shadow.video_buy = true;   //提示购买的显示
                $scope.goumaiYN = '购买';
              }

              //$scope.broadcast($rootScope.URLAdmin + response.data.CDlist[0].Vlist[0].Vurl,response.data.CDlist[0].Vlist[0].ID);

              //视频播放兼容写法,此处如果调用$scope.broadcast播放视频，则会出现是手机app端播放插件加载时间延迟，不能实现第一次播放的问题，所以采用了单独编写的方式。
              try{
                window.plugins.html5Video.initialize({
                  "video1" : $rootScope.URLAdmin + response.data.CDlist[0].Vlist[0].Vurl
                });
                $scope.pcTrue = false;
                if($scope.video_login==false && $scope.shadow.video_buy==false){
                  window.plugins.html5Video.play("video1");
                }
              }catch (e){
                $scope.pcTrue = true;
                $scope.Vurl = $rootScope.URLAdmin + response.data.CDlist[0].Vlist[0].Vurl;
              }

              //设置当前播放的课件。
              $scope.CDlists[0].Vlist[0].isViewing = true;

            })

        }
        else
        {
          /*未登录执行的代码*/
          $http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=learnshow", mystudy)
            .success(function(response) {
              $scope.footerPingjia=true;//单击评价不会出现弹窗
              $scope.shouchangYN = '收藏';
              $scope.video_login=true;//提示登录弹窗显示
              $scope.goumaiYN = '购买';
              $scope.CDlists = response.data.CDlist;
              $scope.broadcast($rootScope.URLAdmin + response.data.CDlist[0].Vlist[0].Vurl,response.data.CDlist[0].Vlist[0].ID);
              //$scope.Vurl = $rootScope.URLAdmin + response.data.CDlist[0].Vlist[0].Vurl;
              $scope.Cname = response.data.Cname;
              $scope.evaluates = response.data.evaluate.list;
            });

        }
      })



    //评价弹窗
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

  })


  //学习页底部导航的控制器
  .controller('studyFooterCtrl',function($scope,$http,$stateParams,$rootScope){

    //收藏请求
    $scope.scGo = function(){
      var myID={
        courseId:$stateParams.myId
      }
      $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=collection",myID)
        .success(function(response){
          console.log(response)
          $scope.isActive=response.ifColected;
          if($scope.isActive == true){
            $scope.shouchangYN='已收藏';
          } else{
            $scope.shouchangYN='收藏';
          }
        })
    }


    //购买请求
    $scope.payGo = function(){

      var myID={
        courseId:$stateParams.myId
      }

      //设置支付测试数据
      var charge={"id":"ch_ez9a5O9GSCy5fj5afHTGmvHG","object":"charge","created":1442542657,"livemode":false,"paid":false,"refunded":false,"app":"app_ir1uHKe9aHaL9SWn","channel":"upacp","order_no":"123456789","client_ip":"127.0.0.1","amount":100,"amount_settle":0,"currency":"cny","subject":"Your Subject","body":"Your Body","extra":{},"time_paid":null,"time_expire":1442546257,"time_settle":null,"transaction_no":null,"refunds":{"object":"list","url":"/v1/charges/ch_ez9a5O9GSCy5fj5afHTGmvHG/refunds","has_more":false,"data":[]},"amount_refunded":0,"failure_code":null,"failure_msg":null,"metadata":{},"credential":{"object":"credential","upacp":{"tn":"201509181017374044084","mode":"00"}},"description":null};

      //发起模拟支付
      try{
        pingpp.createPayment(charge, function(result){
          //alert('suc: '+result);  //"success"

          //支付成功，请求后台，变更课程为已购买
          $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=buy",myID)
            .success(function(response){
              //window.location("#/tab/pay");
              console.log(response);
              $scope.test = "active";
              $scope.goumaiYN = '已购买';
              console.log($scope.video_buy);
              $scope.shadow.video_buy=false;  //提示购买的隐藏


            })
        }, function(result){
          alert('err: '+result);  //"fail"|"cancel"|"invalid"
        });
      }
      catch(e){
        alert(e);
        //如果报错，说明是在浏览器浏览的，也请求后台，变更课程为已购买
        $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=buy",myID)
          .success(function(response){
            //window.location("#/tab/pay");
            console.log(response);
            $scope.test = "active";
            $scope.goumaiYN = '已购买';
            console.log($scope.video_buy);
            $scope.shadow.video_buy=false;  //提示购买的隐藏
          })
      }

    }


  })


  //学习页评价控制器
  .controller('TaskCtrl', function($scope,$ionicPopup,$http,$rootScope) {
    $scope.close = function () {
      $scope.modal.hide();
    }

    $scope.textareaValue = '';

    //评论提交事件
    $scope.createContact = function() {
      var mycomments = {
        courseId: $scope.myId,
        evaluate:$scope.textareaValue
      };
      //console.log(mycomments);
      if($scope.textareaValue == ''){
        $ionicPopup.alert({
          title: '提示信息!',
          template: '请输入内容！'
        });
      }else{
        $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=addcoursecomments",mycomments)
          .success(function(response){
            $scope.modal.hide();
          })
      }
    }

  })



  /*底部tabs隐藏显示的指令*/
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
      	console.log(attributes)
        scope.$on('$ionicView.beforeEnter', function() {
          $rootScope.hideTabs=attributes.hideTabs;
        });

        scope.$on('$ionicView.beforeLeave', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  })




