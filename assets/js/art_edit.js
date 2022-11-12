var layer = layui.layer
var form = layui.form
// 1. 初始化图片裁剪器
var $image = $('#image')
// 2. 裁剪选项
var options = {
  aspectRatio: 400 / 280,
  preview: '.img-preview',
}
// 3. 初始化裁剪区域
$image.cropper(options)

// 选择封面按钮点击绑定事件
$('#btnChooseImage').on('click', function () {
  $('#inputFile').click()
})

// 文件选择框绑定事件
$('#inputFile').on('change', function (e) {
  var files = e.target.files
  console.log(files.length)
  if (files.length === 0) {
    return layer.msg('请选择文件！')
  }
  var filesUrl = URL.createObjectURL(files[0])
  // cropper插件操作
  $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', filesUrl) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
})

//定义文章的发布状态
var pubState = '已发布'

$('#btnPubdraft').on('click', function () {
  pubState = '草稿'
})

//表单提交事件
$('#catPubForm').on('submit', function (e) {
  // 阻止表单默认提交事件
  e.preventDefault()
  // 快速创建一个formData对象
  var fd = new FormData($(this)[0])
  // 将文章发布状态存到fd中
  fd.append('state', pubState)

  // fd.forEach(function (v, k) {
  //   console.log(k, v)
  // })

  // 将封面裁剪的部分转化为文件
  $image
    .cropper('getCroppedCanvas', {
      // 创建一个画布
      width: 400,
      height: 280,
    })
    .toBlob(function (blob) {
      // 将画布上的内容，转化为文件对象
      // 存储到fd中
      fd.append('cover_img', blob)

      // 发起ajax请求
      publishArtical(fd)
    })
})

// 初始化分类select的选项
function initArtCate() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取文章分类失败')
      }

      var htmlstr = template('artCateList', res)
      $('[name=cate_id]').html(htmlstr)
      form.render()
    },
  })
}
// 初始化文章详情
function initArtCon(id) {
  console.log(id)
  // 获取文章内容详情
  $.ajax({
    method: 'GET',
    url: '/my/article/' + id,
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('初始化文章内容失败')
      }

      // 初始化编辑器
      initEditor()
      // 初始化分类select的选项
      initArtCate()
      // 设置cropper图片的src
      var imgsrc =
        'http://api-breakingnews-web.itheima.net' + res.data.cover_img
      // cropper插件操作
      $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgsrc) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域

      // 绑定数据
      form.val('catPubForm', res.data)
    },
  })
}

// 定义发布文章的方法
function publishArtical(fd) {
  $.ajax({
    method: 'POST',
    url: '/my/article/edit',
    data: fd,
    // 提交的是FormData数据
    // 必须添加两个配置项，contentType,processData
    contentType: false,
    processData: false,
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('发布文章失败')
      }
      layer.msg(res.message, { time: 500 }, function () {
        //do something
        $('#leftArtLink a:eq(1)', window.parent.parent.document)[0].click()
      })
    },
  })
}
