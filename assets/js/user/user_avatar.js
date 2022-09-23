$(function () {
    // 引入layui中的layer
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.1 点击上传的时候调用 file  e为事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()

    })

    // 2.2 为file绑定改变事件 获取到改变后的file内容
    // 添加事件处理函数 通过e我们可以拿到选择后的文件
    $('#file').on('change', function (e) {

        // 用户选择图片后 获取到事件处理函数中的文件   e.target.files 是一个伪数组 我们可以把files当作一个数组去使用
        var filelist = e.target.files
        //    console.log(filelist)
        // 判断用户有无选择
        if (filelist.length === 0) {
            return layer.msg('未选择任何文件!')
        }

        // 2. 更换裁剪的图片
        // 2-1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2-2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        // 2-3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    // 给确认提交按钮绑定ajax事件 提交到服务器
    $('#btnUpload').on('click', function () {
        // 3. 将裁剪后的图片，输出为 base64 格式的字符串    
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改头像失败!')
                }
                layer.msg('修改头像成功!')
                window.parent.getUserInfo()
            }
        });

    })


})  