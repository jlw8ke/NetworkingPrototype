// Generated by CoffeeScript 1.7.1

getLocation = function (domNode) {
  var location, x, y , w, h;
  x =  y = w = h = 0;
  try {
    if (!domNode)
      return null;

    if (domNode === window || domNode === document)
      domNode = window.document.body;
	if (!domNode.getBoundingClientRect)
      return null;
    location = domNode.getBoundingClientRect();
    if (!location)
      return null;
    
    if (domNode === window.document.body)
    {
      h = window.innerHeight;//document.body.clientHeight;
      w  = window.innerWidth;//document.body.clientWidth;
    }
    else
    {
      x = location.left;
      y = location.top;
      h = location.height;
      w = location.width;
    }
    if (domNode.ownerDocument !== window.document)
    {
      for (var f = 0; f < window.frames.length; f++) {
        if (window.frames[f].window.document == domNode.ownerDocument) {
          var rctemp = window.frames[f].window.frameElement.getBoundingClientRect();
          var leftInt = (rctemp.left | 0);
          var topInt = (rctemp.top | 0);
          x += leftInt;
          y += topInt;
        }
      }
    }
  }
  catch (err) {
    console.log(err);
  }
  return {
    'left': x,
    'top': y,
    'right': x + w,
    'bottom': y + h
  };
},
recognizeControl = function (domNode, pageTarget) {
  checkOperator = function (domValue, mapValue, operator) {
    if (!domValue)
      return false;

    switch (operator) {
      case 1/*string equal*/: return domValue.toLowerCase() === mapValue.toLowerCase();
      case 2/*number equal*/: return Number(domValue) === Number(mapValue);
      case 3/*string contain*/: return (domValue.toLowerCase().indexOf(mapValue.toLowerCase()) >= 0);
      case 4/*number gt*/: return (Number(domValue) > Number(mapValue));
      case 5/*number lt*/: return (Number(domValue) < Number(mapValue));
      case 6/*string not equal*/: return domValue.toLowerCase() !== mapValue.toLowerCase();
      case 7/*string not contain*/: return (domValue.toLowerCase().indexOf(mapValue.toLowerCase()) < 0);
    }
    return false;
  },
  navigate = function (nav, domNode) {
  if (!domNode) return undefined;
  switch (nav) {
    case 1/*parent*/: return domNode.parentNode;
    case 2/*last*/: return domNode.lastChild;
    case 3/*first*/: return domNode.firstChild;
    case 4/*next*/: return domNode.nextSibling;
    case 5/*previous*/: return domNode.previousSibling;
    case 6/*next sibling*/: return domNode.nextElementSibling;
    case 7/*previous sibling*/: return domNode.previousElementSibling;
  }
  return undefined;
},
  getProperty = function (domNode, name) {
    try {
      if (name === "class") return domNode.className;
      else if (name === "tag") return domNode.nodeName;
      else if (name === "value") return domNode.value;
      else if (name === "innerText") return domNode.innerText;
      else return domNode.getAttribute(name);
    } catch (err) {
    }
    return "";
  },
     getDisplayText = function (domNode) {
        var szText = domNode.innerText;

        if (!szText && domNode.textContent)
            szText = domNode.textContent;

        if (!szText && domNode.innerHTML)
            szText = domNode.innerHTML;

        return szText;
    },
  getAutoCompleteListItemValue = function (domNode) {
    var navNode = domNode;

    while (navNode && navNode.nodeName != "DIV") {
      navNode = navNode.parentNode;
    }

    if (navNode)
      return navNode.innerText;

    return "";
  },
  isAutoCompleteControl = function (domNode) {
    var navNode = domNode;

    while (navNode && navNode.nodeName != "UL") {
      var szTag = navNode.nodeName;
      var szClass = navNode.className;

      if (szTag == "STRONG") {
        // do nothing
      }
      else if (szTag == "DIV") {
        if (szClass.search("sa_tm") < 0)
          return false;
      }
      else if (szTag == "LI") {
        if (szClass.search("sa_hd") < 0 && szClass.search("sa_sg") < 0)
          return false;
      }
      else
        return false;

      navNode = navNode.parentNode;
    }

    if (!navNode || navNode.nodeName != "UL" || navNode.id != "sa_ul")
      return false;

    navNode = navNode.parentNode;

    if (!navNode || navNode.nodeName != "DIV" || navNode.className != "sa_as")
      return false;

    navNode = navNode.parentNode;

    if (!navNode || navNode.nodeName != "DIV" || navNode.id != "sw_as")
      return false;

    return true;
  },
  isDojoTextEditor = function (domNode) {
    var doc = domNode.ownerDocument;
    var bodyElement = doc.body;
    var firstChild = bodyElement.firstChild;

    if (firstChild && firstChild.tagName === "DIV" && firstChild.id === "dijitEditorBody")
      return true;

    return false;
  },
  getDojoTextEditorValue = function (domNode) {
    var doc = domNode.ownerDocument;
    var bodyElement = doc.body;
    var firstChild = bodyElement.firstChild;
    if (firstChild){
      return firstChild.textContent;
    }
    return "";
  },
  isMatchProperties = function (properties, domNode) {
    if (!domNode || domNode.nodeType !== 1)
      return false;
    var length = properties.length;
    for (var i = 0; i < length; i++) {
      var name = properties[i].name,
          domValue = getProperty(domNode, name);

      if (checkOperator(domValue, properties[i].value, properties[i].operator) === false)
        return false;
    }
    return true;
  },
  isMatchElemnt = function (element, domNode) {
	    if (!domNode) return false;
	    var navNode = domNode;
	    if (element.navigates) {
	        var length = element.navigates.length;
	        for (var i = 0; i < length; i++) {
	            if (element.navigates[i].maxLoop) {
	                var maxLoop = element.navigates[i].maxLoop;
	                if (maxLoop > 0) {
	                    for (var j = 0; j < maxLoop; j++) {
	                        if (isMatchProperties(element.properties, navNode) === true)
	                            return true;

	                        navNode = navigate(element.navigates[i].navigate, navNode);
	                        if (!navNode)
	                            return false;
	                    }
	                    return false;
	                }
	                else {
	                    navNode = navigate(element.navigates[i].navigate, navNode);
	                }
	            }
	            else {
	                var loop = element.navigates[i].loop;

	                if (loop > 0) {
	                    for (var j = 0; j < loop; j++) {
	                        navNode = navigate(element.navigates[i].navigate, navNode);

	                        if (!navNode)
	                            return false;
	                    }
	                }
	            }
	        }
	    }
	    if (!navNode)
	        return false;

	    return isMatchProperties(element.properties, navNode);
	},
  isMatchCtrlMap = function (ctrlMap, domNode) {
    if (!domNode) return false;

    var length = ctrlMap.elements.length;
    for (var i = 0; i < length; i++) {
      if (isMatchElemnt(ctrlMap.elements[i], domNode) === false)
        return false;
    }
    return true;
  },
  getLeftLabel = function (domNode, ctrlType, bStopSearching) {
    var checkLeftLabel = function (navNode, loc) {
      if (!navNode)
        return false;

      if (navNode.childNodes.length > 1)
        return false;

      if (navNode.className == "jfk-bubble-content-id") {
        return false;
      }

      var nav = getLocation(navNode);
      if (!nav
    || nav.right - 3 > loc.left
    || nav.bottom < loc.top
    || nav.top > loc.bottom
    || (nav.bottom - nav.top) > 2 * (loc.bottom - loc.top)
    )
        return false;

      var type = recognizeStandardCtrl(navNode);

      if (type != 12/*text*/ && type != 15/*common*/ && type != 17/*controlunknown*/) {
        bStopSearching = true;
        return false;
      }

      return true;
    };

    loc = getLocation(domNode);
    height = loc.bottom - loc.top;
    var bStopSearching = false;

    for (var i = 1; i < 5 && !bStopSearching; i++) {
      for (var j = 0; j < height / 10 && !bStopSearching; j++) {
        var nav = document.elementFromPoint(loc.left - i * 10, loc.top + (j + 1) * 10);
        if (!checkLeftLabel(nav, loc, bStopSearching))
          continue;

        var label = getLabel(nav);
        if (label && label.trim() != "")
          return label;
      }
    }
    return null;
  },
  getTopLabel = function (domNode, ctrlType) {
    var checkTopLabel = function (navNode, loc, bStopSearching) {
      if (!navNode)
        return false;

      if (navNode.childNodes.length > 1)
        return false;

      var nav = getLocation(navNode);
      if (!nav
    || nav.bottom - 3 > loc.top
    || nav.right < loc.left
    || nav.left > loc.right
    || (nav.right - nav.left) > 2 * (loc.right - loc.left)
    || nav.bottom - nav.top > 50
            || nav.left + 50 < loc.left // too far on the left
  )
        return false;

      var type = recognizeStandardCtrl(navNode);

      if (type != 12/*text*/ && type != 15/*common*/ && type != 17/*controlunknown*/) {
        bStopSearching = true;
        return false;
      }

      return true;
    };

    var loc = getLocation(domNode);
    var width = loc.right - loc.left;
    var bStopSearching = false;

    for (var i = 1; i < 5 && !bStopSearching; i++) {
      for (var j = 0; j < width / 10 && !bStopSearching; j++) {
        var nav = document.elementFromPoint(loc.left + (j + 1) * 10, loc.top - i * 10);
        if (!checkTopLabel(nav, loc, bStopSearching))
          continue;

        var label = getLabel(nav);
        if (label && label.trim() != "")
          return label;
      }
    }
    return null;
  },
  getRightLabel = function (domNode, ctrlType) {
    var checkRightLabel = function (navNode, loc, bStopSearching) {
      if (!navNode)
        return false;

      if (navNode.childNodes.length > 1)
        return false;

      var nav = getLocation(navNode);
      if (!nav
    || nav.left + 3 < loc.right
    || nav.bottom < loc.top
    || nav.top > loc.bottom
    || (nav.bottom - nav.top) > 2 * (loc.bottom - loc.top)
  )
        return false;

      var type = recognizeStandardCtrl(navNode);

      if (type != 12/*text*/ && type != 15/*common*/ && type != 17/*controlunknown*/) {
        bStopSearching = true;
        return false;
      }

      return true;
    };
    loc = getLocation(domNode);
    var bStopSearching = false;

    for (var i = 1; i < 5 && !bStopSearching; i++) {
      var nav = document.elementFromPoint(loc.right + i * 10, loc.top + 5);
      if (!checkRightLabel(nav, loc, bStopSearching))
        continue;

      var label = getLabel(nav);
      if (label && label.trim() != "")
        return label;
    }
    return null;
  },
  getEditComBoLabel = function (domNode, ctrlType) {
    var label = getProperty(domNode, 'placeholder');
    if (label) return label;
    label = getLeftLabel(domNode, ctrlType);
    if (label) return label;

    label = getTopLabel(domNode, ctrlType);
    if (label) return label;

    return "";
  },
  getRadioCheckLabel = function (domNode, ctrlType) {
    getExplicitLabel = function (domNode) {
      var szLabel = domNode.innerText;

      if (!szLabel || szLabel.trim() == "") {
        if (domNode.id) {
          var parentNode = domNode.parentNode;

          for (var i = 0; i < parentNode.childNodes.length; i++) {
            var node = parentNode.childNodes[i];
            var szFor = getProperty(node, "for");

            if (szFor && szFor == domNode.id) {
              szLabel = getDisplayText(node);
              break;
            }
          }
        }
      }

      return szLabel;
    }

    var label = getExplicitLabel(domNode);
    if (label) return label;

    label = getRightLabel(domNode, ctrlType);
    if (label) return label;

    if (!domNode.nextElementSibling && domNode.nextSibling) {
      var nextSibling = domNode.nextSibling;

      if (nextSibling.nodeType && nextSibling.nodeType == "3" && nextSibling.nodeValue && nextSibling.nodeValue != "") {
        return nextSibling.nodeValue;
      }
    }

    label = getLeftLabel(domNode, ctrlType);
    if (label) return label;

    label = domNode.nextSibling.data;
    if (label) return label;

    return "";
  },
  getLabel = function (domNode, ctrlType) {
    var label = getProperty(domNode, 'aria-label');
    if (label) return label;

    var labelledby = getProperty(domNode, 'aria-labelledby');
    if (labelledby) {
      var labelNode = document.getElementById(labelledby);
      if (labelNode)
        label = labelNode.textContent;
      if (label)
        return label;
    }
    if (ctrlType === 13) // link
      label = getProperty(domNode, 'innerText');
    else
      label = getProperty(domNode, 'title');
    if (label) return label;

    var tagName = domNode.nodeName.toLowerCase();
    if (ctrlType === 0/*button*/) {
      if (tagName === 'input') {
        var type = getProperty(domNode, "type");
        if (type === 'file') {
			if (domNode.parentNode) {
				var label = getDisplayText(domNode.parentNode);
				if (label && label.trim() != "")
					return label;
	        }
            return 'Choose File';
	    }

        return domNode.value;
      }
    }
    label = domNode.textContent;

    //if (label && label.length === 1 && domNode.parentNode) {
    //    var parentLabel = domNode.parentNode.textContent;
    //    if (parentLabel.length > 1)
    //        label = parentLabel;
    //}

    if (label && label.length > 0)
      return label;

    return null;
  },
  getDefaultLabel = function (ctrlMap, domNode, ctrlType) {
    try {
      if (!domNode) return "";

      if (ctrlType === 1/*textbox*/ || ctrlType === 4/*combobox*/)
        return getEditComBoLabel(domNode, ctrlType);

      if (ctrlType === 2/*radio*/ || ctrlType === 3/*checkbox*/) {
        if (domNode.nodeName.toLowerCase() != "label")
          return getRadioCheckLabel(domNode, ctrlType);
        return domNode.innerText;
      }

      if (!ctrlMap) return getLabel(domNode, ctrlType);


      var eLength = ctrlMap.elements.length,
      label;
      for (var i = 0; i < eLength; i++) {
        var element = ctrlMap.elements[i];
        var navNode = domNode;
        if (element.navigates) {
          var nLength = element.navigates.length;
          for (var j = 0; j < nLength + 1; j++) {
            label = getLabel(navNode, ctrlType);
            if (label) return label;

            var maxLoop = element.navigates[j].maxLoop;
            if (maxLoop > 0) {
              for (var k = 0; k < maxLoop; k++) {
                navNode = navigate(element.navigates[j].navigate, navNode);
                if (!navNode)
                  break;
                label = getLabel(navNode, ctrlType);
                if (label) return label;
              }
            } else {
              navNode = navigate(element.navigates[j].navigate, navNode);
            }
          }
        }
        else {
          label = getLabel(navNode, ctrlType);
          if (label) return label;
        }
      }
      return "";
    } catch (err)
    { }
    return "";
  },
  getLabelByConfiguration = function (cfgLabel, domNode) {
	//console.log('get label by configuration');
    var label = "";
    if (cfgLabel.name) {
		var bTryNavigateAnyChild = false;
	        var navNode = domNode;

	        if (cfgLabel.navigates) {
	            var length = cfgLabel.navigates.length;

	            for (var i = 0; i < length; i++) {
	                var nav = cfgLabel.navigates[i];

	                for (var j = 0; j < nav.loop; j++) {
	                    navNode = navigate(nav.navigate, navNode);

	                    if (i == length - 1 && j == nav.loop - 1 && nav.navigate == 3)
	                        bTryNavigateAnyChild = true;
	                }
	            }
	        }

	        if (cfgLabel.properties) {
	            if (isMatchProperties(cfgLabel.properties, navNode) === true) {
	                label = getProperty(navNode, cfgLabel.name);
	            }
	            else {
	                if (bTryNavigateAnyChild == true) {
	                    navNode = navigate(6, navNode); /*next sibling*/

	                    while (navNode && isMatchProperties(cfgLabel.properties, navNode) === false) {
	                        navNode = navigate(6, navNode); /*next sibling*/
	                    }

	                    if (navNode)
	                        label = getProperty(navNode, cfgLabel.name);
	                }
	            }
	        }
	        else
	            label = getProperty(navNode, cfgLabel.name);

	        if (!label && navNode)
				label = getDisplayText(navNode);
	    }

	    return label;
	},
  getDefaultValue = function (ctrlMap, domNode, ctrlType) {
    try {
      if (ctrlType === 1/*textbox*/) {
        if (domNode.nodeName.toLowerCase() === 'input'
    && getProperty(domNode, 'type') === 'password'
  )
          return '********';

        if (domNode.value)
          return domNode.value;

        return domNode.textContent;
      }

      if (domNode.nodeName.toLowerCase() === 'select') {
        var index = domNode.selectedIndex;
        if (index >= 0) {
          return domNode.options[index].childNodes[0].nodeValue;
        }
      }

      if (ctrlType === 4/*combobox*/) {
        var nav = domNode;
        var value;
        for (var i = 0; i < 5 && nav; i++) {
          if (nav.nodeName.toLowerCase() === 'input')
            value = getProperty(nav, 'value');
          else
            value = nav.textContent;

          if (value) return value;
          nav = nav.parentNode;
        }
      }

      return "";
    }
    catch (err) { }
    return "";
  },
  getDefaultLocation = function (ctrlMap, domNode, ctrlType) {
    return getLocation(domNode);
  },
  recognizeStandardCtrl = function (domNode) {
    if (domNode.nodeName == "#document") {
      return 17; // unknown control
    }
    var role = getProperty(domNode, 'role');
    if (role) {
      role = role.toLowerCase();
      if (role === 'button') return 0/*button*/;
      if (role === 'spinbutton') return 0/*button*/;
      if (role === 'textbox') return 1/*textbox*/;
      if (role === 'radio') return 2/*radio*/;
      if (role === 'checkbox') return 3/*checkbox*/;
      if (role === 'combobox') return 4/*combobox*/;
      if (role === 'tree') return 5/*tree*/;
      if (role === 'list') return 6/*list*/;
      if (role === 'listitem') return 7/*listitem*/;
      if (role === 'treeitem') return 8/*treeitem*/;
      if (role === 'menuitem') return 9/*menuitem*/;
      if (role === 'menuitemcheckbox') return 9/*menuitem*/;
      if (role === 'menuitemradio') return 9/*menuitem*/;
      if (role === 'comboitem') return 10/*comboitem*/;
      if (role === 'option') return 10/*comboitem*/;
      if (role === 'tab') return 11/*tab*/;
      if (role === 'text') return 12/*text*/;
      if (role === 'link') return 13/*link*/;
      if (role === 'image') return 14/*image*/;
      if (role === 'common') return 15/*common*/;
      if (role === 'titlebar') return 16/*titlebar*/;
      if (role === 'controlunknown') return 17/*controlunknown*/;
    }
    var tagName = domNode.nodeName;
    if (tagName) {
      tagName = tagName.toLowerCase();
      if (tagName === 'input') {
        var type = getProperty(domNode, 'type');
        if (type) {
          type = type.toLowerCase();
          if (type === 'submit') return 0/*button*/;
          if (type === 'button') return 0/*button*/;
          if (type === 'file') return 0/*button*/;
          if (type === 'radio') return 2/*radio*/;
          if (type === 'checkbox') return 3/*checkbox*/;
        }
        /*default*/						return 1/*textbox*/;
      }
      if (tagName === 'textarea') return 1/*textbox*/;
      if (tagName === 'select') return 4/*combobox*/;
      if (tagName === 'option') {
        var multiple = getProperty(domNode.parentNode, 'multiple');
        if (multiple) return 7/*listitem*/;
        else return 10/*comboitem*/;
      }
      if (tagName === 'li') return 7/*listitem*/;
      if (tagName === 'a') return 13/*link*/;
      if (tagName === 'img') return 14/*image*/;
      if (tagName === 'button') return 0/*button*/;
    }
    return 17/*controlunknown*/;
  },
  specialCase = function (domNode, ctrlMap, ctrlType, ctrlName, ctrlValue, l, t, r, b) {
    try {
      var clazz = getProperty(domNode, 'class');
      //console.log(clazz);
      if ((clazz.search('checkbox lg-sprite checked') >= 0 || clazz.search('checkbox lg-sprite') >= 0)) {
        ctrlName = domNode.nextSibling.textContent;
        if (ctrlName)
          ctrlType = 3;
      }
      else if (clazz === 'dijitReset dijitInputInner') {
        var hiddenInput = domNode.nextSibling.nextSibling;
        if (getProperty(hiddenInput, 'tag').toLowerCase() === 'input'
            && getProperty(hiddenInput, 'type').toLowerCase() === 'hidden'
            ) {
          ctrlValue = getProperty(hiddenInput, 'value');
        }
      } else if (clazz.search('dijitAccordionTitle') >= 0) {
        var accordionName = domNode.textContent.trim();
        if (accordionName.indexOf('+-') >= 0) {
          ctrlName = accordionName.substring(3, accordionName.length).trim();
        }
      } else if (clazz === 'dijitInline dijitArrowNode') {
        var parentNode = domNode.parentNode;
        if (parentNode && getProperty(parentNode, 'class') === 'dijitTitlePaneTitleFocus' && getProperty(parentNode, 'role') === 'button')
          ctrlName = parentNode.innerText;
      } else if (clazz.search('dijitTitlePaneTitle') >= 0) {
        var childNode = domNode.firstElementChild;
        if (childNode && getProperty(childNode, 'class') === 'dijitTitlePaneTitleFocus' && getProperty(childNode, 'role') === 'button') {
          ctrlType = 0;
          ctrlName = childNode.innerText;
        }
      } else if (clazz === 'dijitReset dijitInline dijitArrowButtonInner') {
        ctrlName = domNode.textContent;
      } else if (clazz === 'dijit dijitReset dijitInline dijitDropDownButton'
          || clazz === 'dijitReset dijitInline dijitButtonNode'
          || clazz === 'dijitReset dijitInline dijitButtonText'
          || clazz === 'dijitReset dijitStretch dijitButtonContents dijitDownArrowButton') {
        var currentMonthLabel = domNode.getElementsByClassName('dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel');
        if (currentMonthLabel) {
          ctrlName = currentMonthLabel[0].textContent;
        }
      } else if (clazz === 'dijitInline dijitIcon dijitMenuExpand') {
        ctrlName = domNode.parentNode.parentNode.parentNode.textContent.trim();
        ctrlName = ctrlName.substring(0, ctrlName.length - 3).trim();
      } else if (clazz === 'dijitReset dijitMenuArrowCell' && ctrlName === '+') {
        ctrlName = domNode.parentNode.textContent.trim();
        ctrlName = ctrlName.substring(0, ctrlName.length - 3).trim();
      } else if (clazz === 'dijitReset dijitCalendarArrow dijitCalendarArrowHover') {
        ctrlName = '';
      } else if (ctrlName.length == 0 && getProperty(domNode, 'tag').toLowerCase() === 'span') {
        var next = domNode.nextSibling;
        if (next
            && getProperty(next, 'tag')
            && getProperty(next, 'tag').toLowerCase() === 'span'
            && next.textContent
            && next.textContent.length == 1
            ) {
          ctrlName = domNode.parentNode.textContent;
        }
        else {
          var pre = domNode.previousSibling;
          if (pre
              && getProperty(pre, 'tag').toLowerCase() === 'span'
              && pre.textContent.length == 1
          ) {
            ctrlName = domNode.parentNode.textContent;
          }
        }
      } else if (getProperty(domNode, 'tag').toLowerCase() === 'fieldset'
          && ctrlType === 17/*controlunknown*/
          ) {
        ctrlName = '';
      }
        /* PhuTa update*/
      else if (getProperty(domNode, 'tag').toLowerCase() === 'div' && ctrlType === 1 /*textbox control*/) {
        ctrlValue = domNode.innerText;
      }
        /*~PhuTa update*/
        // ThanhTran added to support textbox has autocomlete feature
      else if (isAutoCompleteControl(domNode)) {
        ctrlType = 7;
        ctrlName = getAutoCompleteListItemValue(domNode);
        var rc = getLocation(domNode);

        if (rc) {
          l = rc.left;
          t = rc.top;
          r = rc.right;
          b = rc.bottom;
        }
      }
      else if (isDojoTextEditor(domNode)) {
        ctrlType = 1;
        ctrlName = "";
        ctrlValue = getDojoTextEditorValue(domNode);
        var rc = getLocation(domNode.ownerDocument);

        if (rc) {
          l = rc.left;
          t = rc.top;
          r = rc.right;
          b = rc.bottom;
        }
      }
      else if (clazz === "placeholder-text") {
        var preNode = domNode.previousElementSibling;

        if (preNode && preNode.nodeName.toLowerCase() === "input") {
          ctrlType = 1/*textbox*/;
          ctrlName = getEditComBoLabel(preNode, ctrlType);

          var rc = getLocation(preNode);

          if (rc) {
            l = rc.left;
            t = rc.top;
            r = rc.right;
            b = rc.bottom;
          }
        }
      }
      else if (domNode.nodeName == "LABEL" && domNode.control) {
        ctrlType = recognizeStandardCtrl(domNode.control);
      }
      else if (ctrlType == 14) { // image control
        if (!ctrlName)
          ctrlName = getProperty(domNode, 'alt');

        var parentNode = domNode.parentNode;
        if (parentNode && parentNode.nodeName === 'LI')
          ctrlType = 7;
      }
    } catch (err) { }

    if (ctrlName) {
      ctrlName = ctrlName.trim();
      var index = ctrlName.search(/(\r\n|\n|\r)/g);
      if (index > 0)
        ctrlName = ctrlName.substring(0, index);

      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = ctrlName;
      ctrlName = tempDiv.textContent;
    }
    return {
      'left': l,
      'top': t,
      'right': r,
      'bottom': b,
      'type': ctrlType,
      'name': ctrlName,
      'value': ctrlValue
    };
  };

  if (!domNode) return null;
  
  var ctrlMap = null;
  var index = -1;

  // use the ownerDocument.defaultView to get correct window in case of multiple frames (if any)
  //if (domNode.ownerDocument && domNode.ownerDocument.defaultView) 
  {
    var listCtrlMap = null;
    switch (pageTarget) {
      case "dojo":
        listCtrlMap = ctrlMaps_DOJO;
        break;
      case "jquery":
        listCtrlMap = ctrlMaps_JQUERY;
        break;
      case "sencha_touch":
        listCtrlMap = ctrlMaps_SenchaTouch;
        break;
    }
      
    //console.log ("pageTarget " + pageTarget);
    if (listCtrlMap) {
      var length = listCtrlMap.length;

      for (var i = 0; i < length; i++) {
        if (isMatchCtrlMap(listCtrlMap[i], domNode) === true) {
          ctrlMap = listCtrlMap[i];
          index = i;
          console.log('found at ' + i);
          break;
        }
      }
    }
  }

  var ctrlType;
  if (ctrlMap)
    ctrlType = ctrlMap.ctrlType;
  else {
    var navNode = domNode;
    for (var j = 0; j < 3 && navNode; j++) {
      ctrlType = recognizeStandardCtrl(navNode);
      if (ctrlType !== 17/*controlunknown*/) {
        break;
      }
      navNode = navNode.parentNode;

    }
  }

  var name;
  if (ctrlMap) {
    if (domNode.id != 'dijit_Editor_0_iframe' && domNode.class != 'dijitEditorIFrame') {
      if (ctrlMap.label)
        name = getLabelByConfiguration(ctrlMap.label, domNode);
      else
        name = getDefaultLabel(ctrlMap, domNode, ctrlType);
    }
  }
  else {
    var labelNode = domNode;
    for (var k = 0; k < 3 && labelNode; k++) {
      name = getDefaultLabel(null, labelNode, ctrlType);
      if (name || ctrlType === 0/*button*/)
        break;

      labelNode = labelNode.parentNode;

      if (!labelNode || labelNode.childNodes.length > 1)
        break
    }
  }
  if (!name)
    name = "";


  var value = getDefaultValue(ctrlMap, domNode, ctrlType);
  if (!value) value = '';


  var location = getDefaultLocation(ctrlMap, domNode, ctrlType);
  //console.log('ctrlType: ' + ctrlType + ' | name: ' + name + ' | Value: ' + value + ' | ctrlMap: ' + index);
  return specialCase(domNode, ctrlMap, ctrlType, name, value, location.left, location.top, location.right, location.bottom);
};;

