$(function () {
    // localStorage.removeItem('token')
    getUserInfo()

    const layer = layui.layer
    // 设置退出登录
    $('#btnLoginOut').on('click', function () {
        // 使用layui的弹出层
        layer.confirm('确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something 推出后清空token
            localStorage.removeItem('token')
            location.href = '/login.html'

            layer.close(index);
        })
    })
})

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: "/my/userinfo",
        // Headers !=== header
        // 本次bug花费40分钟
        // 首先对比了代码，发现没有大致问题，以至于忽略大小写
        // 其次验证了token 发现没问题
        // 反复验证token 发现没问题 （及其浪费事件)
        // 再次对比代码，发现代码Herders 首字母大写了
        // 修改headers 效果实现
        // 90%的效果没实现代码为拼写错误
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                // console.log(res)
                return layui.layer.msg('获取用户失败!')
            }
            // console.log(res)
            // 渲染用户头像
            renderAvatar(res.data)
        }

    })
}

// 渲染头像
function renderAvatar(user) {
    // 1.获取用户的昵称
    var name = user.nickname || user.username
    // 2.设置欢迎语句
    $('.welcome').html("欢迎," + name)
    $('.user-name').html(name)
    // 3.按需渲染用户的头像
    // 3.1 如果用户没有图片头像
    if (user.user_pic === null) {
        // 3.1.1 用户的图片头像隐藏
        $('.layui-nav-img').hide()
        // 3.1.2 用户的文字头像显示，并且首字母大写
        // 获取用户的首字母,字符串的首字母
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
    else {
        $('.layui-nav-img').attr('src', user.user_pic)
        $('.text-avatar').hide()
    }
}