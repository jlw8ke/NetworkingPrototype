class PlatformUtility

  @sendTarget : (targetName) ->
    try
      if top.qNative
        top.qNative.sendTarget(targetName);  
    catch error
      console.log error
  @sendData : (jsonString) ->
    if top.qNative
      top.qNative.sendData jsonString
    else
      console.log "sendData error, native bridge is #{top.qNative}"
  
  @startTouchAction : (ctrlType) =>
  	top.qNative.startTouchAction(ctrlType) if top.qNative
  	return
  @getCurrentScale : () =>
    return (top.document.documentElement.clientWidth / top.innerWidth) #/ 2
  
  top.PlatformUtility = PlatformUtility
