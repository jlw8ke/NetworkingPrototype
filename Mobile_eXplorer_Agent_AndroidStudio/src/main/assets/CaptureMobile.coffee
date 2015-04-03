class CaptureModalDialogs
  @register : (win, isEnable) =>
    win.oldAlert = win.oldAlert || win.alert 
    win.oldConfirm = win.oldConfirm || win.confirm  
    win.oldPrompt = win.oldPrompt || win.prompt 
    fakePoints = []
    point = 
      clientX: -100
      clientY: -100
      pageX: -100
      pageY: -100
      timeStamp: Date.now()
    fakePoints.push point
    if isEnable is true
      win.alert = (msg) ->
        ret = win.oldAlert msg
        info = 
          name: "alert"
          value: msg
        data = MXCapture.composeCaptureData "modalDialog", Date.now(), info, fakePoints
        MXCapture.sendData data
        return
      win.confirm = (msg) ->
        ret = win.oldConfirm msg
        info = 
          name: "confirm"
          value: msg 
          response: ret
        data = MXCapture.composeCaptureData "modalDialog", Date.now(), info, fakePoints
        MXCapture.sendData data
        return
      win.prompt = (msg, defaultValue) ->
        ret = win.oldPrompt msg, defaultValue
        info = 
          name: "prompt"
          value: msg
          response  : ret
          defaultValue: defaultValue
        data = MXCapture.composeCaptureData "modalDialog", Date.now(), info, fakePoints
        MXCapture.sendData data
        return
    else
      win.alert = win.oldAlert
      win.confirm = win.oldConfirm
      win.prompt = win.oldPrompt
    return

class EditModeParam
  constructor : () ->
    @clearData()

  setEditingMode : (ctrlHtml, timeStamp) =>
    @beginEditTimeStamp = timeStamp
    @ctrlHtml = ctrlHtml
  clearData : () =>
    @beginEditTimeStamp = 0
    @ctrlHtml = null
    @isEditingText = false
  isFocused : () =>
    if @beginEditTimeStamp != 0 and @ctrlHtml?
      return true
    return false



class Point 
  constructor : (touch, timeStamp) ->
    touch       = touch         || {}
    @clientX    = (touch.clientX || 0)
    @clientY    = (touch.clientY || 0)
    @pageX      = (touch.pageX   || 0)
    @pageY      = (touch.pageY   || 0)
    @timeStamp  = timeStamp     || 0 
  
  isEqual : (point) =>
    #if (@clientX isnt point.clientX or @clientY isnt point.clientY)
    if (Math.abs(@clientX-point.clientX) > 10 or Math.abs(@clientY-point.clientY) > 10)
      return false
    return true



# MXCapture class
#
#
class MXCapture
  constructor : () ->
    @captureMode = true #true = capturing phase , false = bubbling phase 
    @points = []
    @targetName = null
    @editParam = new EditModeParam()
    @inputTimeStamp = 0
  #Utility functions
  @jsonObjectToString : (jsonObj) =>
    try
      if Object.toJSON
        return Object.toJSON jsonObj
      else
        return JSON.stringify jsonObj
    catch err
      console.log "jsonObjectToString error"
      return ""
	  
  #send captured data to native code
  @sendData : (jsonObj) =>
    str = MXCapture.jsonObjectToString jsonObj
    console.log "action = #{jsonObj.action} | name = #{jsonObj.extra.name} | value = #{jsonObj.extra.value} | ctrlType = #{jsonObj.extra.ctrlType}"
    #console.log "sendData = #{str}"
    PlatformUtility.sendData str
 
  onFrameload : (e) =>
    frame = e.srcElement || e.target
    if frame
      try
        doc = frame.contentWindow.document || frame.contentDocument
        if doc
          @registerEvent doc, isRegister
          @injectScriptToFrame doc, isRegister
      catch error
        console.log error
    return    

  injectScriptToFrame : (doc, isRegister) =>
    frames = doc.getElementsByTagName('iframe')
    for frame in frames
      frame.onload = @onFrameload
      try
        childDoc = frame.document || frame.contentDocument  || frame.contentWindow.document
        if (childDoc)
          @registerEvent childDoc, isRegister
          @injectScriptToFrame childDoc, isRegister  
      catch error
        #console.log "error = #{error}, frame.src=#{frame.src}" 
        console.log "error = #{error}" 
        
  registerEvent : (doc, isRegister) =>
    fn = if isRegister then doc.addEventListener else doc.removeEventListener
    fn "touchstart",    @touchStartHandler,     @captureMode
    fn "touchmove",     @touchMoveHandler,      @captureMode
    fn "touchend",      @touchEndHandler,       @captureMode
    fn "touchcancel",   @touchCancelHandler,    @captureMode
    fn "scroll",        @scrollHandler,         @captureMode
    fn "change",        @onChangeHandler,       @captureMode
    fn "input",         @onInputHandler,        @captureMode
    try
      win = doc.defaultView || doc.ownerDocument
      CaptureModalDialogs.register win,isRegister  
    catch error
      console.log error 
       
  registerEvents : () =>
    @registerEvent document, true    
    # inject to child frame if they are not injected
    @injectScriptToFrame document, true

  #unregister handles
  unregisterEvents : () =>
    @registerEvent document, false
    # inject to child frame if they are not injected
    @injectScriptToFrame document, false
    
  touchStartHandler : (ev) =>
    if @editParam.isFocused() and ev.target is @editParam.ctrlHtml
      return
    #check to finish edit flow if any
    if @editParam.isEditingText is true 
      if @editParam.ctrlHtml isnt ev.target
        @endEditFlow @editParam.ctrlHtml
        @editParam.clearData()
    @points.length = 0
    point = new Point(ev.changedTouches[0], ev.timeStamp)
    @correctPosition ev.view, point
    @convertToPixel point
    @points.push point
    ctrlInfo = recognizeControl ev.target, @targetName
    if ctrlInfo.type is 1 # touch on edit box
      @editParam.setEditingMode ev.target, ev.timeStamp
      #console.log "enter editing mode ctrlHtml '#{ev.target}', timeStamp  '#{ev.timeStamp}'"
    PlatformUtility.startTouchAction(ctrlInfo.type) 
    return
  
  endEditFlow : (ctrlHtml) =>
    ctrlInfo = recognizeControl ctrlHtml, @targetName
    if ctrlInfo
      p =
        clientX: ctrlInfo.left + ((ctrlInfo.right - ctrlInfo.left) / 2)
        clientY: ctrlInfo.top + ((ctrlInfo.bottom - ctrlInfo.top) / 2)
      point = new Point(p, Date.now())
      @correctPosition ctrlHtml.ownerDocument.defaultView, point
      @convertToPixel point
      @points.push point
      data = MXCapture.composeCaptureData "onChanged", @editParam.beginEditTimeStamp, ctrlInfo, @points
      ret = MXCapture.sendData data
      #console.log "[sendData] endEditFlow, length = #{ret}"#MXCapture.jsonObjectToString(ctrlInfo)
    else
      console.log "Could not get data of '#{ctrlHtml}', target = '#{@targetName}'"
    return

  touchMoveHandler : (ev) =>
    #@dumpEvent ev
    return
    
  touchEndHandler : (ev) => 
    #@dumpEvent ev
    if @points.length < 1
      return
    point = new Point(ev.changedTouches[0], ev.timeStamp)
    @correctPosition ev.view, point
    @convertToPixel point
    @points.push point
    if point.isEqual (@points[0]) 
      #single Touch action
      ctrlInfo = recognizeControl ev.target, @targetName
      data = MXCapture.composeCaptureData "onTouched", ev.timeStamp, ctrlInfo, @points
      ret = MXCapture.sendData data
      #console.log "[sendData] touchend, length = #{ret}"#MXCapture.jsonObjectToString(ctrlInfo)  
    else
      #detect swipe action 
      @swipeDetect point, ev.timeStamp, @swipeCallback
    @points.length = 0
    return
  
  touchCancelHandler : (ev) =>
    #@dumpEvent ev
    #clear points
    @points.length = 0
    return

  scrollHandler : (ev) =>
    #@dumpEvent ev
    return
  onChangeHandler : (ev) =>
    targetNode = ev.target.nodeName.toLowerCase()
    if targetNode isnt "select"
      if @editParam.isEditingText is true and ev.target is @editParam.ctrlHtml
        if ((ev.timeStamp - @inputTimeStamp) > 50)
          @endEditFlow @editParam.ctrlHtml
        @editParam.clearData()
      return
    @endEditFlow ev.target
    @editParam.clearData()
    return
  
  onInputHandler : (ev) =>
    #console.log "input timeStamp #{ev.timeStamp}"
    if @editParam.isFocused() is true
      @editParam.isEditingText = true
    else
      #console.log "input #{ev.type} but has focus on textbox, detect target"
      ctrlInfo = recognizeControl ev.target, @targetName
      if ctrlInfo.type is 1 # enter input to edit box
        @editParam.setEditingMode ev.target, ev.timeStamp
        @editParam.isEditingText = true
        @inputTimeStamp = ev.timeStamp
    return

  #convert point from window in child frame -> top window
  correctPosition :  (win, point) =>
    #scale = 1#top.screen.height / top.innerHeight
    if win
      frame = win.frameElement
      while frame
        rect = frame.getBoundingClientRect()
        #point.clientX += (rect.left * scale)
        #point.clientY += (rect.top * scale)
        point.clientX += (rect.left)
        point.clientY += (rect.top)
        
        win = win.frameElement.ownerDocument.defaultView || {}
        frame = win.frameElement
    return

  convertToPixel : (point) =>
    if (PlatformUtility.getCurrentScale)
      scale = PlatformUtility.getCurrentScale()
      #console.log "currentScale = #{scale}"
      #console.log "scale = #{top.document.documentElement.clientWidth / top.innerWidth}"
      point.clientX    *=  scale 
      point.clientY    *=  scale 
      point.pageX      *=  scale 
      point.pageY      *=  scale 
    return

  #dumpEvent : (ev) =>
  #  data = {}
  #  data.eventType = ev.type 
  #  data.timeStamp = ev.timeStamp
  #  win = ev.view || ev.target.ownerDocument.defaultView
  #  frame = win.frameElement
  #  while frame
  #    data.frames = data.frames || []
  #    frameInfo = {} 
  #    frameInfo.id = frame.id || "unknown"
  #    rect = frame.getBoundingClientRect()
  #    frameInfo.left = rect.left
  #    frameInfo.top = rect.top
  #    data.frames.push frameInfo
  #    win = win.frameElement.ownerDocument.defaultView
  #    frame = win.frameElement
  #  console.log MXCapture.jsonObjectToString data

  detectTarget : () =>
    if null is @targetName
      if top.dojo
        @targetName = "dojo"
      else if top.$ && top.$.ui
        @targetName = "jquery"
      else if top.Ext
        @targetName = "sencha_touch"
      else 
        @targetName = ""
      console.log "detectTarget = #{@targetName}"
    PlatformUtility.sendTarget(@targetName);

  swipeDetect : (endPoint, eventTimeStamp, callback) =>
    if (@points.length is 0)
      return
    threadhold = 70 # required min distance traveld to be considered swipe
    restraint = 100 # maximun distance allowed at the same time in perpendicular direction
    allowedTime = 300 # maximun time allowed to travle that distance 
    distX = endPoint.pageX - @points[0].pageX
    distY = endPoint.pageY - @points[0].pageY
    if ((Math.abs(distX) >= threadhold) && (Math.abs(distY) <= restraint))
      if (distX < 0)
        swipeDirection = 'left'
      else
        swipeDirection = 'right'
    else
      if ((Math.abs(distY) >= threadhold) && (Math.abs(distX) <= restraint))
        if (distY < 0)
          swipeDirection = 'up' 
        else
          swipeDirection = 'down'
    callback swipeDirection, eventTimeStamp if callback
    return

  swipeCallback : (strDirection, eventTimeStamp) =>
    info = 
      name: "swipe"
      value: strDirection
    data = MXCapture.composeCaptureData "onMoved", eventTimeStamp, info, @points
    MXCapture.sendData data
    console.log "Swipe to #{strDirection}"

  @composeCaptureData : (actName, timeStamp, info, pointList) =>
    data = 
      action: actName
      timeStamp: timeStamp
      url: top.document.URL 
      title: top.document.title
      #currentScale: top.document.documentElement.clientWidth / top.innerWidth
      #devicePixelRatio : top.devicePixelRatio
      extra:
        name: info.name 
        value: info.value
        ctrlType: info.type
        response: info.response
        defaultValue: info.defaultValue
        points: pointList
if (window is window.top and document.mxCapture is undefined)
  document.mxCapture = document.mxCapture || new MXCapture
  document.mxCapture.detectTarget()
  console.log "mxCapture is created! currentScale = #{PlatformUtility.getCurrentScale()}"