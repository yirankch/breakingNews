// 注意: 每次调用$.get() 或 $.post() 或 $.ajax()的时候，
// 会优先调用ajaxPreFilter 这个函数 打印函数中的url地址
// 在这个函数中,可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options){
    // 在发起真正的ajax之前,统一拼接请求的跟路径
    console.log(options.url)
    options.url = 'http://www.liulongbin.top:3007' + options.url
})