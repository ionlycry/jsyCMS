$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    pwd: [
      /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/,
      "请设置6至18位数字和字母(符号)组合",
    ],
    samepwd: function (value) {
      // 两次密码不能相同
      var oldPwdVal = $(".layui-form input[name=oldPwd]").val();
      if (value === oldPwdVal) {
        return "新旧密码不能相同";
      }
    },
    repwd: function (value) {
      // 拿到确认密码框的内容
      var pwdVal = $(".layui-form input[name=newPwd]").val();
      // 作比较，失败 return 错误信息
      if (value !== pwdVal) {
        return "输入的两次密码不一致";
      }
    },
  });

  $(".layui-form").on("submit", function (e) {
    // 阻止默认提交
    e.preventDefault();
    // 发起更新请求
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("密码更新失败！");
        }
        layer.msg("密码更新成功！");
        $(".layui-form")[0].reset();
      },
    });
  });
});
