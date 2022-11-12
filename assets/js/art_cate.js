$(function () {
  var layer = layui.layer
  var form = layui.form

  //  初始化文章分类的列表
  initArtCate()

  //  添加类别按钮，绑定弹出窗
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      title: '添加文章分类',
      area: ['500px', '280px'],
      content: $('#layerAdd').html(),
    })
  })

  //   通过代理形式，为表单绑定submit事件
  //   表单是动态添加的，获取不到，所以绑定到它的上一层
  $('body').on('submit', '#formAdd', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败')
        }
        initArtCate()
        layer.msg('新增分类成功')
        layer.close(indexAdd)
      },
    })
  })

  // 委托代理绑定编辑按钮点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 打开弹出层
    indexEdit = layer.open({
      type: 1,
      title: '修改文章分类',
      area: ['500px', '280px'],
      content: $('#layerEdit').html(),
    })
    var id = $(this).attr('data-id')
    // 获取数据绑定填充form
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取信息失败')
        }
        form.val('formEdit', res.data)
      },
    })
  })

  // 委托代理绑定编辑按钮点击事件

  $('tbody').on('click', '.btn-del', function () {
    var id = $(this).attr('data-id')
    // 打开弹出层
    layer.confirm('确定删除吗？', { icon: 7, title: '提示' }, function (index) {
      // 删除分类列表数据
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除数据失败！')
          }
          layer.close(index)
          initArtCate()
          layer.msg('删除数据成功！')
        },
      })
    })
  })

  //委托代理 formEdit提交事件
  $('body').on('submit', '#formEdit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改失败')
        }
        initArtCate()
        layer.msg('修改成功')
        layer.close(indexEdit)
      },
    })
  })

  // 初始化文章分类的列表
  function initArtCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }

        var htmlstr = template('artCateList', res)
        $('tbody').html(htmlstr)
      },
    })
  }
})
