$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  //定义模板的时间格式化
  template.defaults.imports.dateFormate = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = appendZero(dt.getMonth() + 1)
    var d = appendZero(dt.getDate())

    var hh = appendZero(dt.getHours())
    var mm = appendZero(dt.getMinutes())
    var ss = appendZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  // 补零函数
  function appendZero(num) {
    return (num = num > 9 ? num : num + '0')
  }
  // 初始化分类选项
  initArtCate()
  // 定义查询参数q
  var q = {
    pagenum: 1, //显示当前第几页
    pagesize: 2, //每页显示多少条
    cate_id: '', //分类id
    state: '', //文章状态
  }
  // 初始化文章列表
  initArtList()

  // 为筛选表单添加submit事件
  $('#formFilter').on('submit', function (e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initArtList()
  })

  // 为删除按钮绑定事件
  $('tbody').on('click', '.btn-del', function () {
    var len = $('.btn-del').length
    var id = $(this).attr('data-id')
    layer.confirm('确定要删除吗？', { icon: 7 }, function (index) {
      // 发起ajax请求
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.msg('删除成功')
          layer.close(index)
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initArtList()
        },
      })
    })
  })

  // 委托代理绑定编辑按钮点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 打开弹出层
    var id = $(this).attr('data-id')
    indexEdit = layer.open({
      type: 2, //2，弹出层是个iframe
      title: '编辑文章信息',
      area: ['100%', '100%'],
      content: './art_edit.html', //和html页面的相对位置
      // layero:当前层的dom对象
      success: function (layero, index) {
        var body = layer.getChildFrame('body', index) //建立父子链接，必须有！！！
        // body.find('#catConid').val(id)
        // 获取子页面window对象
        var iframeWin = window[layero.find('iframe')[0]['name']]
        // 调用子页面方法

        iframeWin.initArtCon(id)
      },
    })
  })

  //   渲染列表数据
  function initArtList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // console.log(res)
        // 如果total为空，渲染列表
        var hmtlStr =
          res.total === 0 ? template('listEmpty') : template('artList', res)
        $('tbody').html(hmtlStr)
        // 调用渲染分页方法
        renderPage(res.total)
      },
    })
  }

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

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'renderPage', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,
      limits: [2, 3, 5, 10],
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      // 1，点击页码触发jump回调
      //,2，调用renderPage()触发jump回调，initArtList触发renderPage,renderPage触发initArtList，造成死循环
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：

        q.pagenum = obj.curr //得到当前页，以便向服务端请求对应页的数据。
        // 第一次调用renderPage()，first为true,其他为undefined
        // 如果不是第一次调用，就根据q.pagenum的值initArtList()
        q.pagesize = obj.limit
        if (!first) {
          initArtList()
        }
      },
    })
  }
})
