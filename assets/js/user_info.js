$(function () {
  var form = layui.form;
  var layer = layui.layer;
  // 添加昵称的验证规则
  form.verify({
    nickname: function (value) {
      if (value.length > 8) {
        return "昵称长度1-8个字符";
      }
    },
  });
  // 打开页面，初始化用户信息
  initUser();
  // 重置表单
  $("#btnReset").on("click", function (e) {
    // 阻止默认重置事件
    e.preventDefault();
    // initUser
    initUser();
  });

  // 提交修改功能
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    // 发起ajax更新请求
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("提交更新失败！");
        }
        layer.msg("提交更新成功！");
        // 调用父页面的getUserInfo(),更新头像，用户名称渲染
        window.parent.getUserInfo();
      },
    });
  });
  function initUser() {
    // ajax获取数据
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败！");
        }
        // 填充userInfoForm表单
        form.val("userInfoForm", res.data);
        console.log(res);
      },
    });
  }
});
