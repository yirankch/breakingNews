$(function () {
    var form = layui.form
    var layer = layui.layer

    // 定义表单校验规则
    form.verify({
        // 定义校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 确认密码与旧密码比较
        newPwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码与旧密码不能相同!'
            }
        },

        // 确认密码与新密码比较
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致!'
            }
        }
    })

    // 确认修改密码功能
    // 给表单提交设置监听
    $('.layui-form').on('submit',function(e){
        // 取消表单的默认提交事件
        e.preventDefault()

        // 使用ajax请求提交表单
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 使用serialize获取表单数据
            // data:$(this).serialize(),
            success: function(res){
                console.log(res)
                if(res.status !== 0) {
                    // console.log(res.message)
                    return layui.layer.msg('密码修改失败!')
                }
                layui.layer.msg('密码修改成功')
                // 修改成功后重置表单 把jquery对象转换成js对象调用reset() 方法
                $('.layui-form')[0].reset()
            }
        })
    })
})