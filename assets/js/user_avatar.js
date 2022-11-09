$(function () {
  var layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  //   上传按钮，绑定事件
  $("#btnChooseImage").on("click", function () {
    $("#file").click();
  });

  //文件input绑定 change事件
  $("#file").on("change", function (e) {
    // e.target.files 对象

    if (e.target.files.length === 0) {
      return layer.msg("请选择一张图片");
    }
    // 拿到用户选择的文件
    var file = e.target.files[0];
    // 创建对应的url地址
    var newImgURL = URL.createObjectURL(file);
    // cropper插件操作
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //   为确定按钮绑定点击事件
  $("#btnUploadImg").on("click", function () {
    // 拿到裁剪后的头像
    //   将裁剪后的图片，输出为 base64 格式的字符串
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 上传到服务器
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: { avatar: dataURL },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更换头像失败！");
        }
        layer.msg("更换头像成功！");
        window.parent.getUserInfo();
      },
    });
  });

  //   console.log(dataURL);
});
