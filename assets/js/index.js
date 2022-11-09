$(function () {
  // 获取用户信息
  getUserInfo();
  var layer = layui.layer;
  //   点击按钮实现退出功能
  $("#logOut").on("click", function () {
    // 提示用户是否确认退出登录
    layer.confirm(
      "是否退出登入？",
      { icon: 7, title: "提示" },
      function (index) {
        //do something
        // 清空token
        localStorage.removeItem("token");
        // 跳转至登录页面
        location.href = "/login.html";
        // 关闭confirm窗口
        layer.close(index);
      }
    );
  });

  // 头部个人信息导航链接
  // 添加事件委托
  $("#topUserLink").on("click", function (e) {
    if (e.target.nodeName === "A") {
      var id = $(e.target).attr("dataId");
      $("#leftUserLink").find("a").get(id).click();
    }
  });
});
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // 请求头配置
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return console.log(res.message);
      }
      renderAvatar(res.data);
    },
    // 权限控制
    // complete: function (res) {
    //   // 可以拿到res.responseJSON
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     // 强制清空token
    //     // 强制跳转到登录页面
    //     localStorage.removeItem("token");
    //     location.href = "/login.html";
    //   }
    // },
  });
}
// 渲染用户头像
function renderAvatar(user) {
  // 获取用户名称
  var name = user.nickname || user.username;
  // 设置欢迎文本
  $("#welcome").html(`欢迎，${name}`);
  $("#welcomeTop").html(name);
  // 渲染用户头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avater").hide();
  } else {
    // 渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avater").html(first).show();
  }
}
