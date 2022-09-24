$(function () {
    // 定义加载文章类别的方法
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('加载文章类别失败!')
                }
                // 调用template加载文章类别  返回的是一个字符串
                var htmlSter = template('tpl-cate', res)
                $('[name = cate_id]').html(htmlSter)
                // console.log(htmlSter)
                form.render()  //重新渲染表单
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 点击按钮调用调用file的点击事件
    $('#btnChooseFile').on('click', function () {
        $('#file').click()

    })
    // 2.2 为file绑定改变事件 获取到改变后的file内容
    // 添加事件处理函数 通过e我们可以拿到选择后的文件
    $('#file').on('change', function (e) {
        // e.target.files 如果用户选择了文件则 length = 1 否则为0
        // 获取到文件的列表数组
        var filelist = e.target.files
        if (filelist.length === 0) {
            return
        }
        // 1. 拿到用户选择的文件  files[0] 表示伪数组的第一个文件
        var file = e.target.files[0]
        // 2. 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域



    })

    // 1.定义一个art_state 存状态
    var art_state = '已发布'
    // 为存为草稿按钮, 绑定点击事件处理函数  点击草稿直接提交表单
    $('#formSave').on('click', function () {
        art_state = '草稿'
    })

    // 为表单,绑定submit提交事件   
    $('#formPub').on('submit', function (e) {
        // (1) 阻止表单的默认提交行为
        e.preventDefault()
        // (2) 创建FromData()快速获取表单元素 // $(this)[0] jq 转 原生dom对象
        var fd = new FormData($(this)[0])

        fd.append('state', art_state)

        // 4. 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.status !== 0) return layer.msg('文章发布失败!')
                layer.msg('文章发布成功!')
                location.href = './art_list.html'
            }
        })
    }
})