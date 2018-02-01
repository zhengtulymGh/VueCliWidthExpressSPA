var CanvasParticle = (function() {
  function getElementByTag(name) {
    return document.getElementsByTagName(name)
  }

  function getELementById(id) {
    return document.getElementById(id)
  }

  function clean() {}
  // 根据传入的config初始化画布
  function canvasInit(canvasConfig) {
    canvasConfig = canvasConfig || {}
    var html = getElementByTag("html")[0]
    var body = getElementByTag("body")[0]
    var canvasDiv = getELementById("canvasParticle")
    var canvasObj = document.createElement("canvas")
    var canvas = {
      element: canvasObj,
      points: [],
      // 默认配置
      config: {
        vx: canvasConfig.vx || 4,
        vy: canvasConfig.vy || 4,
        pointType: canvasConfig.pointType || 'circle',
        maxR: canvasConfig.maxR || 2,
        minR: canvasConfig.minR || 1,
        height: canvasConfig.height || 2,
        width: canvasConfig.width || 2,
        count: canvasConfig.count || 150,
        bgColor: canvasConfig.bgColor || "0, 0, 0",
        color: canvasConfig.color || "121, 162, 185",
        stroke: canvasConfig.stroke || "130,255,255",
        dist: canvasConfig.dist || 6000,
        e_dist: canvasConfig.e_dist || 20000,
        globalVx: canvasConfig.globalVx || 0,
        max_conn: 10
      }
    }
    // 获取context
    if (canvas.element.getContext("2d")) {
      canvas.context = canvas.element.getContext("2d")
    } else {
      return null
    }
    body.style.padding = "0"
    body.style.margin = "0"
    // body.replaceChild(canvas.element, canvasDiv)
    canvasDiv.appendChild(canvas.element)
    canvas.element.style = "position: absolute; top: 0; left: 0; z-index: -1;"
    canvasSize(canvas.element)
    window.onresize = function() {
      canvasSize(canvas.element)
    }
    body.onmousemove = function(e) {
      var event = e || window.event
      canvas.mouse = {
        x: event.clientX,
        y: event.clientY
      }
    }
    document.onmouseleave = function() {
      canvas.mouse = undefined
    }
    // drawBg(canvas)
    setInterval(function() {
      drawPoint(canvas)
      // drawPoint(canvas)
    }, 40)
  }
  // 设置canvas大小
  function canvasSize(canvas) {
    canvas.width = window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth
    canvas.height = window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight
  }
  // 画背景
  function drawBg(canvas) {
    var context = canvas.context
    context.beginPath()
    context.fillStyle = "rgb(" + canvas.config.bgColor + ")"
    context.fillRect(0, 0, canvas.element.width, canvas.element.height)
    context.closePath()
  }
  // 画点
  function drawPoint(canvas) {
    var context = canvas.context,
      point,
      dist
    context.clearRect(0, 0, canvas.element.width, canvas.element.height)
    context.beginPath()
    context.fillStyle = "rgb(" + canvas.config.bgColor + ")"
    context.fillRect(0, 0, canvas.element.width, canvas.element.height)
    for (var i = 0, len = canvas.config.count; i < len; i++) {
      if (canvas.points.length != canvas.config.count) {
        // 初始化所有点
        point = {
          x: Math.floor(Math.random() * canvas.element.width),
          y: Math.floor(Math.random() * canvas.element.height),
          r: Math.floor(canvas.config.minR + (canvas.config.maxR - canvas.config.minR) * Math.random()),
          vx: canvas.config.vx / 2 - Math.random() * canvas.config.vx,
          vy: canvas.config.vy / 2 - Math.random() * canvas.config.vy
        }
        point.vx += canvas.config.globalVx
      } else {
        // 处理球的速度和位置，并且做边界处理
        point = borderPoint(canvas.points[i], canvas)
      }
      // console.log(point)
      // context.clearRect(point.x-point.r, point.y-point.r, point.r*2, point.r*2)
      context.fillStyle = "rgb(" + canvas.config.color + ")"
      context.beginPath()
      // console.log(point.r)
      context.arc(point.x, point.y, point.r, 0, 2 * Math.PI + 1)
      // context.fillRect(point.x - canvas.config.width / 2, point.y - canvas.config.height / 2, canvas.config.width, canvas.config.height)
      context.closePath()
      context.fill()
      canvas.points[i] = point
    }
    drawLine(context, canvas, canvas.mouse)
    context.closePath()
  }
  // 边界处理
  // function borderPoint(point, canvas){
  //  var p = point
  //  if(point.x <= 0 || point.x >= canvas.element.width){
  //    p.vx = -p.vx
  //    p.x += p.vx
  //  }else if(point.y <= 0 || point.y >= canvas.element.height){
  //    p.vy = -p.vy
  //    p.y += p.vy
  //  }else{
  //    p = {
  //      x: p.x + p.vx,
  //      y: p.y + p.vy,
  //      r: point.r,
  //      vx: p.vx,
  //      vy: p.vy
  //    }
  //  }
  //  return p
  // }
  function borderPoint(point, canvas) {
    var p = point
    if (point.x <= 0) {
      p.x = canvas.element.width
    }
    if (point.x >= canvas.element.width) {
      p.x = 0
    }
    if (point.y <= 0 || point.y >= canvas.element.height) {
      p.vy = -p.vy
    }
    // p.r = (p.r + 0.5) % canvas.config.maxR + canvas.config.minR
    p = {
      x: p.x + p.vx,
      y: p.y + p.vy,
      r: point.r,
      vx: p.vx,
      vy: p.vy
    }
    return p
  }
  // 画线
  function drawLine(context, canvas, mouse) {
    context = context || canvas.context
    for (var i = 0, len = canvas.config.count; i < len; i++) {
      // 初始化最大连接数
      canvas.points[i].max_conn = 0
      // point to point
      for (var j = 0; j < len; j++) {
        if (i != j) {
          var dist = Math.round(canvas.points[i].x - canvas.points[j].x) * Math.round(canvas.points[i].x - canvas.points[j].x) + Math.round(canvas.points[i].y - canvas.points[j].y) * Math.round(canvas.points[i].y - canvas.points[j].y)
          // 两点距离小于吸附距离，而且小于最大连接数，则画线
          if (dist <= canvas.config.dist && canvas.points[i].max_conn < canvas.config.max_conn) {
            canvas.points[i].max_conn++
            // 距离越远，线条越细，而且越透明
            context.lineWidth = 0.5 - dist / canvas.config.dist
            context.strokeStyle = "rgba(" + canvas.config.stroke + "," + (1 - dist / canvas.config.dist) + ")"
            context.beginPath()
            context.moveTo(canvas.points[i].x, canvas.points[i].y)
            context.lineTo(canvas.points[j].x, canvas.points[j].y)
            context.stroke()
          }
        }
      }
      // 如果鼠标进入画布
      // point to mouse
      if (mouse) {
        dist = Math.round(canvas.points[i].x - mouse.x) * Math.round(canvas.points[i].x - mouse.x) + Math.round(canvas.points[i].y - mouse.y) * Math.round(canvas.points[i].y - mouse.y)
        // 遇到鼠标吸附距离时加速，直接改变point的x，y值达到加速效果
        if (dist > canvas.config.dist && dist <= canvas.config.e_dist) {
          canvas.points[i].x = canvas.points[i].x + (mouse.x - canvas.points[i].x) / 20
          canvas.points[i].y = canvas.points[i].y + (mouse.y - canvas.points[i].y) / 20
        }
        if (dist <= canvas.config.e_dist) {
          context.lineWidth = 1
          context.strokeStyle = "rgba(" + canvas.config.stroke + "," + (1 - dist / canvas.config.e_dist) + ")"
          context.beginPath()
          context.moveTo(canvas.points[i].x, canvas.points[i].y)
          context.lineTo(mouse.x, mouse.y)
          context.stroke()
        }
      }
    }
  }
  return {
    init: canvasInit,
    clean,
  }
})()
export default CanvasParticle