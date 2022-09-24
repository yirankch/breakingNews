$(function () {
    // 顺序 先做数据列表 其它都是对数据列表的操作
    // 1.获取ajax数据
    // 2.通过模板渲染数据
    // 初始化的数据
    // initGetList() // bug2 一开始就调用方法导致调用的时候没有数据
    /* 排错，首先看qpl 发现参数没问题，然后测试接口发现接口没问题，接口api没问题，
       那么定位到代码，发现代码调用初始化函数的时候，在没有传入数据之前调用函数，
       导致发送ajax的时候data参数有问题
    */


    // 需要将请求参数对象提交到服务器   
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义一个查询的参数对象，将请求数据的时候，
    var q = {
        pagenum: 1,  // 分页第一次显示的页码
        pagesize: 2, // 一页显示几条数据
        cate_id: '', // 新闻类别的id
        state: ''    // 新闻类别的状态
    }


    initGetList()
    initCade()
    // 使用template定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (data) {
        // new一个data() 传过来的对象是一个字符串类型的转换成时间类型
        const dt = new Date(data)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 初始化列表
    function initGetList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            // 页面初始化数据是 第一页 每页2条 
            // bug data传入是一个对象 如果数据本来就是一个对象则不需要再次添加 {}
            data: q,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('初始化列表失败！')
                }
                // layer.msg('初始化列表成功！')
                // 接口没问题但是数据展示失败
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr)
                // console.log(1)
                renderPage(res.total)
            }
        })
    }

    // 初始化筛选区域文章类别下拉
    function initCade() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res)
                // 定义渲染文章类别的tpl模板
                var htmlStr = template('tpl-cate', res)
                // 元素选择器
                $('[name=cate_id]').html(htmlStr)
                // 使用layui reader组件重新加载
                form.render()
            }
        })
    }

    // 筛选功能 只要是表单的submit 必须有 e 阻止默认提交事件
    $('#formSearch').on('submit', function (e) {
        e.preventDefault()
        // 获取用户输入的筛选项
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // console.log(cate_id,state)
        // 将获取到的值赋值给 q 提交到数据库
        q.cate_id = cate_id
        q.state = state
        // 调用初始化方法加载列表项
        initGetList()
    })

    /*
        使用lay的分页思路
        在页面定义一个分页的盒子
        引入layui 中laypage的render组件
        定义renderPage方法
        当页面获取后调用 定义renderPage方法
        
     */

    // 分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'renderBox', //注意，这里的 test1 是 ID，不用加 # 号 html中页面的盒子
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  // 每页显示的条数
            curr: q.pagenum, //当前显示的页数
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                // 有两种调用方式
                // 1.初始化数据加载的时候跳到用jump方法 first = true
                // 2.初始化数据后用户手动点击的时候jump方法 fires = undefined
                // console.log(first)
                // initGetList()
                // //首次不执行 initGetList()
                if (!first) {
                    // 把最新的页码值 赋值到 q 这个查询对象中
                    q.pagenum = obj.curr
                    // 把最新的页码值 赋值到 q 这个查询对象的pagesize中
                    q.pagesize = obj.limit
                    initGetList()
                }
            }
        })
    }

    // 删除文章功能 用代理的方式
    $('tbody').on('click', '.btn-delete', function () {
        // 一开始就获取删除按钮的个数 用于解决最后一页删除后页面展示的bug   
        var len = $('.btn-delete').length
        console.log(len)
        // 根据id来删除 先获取到id
        var id = $(this).attr('data-edit')
        // console.log(id)
        // 1.先询问是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 2.再用ajax请求 如果点了是 再执行删除
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                data: id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败!")
                    }
                    layer.msg("删除文章成功!")
                    // 全部删除完成当前页面还是为 4
                    // 如果len的值等于 1,证明删除完毕后,页面上就没有任何数据了
                    // 页码的值最小必须是 1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initGetList()
                }
            })
            layer.close(index);
        })
    })
})