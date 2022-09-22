$(function () {
    
    // 点击注册按钮显示注册 隐藏当前
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 引入layui的form对象
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 获取form表单输入框
        var data = $(this).serialize()
        // 使用ajax post请求提交注册表单
        $.post('/api/reguser', data, function (res) {
            // 判断提交是否正常
            if (res.status !== 0) {
                return layer.msg(res.message, {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
            }
            layer.msg('注册成功,请登录!', {
                icon: 1,
                time: 1000 //2秒关闭（如果不配置，默认是3秒）
            });
            // 注册成功直接跳转到登录
            $('#link_login').click()
        })



    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止表单默认提交事件
        e.preventDefault()
        // 通过ajax post请求提交登录
        $.ajax({
            method: 'POST',
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 2,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    });
                }
                layer.msg('登录成功!', {
                    icon: 1,
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                });
                console.log(res.token);
                // 保存用户的token到本地存储
                localStorage.setItem('token', res.token)
                // 登录成功跳转主页面 纪录4 location学习
                location.href = '/index.html'
                // console.log()
            }
        })
    })
    
}) 