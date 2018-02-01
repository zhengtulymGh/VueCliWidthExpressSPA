/**
 * Created by ayou on 2017/3/20.
 * Draw polygons based on canvas.
 */
import {
  deepClone
} from '../../utils'
import Event from '../../utils/events'

function CanvasDraw(config) {
  this.config = deepClone(config, {
    drawType: 'polygon', // 当前绘制的图形, polygon-多边形 line-路径 point-点 arrow-箭头
    canDraw: true,
    max: 6,
    pointColor: 'rgb(218,140,16)',
    pointSize: 5,
    lineColor: 'rgb(0, 166, 90)',
    lineSize: 2,
    textColor: '#333',
    polygonFillColor: 'rgba(0,174,217,0.4)',
    polygonLineColor: 'rgb(0,174,217)',
    polygonPointlColor: 'rgb(0,174,217)',
    polygonPointlSize: 2,
    polygonLineSize: 1,
    polygonActiveFillColor: 'rgba(149,255,255,0.4)',
    polygonActiveLineColor: '#95FFFF',
    polygonFrozonFillColor: 'rgba(255,88,73,0.4)',
    polygonFrozonLineColor: '#ff5849'
  })
  this.ctx = null
  this.bgctx = null
  this.canvas = null
  this.bgCanvas = null
  this.wrapper = null
  this.eventAdded = false
  // 画板左上角相对于父元素的坐标
  this.lt = {
    x: 0,
    y: 0
  }
  // 变化前的长和宽
  this.lastWidth = 0
  this.lastHeight = 0
  // 图像
  this.img = null
  this.imgLoaded = false
  this.imgW = 0
  this.imgH = 0
  // 正在绘画的点
  this.points = []
  // 此次绘画所画图形
  // 多边形, 多条线段, 点
  /**
    {
      type: 'line',
      points: [{x:1, y:2}]
    }
   */
  this.graphs = []
  // 画布初始时的图形
  // 数据格式跟上面一样
  this.oldGraphs = this.config.oldGraphs || []
  // if (config.polygons) {
  //   this._polygons = this.clonePolygons(config.polygons)
  // }
}
CanvasDraw.prototype = new Event()
CanvasDraw.prototype.constructor = CanvasDraw
CanvasDraw.prototype.setDrawType = function(type) {
  this.config.drawType = type
}
CanvasDraw.prototype.setCanDraw = function(canDraw) {
  this.config.canDraw = canDraw
  if (!this.eventAdded) this.initEventListener()
}
CanvasDraw.prototype.init = function() {
  if (!this.wrapper) {
    var _wrapper = document.getElementById(this.config.id)
    _wrapper.style.position = 'relative'
    this.wrapper = _wrapper
  }
  this.initBg()
  // 禁止浏览器右键
  this.addHandler(document.body, 'contextmenu', function(e) {
    e.returnValue = false
  })
}
CanvasDraw.prototype.initBg = function(cb) {
  var me = this
  var image = new Image()
  image.src = this.config.bgImg
  image.onload = function() {
    var dx = 0,
      dy = 0
    me.imgLoaded = true
    me.img = image
    me.imgW = image.width
    me.imgH = image.height
    //1 contain方式放置图片
    var wScale = image.width / me.config.width
    var hScale = image.height / me.config.height
    var _scale = wScale < hScale ? hScale : wScale
    var _width = image.width / _scale
    var _height = image.height / _scale
    if (wScale < hScale) {
      dx = parseInt((me.config.width - _width) / 2)
    } else {
      dy = parseInt((me.config.height - _height) / 2)
    }
    //2 拉伸方式放置图片
    // var _width = me.config.width
    // var _height = me.config.height
    me.lt.x = dx
    me.lt.y = dy
    if (!me.canvas) {
      me.canvas = me.createLayer(dx, dy, _width, _height, 100)
      me.bgCanvas = me.createLayer(dx, dy, _width, _height, 1)
      me.bgctx = me.bgCanvas.getContext("2d")
      me.ctx = me.canvas.getContext("2d")
      me.wrapper.appendChild(me.canvas)
      me.wrapper.appendChild(me.bgCanvas)
      if (me.config.canDraw) {
        me.initEventListener()
      }
      me.bgctx.drawImage(image, 0, 0, _width, _height)
      me.initPolygons()
    } else {
      me.resizeCanvas(me.canvas, dx, dy, _width, _height)
      me.resizeCanvas(me.bgCanvas, dx, dy, _width, _height)
    }
    // 通知listener初始化完成
    me.trigger('afterInit')
    me.lastWidth = _width
    me.lastHeight = _height
  }
}
CanvasDraw.prototype.initPolygons = function() {
  // 坐标转换，画图
  var len = this.oldGraphs.length
  for (var i = 0; i < len; i++) {
    var graph = this.oldGraphs[i]
    var tmpPoints = this.clonePolygon(graph.points)
    for (var j = 0; j < tmpPoints.length; j++) {
      var _p = this.coordinateTransform(tmpPoints[j])
      tmpPoints[j] = _p
    }
    // tPoints 是转换后的坐标
    graph.tPoints = tmpPoints
    var params = [tmpPoints, graph.text]
    if (graph.active) {
      params.push(this.config.polygonActiveLineColor)
      params.push(this.config.polygonActiveFillColor)
    }
    this.drawGraph.call(this, {
      type: graph.type,
      points: tmpPoints
    })
  }
}
// 画图形
CanvasDraw.prototype.drawGraph = function(graph) {
  const {
    type,
    points
  } = graph
  switch (type) {
    case 'line':
      this.drawMultiLine(points)
      break
    case 'polygon':
      this.drawPolygon(points)
      break
    case 'point':
      this.drawPoint(points[0].x, points[0].y)
      break
    case 'arrow':
      this.drawArrow(points)
      break
    default:
      throw Error('no draw function')
  }
}
// 画箭头
CanvasDraw.prototype.drawArrow = function(points, fillColor = 'rgba(32,160,255,0.8)') {
  const {
    ctx
  } = this
  // 三角形质心
  var p = {
    x: 0,
    y: 0
  }
  for (let i = 0; i < points.length; i++) {
    p.x += points[i].x
    p.y += points[i].y
  }
  p.x /= 3
  p.y /= 3
  // 三角形箭头位置
  var n = 2 / 3
  // 三角形箭头另外两个点
  var p0 = {
      y: n * (points[2].y - points[0].y) + points[0].y,
      x: n * (points[2].x - points[0].x) + points[0].x
    },
    p1 = {
      y: n * (points[2].y - points[1].y) + points[1].y,
      x: n * (points[2].x - points[1].x) + points[1].x
    }
  ctx.fillStyle = fillColor || this.config.polygonFillColor
  ctx.lineCap = 'miter'
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  ctx.quadraticCurveTo(p.x, p.y, points[2].x, points[2].y)
  ctx.quadraticCurveTo(p.x, p.y, points[1].x, points[1].y)
  ctx.closePath()
  ctx.fill()
  // ctx.fillStyle = rgba(0, 255, ) || this.config.polygonFillColor
  // ctx.lineCap = 'miter'
  // ctx.globalCompositeOperation = 'source-over'
  ctx.beginPath()
  ctx.moveTo(p0.x, p0.y)
  ctx.lineTo(points[2].x, points[2].y)
  ctx.lineTo(p1.x, p1.y)
  ctx.closePath()
  ctx.fill()
}
// 画多边形
CanvasDraw.prototype.drawPolygon = function(points, text, lineColor, fillColor) {
  var len = points.length
  if (len < 3) {
    console.log('点不够呀！')
    return
  }
  var ctx = this.ctx
  // for (var i = 0; i < len; i++) {
  //   // 点
  //   this.drawPoint(points[i].x, points[i].y)
  // }
  ctx.beginPath()
  ctx.strokeStyle = lineColor || this.config.polygonLineColor
  ctx.fillStyle = fillColor || this.config.polygonFillColor
  for (var i = 0; i < len; i++) {
    // 画线
    if (i === 0) {
      ctx.moveTo(points[i].x, points[i].y)
    } else {
      ctx.lineTo(points[i].x, points[i].y)
      ctx.stroke()
    }
  }
  ctx.lineTo(points[0].x, points[0].y)
  ctx.stroke()
  ctx.closePath()
  ctx.fill()
  // 文字
  if (!text) return
  var cx = 0,
    cy = 0
  for (var i = 0; i < len; i++) {
    cx += points[i].x
    cy += points[i].y
  }
  cx /= len
  cy /= len
  ctx.fillStyle = this.config.textColor
  ctx.font = 'normal 12px Microsoft YaHei'
  ctx.textAlign = 'center'
  ctx.fillText(text, cx, cy)
}
// 克隆一个多边形的数据
CanvasDraw.prototype.clonePolygon = function(polygon) {
  var pointNum = polygon.length
  var tmpPoints = []
  for (var i = 0; i < pointNum; i++) {
    var tmpPoint = {}
    tmpPoint.x = polygon[i].x
    tmpPoint.y = polygon[i].y
    tmpPoints.push(tmpPoint)
  }
  return tmpPoints
}
// 克隆传递进来的多边形数据，防止修改到外面传递进来的数据
CanvasDraw.prototype.clonePolygons = function(polygons) {
  var len = polygons.length
  var tmpPoints = []
  var tmpPolygons = []
  for (var i = 0; i < len; i++) {
    tmpPoints = this.clonePolygon(polygons[i].points)
    tmpPolygons.push({
      text: polygons[i].text,
      active: polygons[i].active,
      points: tmpPoints
    })
  }
  return tmpPolygons
}
CanvasDraw.prototype.createLayer = function(x, y, w, h, zIndex) {
  var canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  canvas.style.position = "absolute"
  canvas.style.top = y + 'px'
  canvas.style.left = x + 'px'
  canvas.style.zIndex = zIndex
  return canvas
}
CanvasDraw.prototype.resizeCanvas = function(canvas, x, y, w, h) {
  canvas.width = w
  canvas.height = h
  canvas.style.top = y + 'px'
  canvas.style.left = x + 'px'
}
CanvasDraw.prototype.resizeDraw = function() {
  var me = this

  function _resizePoint(point) {
    point.x *= (me.canvas.width / me.lastWidth)
    point.y *= (me.canvas.height / me.lastHeight)
  }
  var pointsNum = this.points.length
  for (var i = 0; i < pointsNum; i++) {
    _resizePoint(this.points[i])
  }
  var polygonsNum = this.graphs.length
  for (var i = 0; i < polygonsNum; i++) {
    var pNum = this.graphs[i].points.length
    for (var j = 0; j < pNum; j++) {
      _resizePoint(this.graphs[i].points[j])
    }
  }
  var polygonsNum = this.oldGraphs.length
  for (var i = 0; i < polygonsNum; i++) {
    const graph = this.oldGraphs[i]
    var pNum = graph.points.length
    for (var j = 0; j < pNum; j++) {
      graph.tPoints[j].x = graph.points[j].x * me.canvas.width
      graph.tPoints[j].y = graph.points[j].y * me.canvas.height
    }
  }
}
CanvasDraw.prototype.coordinateTransform = function(point) {
  var me = this
  return {
    x: (parseFloat(point.x) * me.canvas.width),
    y: (parseFloat(point.y) * me.canvas.height)
  }
}
CanvasDraw.prototype.addPolygons = function(polygons) {
  var len = polygons.length
  var tmpPolygons = []
  for (var i = 0; i < len; i++) {
    var pointNum = polygons[i].points.length;
    tmpPoints = []
    for (var j = 0; j < pointNum; j++) {
      var tmpPoint = {}
      tmpPoint.x = polygons[i].points[j].x
      tmpPoint.y = polygons[i].points[j].y
      var _p = this.coordinateTransform(tmpPoint)
      tmpPoints.push(_p)
    }
    tmpPolygons.push({
      text: polygons[i].text,
      tPoints: tmpPoints,
      points: polygons[i].points
    })
  }
  this.oldGraphs = this.oldGraphs.concat(tmpPolygons)
  this.reDraw()
}
CanvasDraw.prototype.drawPoint = function(x, y, color, size) {
  var ctx = this.ctx
  ctx.beginPath()
  ctx.fillStyle = color || this.config.pointColor
  ctx.arc(x, y, size || this.config.pointSize, 0, 2 * Math.PI)
  ctx.fill()
}
CanvasDraw.prototype.drawLine = function(x1, y1, x2, y2, color, size) {
  var ctx = this.ctx
  ctx.beginPath()
  ctx.strokeStyle = color || this.config.lineColor
  ctx.lineWidth = size || this.config.lineSize
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}
CanvasDraw.prototype.drawMultiLine = function(points) {
  var me = this
  var pLen = points.length
  if (pLen > 0) {
    for (var i = 0; i < pLen - 1; i++) {
      // 点
      me.drawPoint(points[i].x, points[i].y, me.config.lineColor)
      // 线
      me.drawLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
    }
    // 最后那个点
    me.drawPoint(points[pLen - 1].x, points[pLen - 1].y, me.config.lineColor)
  }
}
CanvasDraw.prototype.reDraw = function(isReDrawBgImg) {
  var me = this
  // 清空画布
  me.ctx.clearRect(0, 0, me.canvas.width, me.canvas.height)
  // 画背景
  if (isReDrawBgImg) {
    me.bgctx.clearRect(0, 0, me.canvas.width, me.canvas.height)
    me.bgctx.drawImage(me.img, 0, 0, me.canvas.width, me.canvas.height)
  }
  // 当前正在绘制的图
  this.drawMultiLine(me.points)
  // 画多边形
  for (var i = 0; i < me.oldGraphs.length; i++) {
    me.drawGraph({
      type: me.oldGraphs[i].type,
      points: me.oldGraphs[i].tPoints
    })
  }
  // 本次画的图形
  for (var i = 0; i < me.graphs.length; i++) {
    me.drawGraph(me.graphs[i])
  }
}
CanvasDraw.prototype.isIn = function(x, y) {
  var me = this
  if (0 < x && me.canvas.width > x && 0 < y && me.canvas.height > y) {
    return true
  }
  return false
}
CanvasDraw.prototype.afterRightClick = function() {
  const me = this
  if (me.graphs.length >= me.config.max) return
  let graph = {
    points: me.points
  }
  switch (me.config.drawType) {
    case 'line':
      graph.type = 'line'
      if (me.points.length < 2) {
        return
      }
      break
    case 'polygon':
      graph.type = 'polygon'
      if (me.points.length < 3) {
        return
      }
      break
    default:
      throw Error('no draw type')
  }
  me.graphs.push(graph)
  me.points = []
  me.reDraw()
  // me.trigger('afterRightClick', me.getGraphsData())
  me.afterDrawGraph(me.graphs)
}
CanvasDraw.prototype.afterDrawGraph = function(graph) {
  this.trigger('afterDrawGraph', graph)
}
CanvasDraw.prototype.initEventListener = function() {
  var me = this
  me.eventAdded = true
  me.addHandler(me.canvas, 'mousedown', function(e) {
    if (!me.config.canDraw) return
    if (me.graphs.length === me.config.max) return
    // 鼠标左键
    if (e.button === 0) {
      var x = e.offsetX
      var y = e.offsetY
      if (me.config.drawType === 'point' && me.graphs.length < me.config.max) {
        const graph = {
          points: [{
            x,
            y
          }],
          type: 'point'
        }
        me.graphs.push(graph)
        me.reDraw()
        me.afterDrawGraph(me.graphs)
        return
      }
      if (!me.isIn(x, y)) return
      me.points.push({
        x: x,
        y: y
      })
      if (me.config.drawType === 'arrow' && me.points.length === 3) {
        const graph = {
          points: me.points,
          type: 'arrow'
        }
        me.graphs.push(graph)
        me.points = []
        me.reDraw()
        me.afterDrawGraph(me.graphs)
        return
      }
      me.drawPoint(x, y)
    }
    // 鼠标右键
    if (e.button === 2) {
      if (me.config.drawType === 'point' || me.config.drawType === 'arrow') return
      if (me.points.length <= 0) return
      me.afterRightClick()
    }
  })
  me.addHandler(me.canvas, 'mousemove', function(e) {
    if (!me.config.canDraw) return
    if (me.config.drawType === 'point') return
    if (me.graphs.length === me.config.max) return
    if (me.points.length === 0) {
      return
    }
    var x = e.offsetX
    var y = e.offsetY
    var lastX = me.points[me.points.length - 1].x
    var lastY = me.points[me.points.length - 1].y
    me.reDraw()
    me.drawLine(lastX, lastY, x, y)
  })
  me.addHandler(window, 'keyup', function(e) {
    if (e.keyCode === 27) {
      if (me.points.length > 0) {
        me.points.pop()
      } else {
        me.graphs.pop()
      }
      me.reDraw()
    }
  })
}
CanvasDraw.prototype.addHandler = function(ele, type, handler) {
  if (ele.addEventListener) {
    ele.addEventListener(type, handler, false)
  } else if (ele.attachEvent) {
    ele.attachEvent('on' + type, handler)
  } else {
    ele['on' + type] = handler
  }
}
// 得到相对于画板归一化的坐标
CanvasDraw.prototype.getGraphsData = function() {
  var len = this.graphs.length
  for (var i = 0; i < len; i++) {
    var graph = this.graphs[i]
    var pN = graph.points.length
    for (var j = 0; j < pN; j++) {
      graph.points[j].x /= this.canvas.width
      graph.points[j].y /= this.canvas.height
    }
  }
  return this.graphs
}
// 重置本次绘画
CanvasDraw.prototype.reset = function() {
  this.graphs = []
  this.reDraw()
}
// 清空所有多边形
CanvasDraw.prototype.clean = function() {
  this.graphs = []
  this.oldGraphs = []
  this.reDraw()
}
CanvasDraw.prototype.delete = function(cb) {
  if (!this.canvas) return
  var _parentElement = this.canvas.parentNode
  if (_parentElement) {
    _parentElement.removeChild(this.canvas)
    _parentElement.removeChild(this.bgCanvas)
    cb()
  }
}
CanvasDraw.prototype.resize = function(width, height, cb) {
  var me = this
  me.config.width = width
  me.config.height = height
  me.init(function() {
    me.resizeDraw()
    me.reDraw(true)
    typeof cb === 'function' && cb()
  })
}
export default CanvasDraw