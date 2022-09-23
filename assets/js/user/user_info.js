$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]{3,12}$").test(value)) {
                return '昵称在3-12个字符内';
            }
        }
    })

    initUserInfo()
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: "/my/userinfo",
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败!")
                }
                // 用layui快速为表单取值赋值  
                form.val('userInfoForm', res.data);
            }
        })
    }

    // 表单的重置功能
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认行为
        e.preventDefault()
        initUserInfo()
    })

    // 表单的修改内容功能 bug1 是为表单绑定一个监听事件 而不是按钮
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 获取表单输入项 已经是对象了 不用加{}
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('未修改成功!')
                }
                layer.msg('修改成功!')
                // 在iframe中调用当前父页面中的方法 渲染头像
                window.parent.getUserInfo()
            }
        })
    })
})

