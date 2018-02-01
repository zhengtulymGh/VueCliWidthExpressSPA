var formidable = require('formidable'),
  request = require("request"),
  fs = require('fs'),
  Utils = require(__base + 'utils/utils'),
  server = require(__base + 'config/env').env.server;

var tmpDir = __base + '../tmp'

var uploader = {}
// 上传进度
uploader.progress = {};
// 返回参数
uploader.response = {
  'success': {
    'msg': 'ok',
  },
  'error': {
    'error': { msg: '上传文件失败' }
  }
};

/**
 * 图片上传，调用后端接口
 * @param req
 * @param res
 * @param tmpDir 临时目录
 */
exports.upload = (req, res, next) => {
  Utils.mkdirsSync(tmpDir);

  var form = new formidable.IncomingForm();
  form.uploadDir = tmpDir;
  form.parse(req, function (err, fields, files) {
    var file = files.excel;
    if (err) {
      res.send(uploader.response.error);
    } else {
      var uploadedPath = file.path;
      // 上传参数配置
      var formData = {
        excel: {
          value: fs.createReadStream(uploadedPath),
          options: {
            filename: file.name,
            contentType: file.type
          }
        },
        token: req.session.user.token
      };

      var options = {
        url: server + req._parsedUrl.pathname,
        formData: formData
      };

      // 上传文件到后台
      request.post(options, function optionalCallback(err, httpResponse, body) {
        if(!err && httpResponse.statusCode === 200) {
          var bodyObj = JSON.parse(body);
          if(bodyObj.msg === 'ok') {
            // uploader.response.success.result = bodyObj.result.urls;
            res.send(uploader.response.success);
          } else {
            // uploader.response.error.code = bodyObj.code;
            // uploader.response.error.message = bodyObj.message;
            res.send(uploader.response.error);
          }
        } else {
          res.send(uploader.response.error);
        }
        // 删除临时文件
        fs.unlink(uploadedPath);
      });
    }
  });
};

