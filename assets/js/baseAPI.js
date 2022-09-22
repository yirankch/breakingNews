// 注意: 每次调用$.get() 或 $.post() 或 $.ajax()的时候，
// 会优先调用ajaxPreFilter 这个函数 打印函数中的url地址
// 在这个函数中,可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax之前,统一拼接请求的跟路径
    console.log(options.url)
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // 统一设置有token认证的请求
    // 如果url中有/my/
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载compete函数
    options.complete = function (res) {
        // 无论ajax请求成功或者失败都会调用complete回调函数
        // 在complete函数中,可以使用 res.responseJSON拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清除token
            localStorage.removeItem('token')
            // 跳转回登录页面
            location.href = '/login.html'
        }
    }

})