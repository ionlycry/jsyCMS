$(function () {
  // 点击去注册a链接
  $("#link_reg").on("click", function () {
    $(".loginbox").hide();
    $(".regbox").show();
  });

  // 点击去登录a链接
  $("#link_login").on("click", function () {
    $(".regbox").hide();
    $(".loginbox").show();
  });

  // 获取layui的form对象
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    uname: [
      /^[a-zA-Z0-9-_]{6,10}$/,
      "昵称长度为6到10个字符不能包含空格及特殊字符",
    ],
    pwd: [
      /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/,
      "请设置6至18位数字和字母(符号)组合",
    ],
    repwd: function (value) {
      // 拿到确认密码框的内容
      var pwdVal = $.trim($(".regbox input[name=password]").val());
      // 作比较，失败 return 错误信息
      if (value !== pwdVal) {
        return "输入的两次密码不一致";
      }
    },
  });

  // 监听注册提交事件
  $("#formReg").on("submit", function (e) {
    // 阻止默认提交事件
    e.preventDefault();
    var data = {
      username: $.trim($("#formReg [name=username]").val()),
      password: $.trim($("#formReg [name=password]").val()),
    };
    // 发起post请求
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功,请登录");
      // 模拟点击行为
      $("#link_login").click();
    });
  });

  // 监听登录事件 admin001
  $("#formLogin").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("登录成功");
        // 存储token的值
        localStorage.setItem("token", res.token);
        // 跳转首页
        location.href = "./index.html";
      },
    });
  });
});
