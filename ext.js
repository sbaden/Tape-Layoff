function onLoaded() {
    var csInterface = new CSInterface();	    
    var appName = csInterface.hostEnvironment.appName;
    
    if(appName != "FLPR"){ loadJSX(); }
	
    presetMenu();  // Load dropdown menu
	
    var appNames = ["PPRO"];
    for (var i = 0; i < appNames.length; i++) {
        var name = appNames[i];
        if (appName.indexOf(name) >= 0) {
           var btn = document.getElementById("btn_" + name);
           if (btn)
                btn.disabled = false;
        }
    }
    

    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
	
    // Update the color of the panel when the theme color of the product changed.
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);

    csInterface.addEventListener("com.adobe.csxs.events.TapeLayoffRenderEvent", function(event){
        alert(event.data);
    });
}



// Update the theme with the AppSkinInfo retrieved from the host product.
function updateThemeWithAppSkinInfo(appSkinInfo) {
	
    //Update the background color of the panel

    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBackgroundColor);
        
    var styleId = "ppstyle";
    
    var gradientBg          = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 40) + " , " + toHex(panelBackgroundColor, 10) + ");";
    var gradientDisabledBg  = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 15) + " , " + toHex(panelBackgroundColor, 5) + ");";
    var boxShadow           = "-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);";
    var boxActiveShadow     = "-webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);";
	    
    var isPanelThemeLight   = panelBackgroundColor.red > 73; // choose your own sweet spot
	    
	    var fontColor, disabledFontColor;
	    var borderColor;
	    var inputBackgroundColor;
	    var gradientHighlightBg;

	    if(isPanelThemeLight) {
	    	fontColor = "#000000;";
	    	disabledFontColor = "color:" + toHex(panelBackgroundColor, -70) + ";";
	    	borderColor = "border-color: " + toHex(panelBackgroundColor, -90) + ";";
	    	inputBackgroundColor = toHex(panelBackgroundColor, 54) + ";";
	    	gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -40) + " , " + toHex(panelBackgroundColor,-50) + ");";
	    } else {
	    	fontColor = "#ffffff;";
	    	disabledFontColor = "color:" + toHex(panelBackgroundColor, 100) + ";";
	    	borderColor = "border-color: " + toHex(panelBackgroundColor, -45) + ";";
	    	inputBackgroundColor = toHex(panelBackgroundColor, -20) + ";";
	    	gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -20) + " , " + toHex(panelBackgroundColor, -30) + ");";
	    }
	
	    //Update the default text style with pp values
	    
	    addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + fontColor + "; background-color:" + toHex(panelBackgroundColor) + ";");
	    addRule(styleId, "button, select, input[type=text], input[type=button], input[type=submit]", borderColor);    
        addRule(styleId, "p", "color:" + fontColor + ";");    
        addRule(styleId, "button", "font-family: " + appSkinInfo.baseFontFamily + ", Arial, sans-serif;");    
        addRule(styleId, "button", "color:" + fontColor + ";");    
        addRule(styleId, "button", "font-size:" + (1.2 * appSkinInfo.baseFontSize) + "px;");    
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", gradientBg);    
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", boxShadow);
	    addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", gradientHighlightBg);
	    addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", boxActiveShadow);
	    addRule(styleId, "[disabled]", gradientDisabledBg);
	    addRule(styleId, "[disabled]", disabledFontColor);
	    addRule(styleId, "input[type=text]", "padding:1px 3px;");
	    addRule(styleId, "input[type=text]", "background-color: " + inputBackgroundColor) + ";";
	    addRule(styleId, "input[type=text]:focus", "background-color: #ffffff;");
	    addRule(styleId, "input[type=text]:focus", "color: #000000;");
	    
}

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);
    
    if (stylesheet) {
        stylesheet = stylesheet.sheet;
           if( stylesheet.addRule ){
               stylesheet.addRule(selector, rule);
           } else if( stylesheet.insertRule ){
               stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
           }
    }
}


function reverseColor(color, delta) {
    return toHex({red:Math.abs(255-color.red), green:Math.abs(255-color.green), blue:Math.abs(255-color.blue)}, delta);
}



function toHex(color, delta) {  //Convert the Color object to string in hexadecimal format;
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = computedValue.toString(16);
        return computedValue.length == 1 ? "0" + computedValue : computedValue;
    }

    var hex = "";
    if (color) {
        with (color) {
             hex = computeValue(red, delta) + computeValue(green, delta) + computeValue(blue, delta);
        };
    }
    return "#" + hex;
}

function onAppThemeColorChanged(event) {
    // Should get a latest HostEnvironment object from application.
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    // Gets the style information such as color info from the skinInfo, 
    // and redraw all UI controls of your extension according to the style info.
    updateThemeWithAppSkinInfo(skinInfo);
} 


function presetMenu() {  // Get presets from local directory
	var csInterface = new CSInterface();
	csInterface.evalScript('$._ext_tapeLayoff.getPresets()', myPresetFunction);  
}

function myPresetFunction (presetArray) {  // Add Presets as selections to dropdown menu 
	presetArray2 = presetArray.split(",");
	var sel = document.getElementById('presetList');
	for(i=0; i < presetArray2.length; i++) {			
		var opt = document.createElement('option');
		opt.value = presetArray2[i];
		opt.innerHTML = presetArray2[i];
		sel.add(opt);
	}   
}

//document.getElementById("btn_selectClipFolder").addEventListener("click", folderSelect);

function folderSelect(){
	var csInterface = new CSInterface();
	csInterface.evalScript('$._ext_tapeLayoff.getFolder()', myFolderFunction);
}

var clipFolder;
function myFolderFunction(clipLocation){
	clipFolder = clipLocation;
}

function stageProject(){
	//var dropNonDrop = document.getElementsByName('dropNonDrop');
	//var hasXFrame = document.getElementById('hasXFrame').value;
	//alert(dropNonDrop);
	//alert(hasXFframe);
	var csInterface = new CSInterface();
	csInterface.evalScript('$._ext_tapeLayoff.projectStaging("'+clipFolder+'")');	
}

    
/**
 * Load JSX file into the scripting context of the product. All the jsx files in 
 * folder [ExtensionRoot]/jsx will be loaded. 
 */
function loadJSX() {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$._ext.evalFiles("' + extensionRoot + '")');
}

function evalScript(script, callback) {
    new CSInterface().evalScript(script, callback);
}

function onClickButton(ppid) {
    if(ppid == "FLPR"){
    	var jsfl = 'fl.createDocument(); fl.getDocumentDOM().addNewText({left:100, top:100, right:300, bottom:300} , "Hello Flash!" ); ';
    	evalScript(jsfl);
    } else {
    	var extScript = "$._ext_" + ppid + ".run()";
		evalScript(extScript);
	}
}
