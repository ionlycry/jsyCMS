// 发起ajax请求之前，必会执行ajaxPrefilter,可获取配置项options对象
// 配置请求的根路径
$.ajaxPrefilter(function (options) {
  options.url = "http://api-breakingnews-web.itheima.net" + options.url;

  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  // 权限控制
  options.complete = function (res) {
    // 可以拿到res.responseJSON
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      // 强制清空token
      // 强制跳转到登录页面
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});
