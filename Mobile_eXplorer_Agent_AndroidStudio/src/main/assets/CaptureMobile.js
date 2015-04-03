// Generated by CoffeeScript 1.9.0
(function() {
  var CaptureModalDialogs, EditModeParam, MXCapture, Point,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CaptureModalDialogs = (function() {
    function CaptureModalDialogs() {}

    CaptureModalDialogs.register = function(win, isEnable) {
      var fakePoints, point;
      win.oldAlert = win.oldAlert || win.alert;
      win.oldConfirm = win.oldConfirm || win.confirm;
      win.oldPrompt = win.oldPrompt || win.prompt;
      fakePoints = [];
      point = {
        clientX: -100,
        clientY: -100,
        pageX: -100,
        pageY: -100,
        timeStamp: Date.now()
      };
      fakePoints.push(point);
      if (isEnable === true) {
        win.alert = function(msg) {
          var data, info, ret;
          ret = win.oldAlert(msg);
          info = {
            name: "alert",
            value: msg
          };
          data = MXCapture.composeCaptureData("modalDialog", Date.now(), info, fakePoints);
          MXCapture.sendData(data);
        };
        win.confirm = function(msg) {
          var data, info, ret;
          ret = win.oldConfirm(msg);
          info = {
            name: "confirm",
            value: msg,
            response: ret
          };
          data = MXCapture.composeCaptureData("modalDialog", Date.now(), info, fakePoints);
          MXCapture.sendData(data);
        };
        win.prompt = function(msg, defaultValue) {
          var data, info, ret;
          ret = win.oldPrompt(msg, defaultValue);
          info = {
            name: "prompt",
            value: msg,
            response: ret,
            defaultValue: defaultValue
          };
          data = MXCapture.composeCaptureData("modalDialog", Date.now(), info, fakePoints);
          MXCapture.sendData(data);
        };
      } else {
        win.alert = win.oldAlert;
        win.confirm = win.oldConfirm;
        win.prompt = win.oldPrompt;
      }
    };

    return CaptureModalDialogs;

  })();

  EditModeParam = (function() {
    function EditModeParam() {
      this.isFocused = __bind(this.isFocused, this);
      this.clearData = __bind(this.clearData, this);
      this.setEditingMode = __bind(this.setEditingMode, this);
      this.clearData();
    }

    EditModeParam.prototype.setEditingMode = function(ctrlHtml, timeStamp) {
      this.beginEditTimeStamp = timeStamp;
      return this.ctrlHtml = ctrlHtml;
    };

    EditModeParam.prototype.clearData = function() {
      this.beginEditTimeStamp = 0;
      this.ctrlHtml = null;
      return this.isEditingText = false;
    };

    EditModeParam.prototype.isFocused = function() {
      if (this.beginEditTimeStamp !== 0 && (this.ctrlHtml != null)) {
        return true;
      }
      return false;
    };

    return EditModeParam;

  })();

  Point = (function() {
    function Point(touch, timeStamp) {
      this.isEqual = __bind(this.isEqual, this);
      touch = touch || {};
      this.clientX = touch.clientX || 0;
      this.clientY = touch.clientY || 0;
      this.pageX = touch.pageX || 0;
      this.pageY = touch.pageY || 0;
      this.timeStamp = timeStamp || 0;
    }

    Point.prototype.isEqual = function(point) {
      if (Math.abs(this.clientX - point.clientX) > 10 || Math.abs(this.clientY - point.clientY) > 10) {
        return false;
      }
      return true;
    };

    return Point;

  })();

  MXCapture = (function() {
    function MXCapture() {
      this.swipeCallback = __bind(this.swipeCallback, this);
      this.swipeDetect = __bind(this.swipeDetect, this);
      this.detectTarget = __bind(this.detectTarget, this);
      this.convertToPixel = __bind(this.convertToPixel, this);
      this.correctPosition = __bind(this.correctPosition, this);
      this.onInputHandler = __bind(this.onInputHandler, this);
      this.onChangeHandler = __bind(this.onChangeHandler, this);
      this.scrollHandler = __bind(this.scrollHandler, this);
      this.touchCancelHandler = __bind(this.touchCancelHandler, this);
      this.touchEndHandler = __bind(this.touchEndHandler, this);
      this.touchMoveHandler = __bind(this.touchMoveHandler, this);
      this.endEditFlow = __bind(this.endEditFlow, this);
      this.touchStartHandler = __bind(this.touchStartHandler, this);
      this.unregisterEvents = __bind(this.unregisterEvents, this);
      this.registerEvents = __bind(this.registerEvents, this);
      this.registerEvent = __bind(this.registerEvent, this);
      this.injectScriptToFrame = __bind(this.injectScriptToFrame, this);
      this.onFrameload = __bind(this.onFrameload, this);
      this.captureMode = true;
      this.points = [];
      this.targetName = null;
      this.editParam = new EditModeParam();
      this.inputTimeStamp = 0;
    }

    MXCapture.jsonObjectToString = function(jsonObj) {
      var err;
      try {
        if (Object.toJSON) {
          return Object.toJSON(jsonObj);
        } else {
          return JSON.stringify(jsonObj);
        }
      } catch (_error) {
        err = _error;
        console.log("jsonObjectToString error");
        return "";
      }
    };

    MXCapture.sendData = function(jsonObj) {
      var str;
      str = MXCapture.jsonObjectToString(jsonObj);
      console.log("action = " + jsonObj.action + " | name = " + jsonObj.extra.name + " | value = " + jsonObj.extra.value + " | ctrlType = " + jsonObj.extra.ctrlType);
      return PlatformUtility.sendData(str);
    };

    MXCapture.prototype.onFrameload = function(e) {
      var doc, error, frame;
      frame = e.srcElement || e.target;
      if (frame) {
        try {
          doc = frame.contentWindow.document || frame.contentDocument;
          if (doc) {
            this.registerEvent(doc, isRegister);
            this.injectScriptToFrame(doc, isRegister);
          }
        } catch (_error) {
          error = _error;
          console.log(error);
        }
      }
    };

    MXCapture.prototype.injectScriptToFrame = function(doc, isRegister) {
      var childDoc, error, frame, frames, _i, _len, _results;
      frames = doc.getElementsByTagName('iframe');
      _results = [];
      for (_i = 0, _len = frames.length; _i < _len; _i++) {
        frame = frames[_i];
        frame.onload = this.onFrameload;
        try {
          childDoc = frame.document || frame.contentDocument || frame.contentWindow.document;
          if (childDoc) {
            this.registerEvent(childDoc, isRegister);
            _results.push(this.injectScriptToFrame(childDoc, isRegister));
          } else {
            _results.push(void 0);
          }
        } catch (_error) {
          error = _error;
          _results.push(console.log("error = " + error));
        }
      }
      return _results;
    };

    MXCapture.prototype.registerEvent = function(doc, isRegister) {
      var error, fn, win;
      fn = isRegister ? doc.addEventListener : doc.removeEventListener;
      fn("touchstart", this.touchStartHandler, this.captureMode);
      fn("touchmove", this.touchMoveHandler, this.captureMode);
      fn("touchend", this.touchEndHandler, this.captureMode);
      fn("touchcancel", this.touchCancelHandler, this.captureMode);
      fn("scroll", this.scrollHandler, this.captureMode);
      fn("change", this.onChangeHandler, this.captureMode);
      fn("input", this.onInputHandler, this.captureMode);
      try {
        win = doc.defaultView || doc.ownerDocument;
        return CaptureModalDialogs.register(win, isRegister);
      } catch (_error) {
        error = _error;
        return console.log(error);
      }
    };

    MXCapture.prototype.registerEvents = function() {
      this.registerEvent(document, true);
      return this.injectScriptToFrame(document, true);
    };

    MXCapture.prototype.unregisterEvents = function() {
      this.registerEvent(document, false);
      return this.injectScriptToFrame(document, false);
    };

    MXCapture.prototype.touchStartHandler = function(ev) {
      var ctrlInfo, point;
      if (this.editParam.isFocused() && ev.target === this.editParam.ctrlHtml) {
        return;
      }
      if (this.editParam.isEditingText === true) {
        if (this.editParam.ctrlHtml !== ev.target) {
          this.endEditFlow(this.editParam.ctrlHtml);
          this.editParam.clearData();
        }
      }
      this.points.length = 0;
      point = new Point(ev.changedTouches[0], ev.timeStamp);
      this.correctPosition(ev.view, point);
      this.convertToPixel(point);
      this.points.push(point);
      ctrlInfo = recognizeControl(ev.target, this.targetName);
      if (ctrlInfo.type === 1) {
        this.editParam.setEditingMode(ev.target, ev.timeStamp);
      }
      PlatformUtility.startTouchAction(ctrlInfo.type);
    };

    MXCapture.prototype.endEditFlow = function(ctrlHtml) {
      var ctrlInfo, data, p, point, ret;
      ctrlInfo = recognizeControl(ctrlHtml, this.targetName);
      if (ctrlInfo) {
        p = {
          clientX: ctrlInfo.left + ((ctrlInfo.right - ctrlInfo.left) / 2),
          clientY: ctrlInfo.top + ((ctrlInfo.bottom - ctrlInfo.top) / 2)
        };
        point = new Point(p, Date.now());
        this.correctPosition(ctrlHtml.ownerDocument.defaultView, point);
        this.convertToPixel(point);
        this.points.push(point);
        data = MXCapture.composeCaptureData("onChanged", this.editParam.beginEditTimeStamp, ctrlInfo, this.points);
        ret = MXCapture.sendData(data);
      } else {
        console.log("Could not get data of '" + ctrlHtml + "', target = '" + this.targetName + "'");
      }
    };

    MXCapture.prototype.touchMoveHandler = function(ev) {};

    MXCapture.prototype.touchEndHandler = function(ev) {
      var ctrlInfo, data, point, ret;
      if (this.points.length < 1) {
        return;
      }
      point = new Point(ev.changedTouches[0], ev.timeStamp);
      this.correctPosition(ev.view, point);
      this.convertToPixel(point);
      this.points.push(point);
      if (point.isEqual(this.points[0])) {
        ctrlInfo = recognizeControl(ev.target, this.targetName);
        data = MXCapture.composeCaptureData("onTouched", ev.timeStamp, ctrlInfo, this.points);
        ret = MXCapture.sendData(data);
      } else {
        this.swipeDetect(point, ev.timeStamp, this.swipeCallback);
      }
      this.points.length = 0;
    };

    MXCapture.prototype.touchCancelHandler = function(ev) {
      this.points.length = 0;
    };

    MXCapture.prototype.scrollHandler = function(ev) {};

    MXCapture.prototype.onChangeHandler = function(ev) {
      var targetNode;
      targetNode = ev.target.nodeName.toLowerCase();
      if (targetNode !== "select") {
        if (this.editParam.isEditingText === true && ev.target === this.editParam.ctrlHtml) {
          if ((ev.timeStamp - this.inputTimeStamp) > 50) {
            this.endEditFlow(this.editParam.ctrlHtml);
          }
          this.editParam.clearData();
        }
        return;
      }
      this.endEditFlow(ev.target);
      this.editParam.clearData();
    };

    MXCapture.prototype.onInputHandler = function(ev) {
      var ctrlInfo;
      if (this.editParam.isFocused() === true) {
        this.editParam.isEditingText = true;
      } else {
        ctrlInfo = recognizeControl(ev.target, this.targetName);
        if (ctrlInfo.type === 1) {
          this.editParam.setEditingMode(ev.target, ev.timeStamp);
          this.editParam.isEditingText = true;
          this.inputTimeStamp = ev.timeStamp;
        }
      }
    };

    MXCapture.prototype.correctPosition = function(win, point) {
      var frame, rect;
      if (win) {
        frame = win.frameElement;
        while (frame) {
          rect = frame.getBoundingClientRect();
          point.clientX += rect.left;
          point.clientY += rect.top;
          win = win.frameElement.ownerDocument.defaultView || {};
          frame = win.frameElement;
        }
      }
    };

    MXCapture.prototype.convertToPixel = function(point) {
      var scale;
      if (PlatformUtility.getCurrentScale) {
        scale = PlatformUtility.getCurrentScale();
        point.clientX *= scale;
        point.clientY *= scale;
        point.pageX *= scale;
        point.pageY *= scale;
      }
    };

    MXCapture.prototype.detectTarget = function() {
      if (null === this.targetName) {
        if (top.dojo) {
          this.targetName = "dojo";
        } else if (top.$ && top.$.ui) {
          this.targetName = "jquery";
        } else if (top.Ext) {
          this.targetName = "sencha_touch";
        } else {
          this.targetName = "";
        }
        console.log("detectTarget = " + this.targetName);
      }
      return PlatformUtility.sendTarget(this.targetName);
    };

    MXCapture.prototype.swipeDetect = function(endPoint, eventTimeStamp, callback) {
      var allowedTime, distX, distY, restraint, swipeDirection, threadhold;
      if (this.points.length === 0) {
        return;
      }
      threadhold = 70;
      restraint = 100;
      allowedTime = 300;
      distX = endPoint.pageX - this.points[0].pageX;
      distY = endPoint.pageY - this.points[0].pageY;
      if ((Math.abs(distX) >= threadhold) && (Math.abs(distY) <= restraint)) {
        if (distX < 0) {
          swipeDirection = 'left';
        } else {
          swipeDirection = 'right';
        }
      } else {
        if ((Math.abs(distY) >= threadhold) && (Math.abs(distX) <= restraint)) {
          if (distY < 0) {
            swipeDirection = 'up';
          } else {
            swipeDirection = 'down';
          }
        }
      }
      if (callback) {
        callback(swipeDirection, eventTimeStamp);
      }
    };

    MXCapture.prototype.swipeCallback = function(strDirection, eventTimeStamp) {
      var data, info;
      info = {
        name: "swipe",
        value: strDirection
      };
      data = MXCapture.composeCaptureData("onMoved", eventTimeStamp, info, this.points);
      MXCapture.sendData(data);
      return console.log("Swipe to " + strDirection);
    };

    MXCapture.composeCaptureData = function(actName, timeStamp, info, pointList) {
      var data;
      return data = {
        action: actName,
        timeStamp: timeStamp,
        url: top.document.URL,
        title: top.document.title,
        extra: {
          name: info.name,
          value: info.value,
          ctrlType: info.type,
          response: info.response,
          defaultValue: info.defaultValue,
          points: pointList
        }
      };
    };

    return MXCapture;

  })();

  if (window === window.top && document.mxCapture === void 0) {
    document.mxCapture = document.mxCapture || new MXCapture;
    document.mxCapture.detectTarget();
    console.log("mxCapture is created! currentScale = " + (PlatformUtility.getCurrentScale()));
  }

}).call(this);
