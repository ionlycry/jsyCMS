// 发起ajax请求之前，必会执行ajaxPrefilter,可获取配置项options对象
// 配置请求的根路径
$.ajaxPrefilter(function (options) {
  options.url = "http://api-breakingnews-web.itheima.net" + options.url;
});
