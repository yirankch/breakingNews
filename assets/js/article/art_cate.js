$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    // 定义初始化表格渲染
    function initArtCateList() {
        // 1.用ajax获取文章类别
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败!')
                }
                // 2. 使用template模板 渲染文章类别数据
                var htmlStr = template('tmp_artCate', res)
                $('tbody').html(htmlStr)
            }
        })

    }

    var indexAdd = null
    // 新增新闻分类
    $('#btnAddCate').on('click', function () {
        // 使用layery open() 弹出
        indexAdd = layer.open({
            title: '添加新增分类',
            type: 1,
            area: ['500px', '250px'],
            // 使用script 模板传入
            content: $('#layAdd').html() //这里content是一个普通的String
        })
    })

    // 新增新闻分类 确认添加
    // 通过代理的形式 给 formAddCode 表单绑定提交事件
    $('body').on('submit', '#formAddCade', function (e) {
        // 忘记 取消表单的默认提交事件了 导致没有发起ajax请求  重点加强记忆
        e.preventDefault()
        // 没有发起ajax请求 或者下面的代码不执行 错误一定是 表单默认提交了
        // console.log('ok')
        // ajax post提交表单
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                // 没有打印ok说明ajax代码 没有执行 ajax代码没有执行的原因就是 忘记取消表单的默认提交事件了
                // console.log(ok)
                if (res.status !== 0) {
                    console.log(res.message)
                    return layer.msg('添加文章分类失败!')
                }
                layer.msg('添加文章分类成功!')
                layer.close(indexAdd)
                initArtCateList()

            }
        })
    })

    var indexEdit = null
    // 编辑新闻分类
    // 通过代理给编辑按钮绑定事件
    $('tbody').on('click', '#btnEdit', function () {
        // 使用layery open() 弹出
        indexEdit = layer.open({
            title: '修改新闻分类',
            type: 1,
            area: ['500px', '250px'],
            // 使用script 模板传入
            content: $('#layEdit').html() //这里content是一个普通的String
        })
        // 定义自定义属性 根据自定义属性的Id 请求到数据
        var Id = $(this).attr('data-edit')
        // 弹出层自动填充修改前的数据
        $.ajax({
            method: 'GET',
            // 接口中的: 表示拼接
            url: '/my/article/cates/' + Id,
            data: {
                Id
            },
            success: function (res) {
                // 使用layui form方法 用 res.data给表单赋值
                form.val('formEditCade', res.data)

            }
        })
    })

    // 修改文章分类功能
    $('body').on('submit', '#formEditCade', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 根据 Id 更新文章分类数据
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res.message)
                if (res.status !== 0) {
                    return layer.msg('更新文章分类失败!')
                }
                layer.msg('更新文章分类成功!')
                // 更新成功关闭弹出框
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    // 删除文章分类功能
    // 一开始页面没有的 需要通过已有的元素代理 给删除按钮绑定事件
    $('tbody').on('click', '#btnDelete', function () {
        var Id = $(this).attr('data-edit')
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                data: Id,
                success: function (res) {
                    console.log(res.message)
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功!')
                    initArtCateList()
                }
            })
            layer.close(index);
        })

    })
})