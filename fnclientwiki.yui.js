var fnServerPath="../";var fnServerFotonotesScript="fotonotes.php";var fnServer=fnServerPath+fnServerFotonotesScript;var fnXMLHTTP=true;if(!window.FN_ADD){var FN_ADD="allow"}if(!window.FN_MODIFY){var FN_MODIFY="allow"}if(!window.FN_DELETE){var FN_DELETE="allow"}var FN_CREDITS="Fotonotes DHTML Viewer\n\n(c) 2004-2005 Angus Turnbull, http://www.twinhelix.com\n\nProvided under license to Fotonotes LLC";var FN_DISALLOWED="Sorry, that action is not permitted.\n\nPlease login under a different account.";var FN_POST_UNSUPPORTED="Sorry, your browser does not support editing notes.";var FN_DELETE_CONFIRM="Are you sure you want to delete this note?";var FN_SAVE_WAIT="Loading Fotonotes...";var FN_SAVE_FAIL="An error occurred, and your changes could not be saved.";var FN_SAVE_FAIL_JPEG_NOT_WRITABLE="JPEG file is not writable. Please check file permissions on server.";var FN_SAVE_SUCCESS="Changes saved!";var fnDebugMode=false;var fnHideTimer=null;var fnActiveNote=null;var fnActionVerb="";var fnActionTrigger=null;var fnEditingData=null;var fnAnnotateAll=false;var fnMinImgWidth=200;var fnMinImgHeight=150;var imageFileSrc="src";var fnInputFieldID="notesField";var fnOuterTag="";var fnDefaultImgID="fn-default";var fnNotesDivSuffix="-notes";var aeOL=[];function addEvent(G,H,F,C){var B="addEventListener",E="on"+H,A="",D="";if(G[B]&&!C){return G[B](H,F,false)}G._c|=0;if(G[E]){A="_f"+G._c++;G[A]=G[E]}D="_f"+G._c++;G[D]=F;G[E]=function(J){J=J||window.event;var I=true;if(A){I=G[A](J)!=false&&I}I=G[D](J)!=false&&I;return I};aeOL[aeOL.length]={o:G,h:E}}addEvent(window,"unload",function(){for(var A=0;A<aeOL.length;A++){aeOL[A].o[aeOL[A].h]=null;for(var B=0;aeOL[A].o["_f"+B];B++){aeOL[A].o["_f"+B]=null}}});function cancelEvent(A,B){A.returnValue=false;if(A.preventDefault){A.preventDefault()}if(B){A.cancelBubble=true;if(A.stopPropagation){A.stopPropagation()}}}addLoadEvent(findImage);function addLoadEvent(A){var B=window.onload;if(typeof window.onload!="function"){window.onload=A}else{window.onload=function(){B();A()}}}function findImage(){for(var B=0;B<document.images.length;B++){if(fnDebugMode){alert("img "+document.images[B].className)}if((/fn-image/.test(document.images[B].className))||(document.images[B].parentNode.id=="file")||(document.images[B].parentNode.tagName=="A"&&document.images[B].parentNode.parentNode.id=="file")||((fnAnnotateAll)&&(document.images[B].width>=fnMinImgWidth)&&(document.images[B].height>=fnMinImgHeight))){var A=document.images[B];if(fnDebugMode){alert("imgObj.src: "+A.src)}var C;if(imageFileSrc=="id"){C=A.id}else{C=A.src}if(fnDebugMode){alert("revised imageFile: \n\n"+C)}if(A.parentNode.tagName=="A"){A.parentNode.parentNode.replaceChild(A,A.parentNode)}createFNImage(A,C)}}}function createFNImage(A,B){getFNDiv(A,B)}function getFNDiv(E,Q){var O=/fn-editable/.test(E.className);var F=(E.id?E.id:fnDefaultImgID)+fnNotesDivSuffix;var U=document.getElementById(F);if(U){var K=U.getElementsByTagName("span")}var C=U&&K.length>0;if(!O&&!C){return }var M=document.createElement("div");M.className="fn-canvas fn-container-active";M.style.width=E.width+"px";M.style.height=(E.height+20)+"px";var S=document.createElement("div");S.className="fn-container fn-container-active";S.style.width=E.width+"px";S.style.height=E.height+"px";S.style.top="20px";S.style.left="0";M.appendChild(S);E.parentNode.insertBefore(M,E);E.parentNode.removeChild(E);S.appendChild(E);var A=document.createElement("div");A.className="fn-controlbar fn-controlbar-active";A.innerHTML='<span class="fn-controlbar-credits"></span>'+(O?'<span class="fn-controlbar-del-inactive"></span><span class="fn-controlbar-edit-inactive"></span><span class="fn-controlbar-add-inactive"></span>':'<span class="fn-controlbar-toggle-inactive"></span>');S.appendChild(A);if(O){var J=document.createElement("form");J.className="fn-editbar fn-editbar-inactive";J.name="fn_editbar";J.id="fn_editbar";J.innerHTML='<div class="fn-editbar-fields"><p>TITLE:</p><input type="input" class="fn-editbar-title" name="fnTitle" value="" /></div><div class="fn-editbar-fields"><p>CONTENT:</p><textarea class="fn-editbar-content" name="fnContent"></textarea></div><div class="fn-editbar-fields"><span class="fn-editbar-ok"></span><span class="fn-editbar-cancel"></span></div>';S.appendChild(J)}if(U){var R=U.title.split(":");var B=document.createElement("span");B.className="fn-scalefactor";var G=E.width/R[1];B.title=G;S.appendChild(B);for(var T=0;T<K.length;T++){var D=parseInt(K[T].style.left);var L=parseInt(K[T].style.top);var V=parseInt(K[T].style.right);var I=parseInt(K[T].style.bottom);var P=K[T].innerHTML;P=P.replace(/\n/g,"<br>");var N=D+"-"+L+"-"+V+"-"+I;var H=document.createElement("div");H.className="fn-area";H.style.left=Math.round(D*G)+"px";H.style.top=Math.round(L*G)+"px";H.style.width=Math.round((V-D)*G)+"px";H.style.height=Math.round((I-L)*G)+"px";H.innerHTML='<div class="fn-note"><span class="fn-note-title">'+K[T].title+'</span><span class="fn-note-content">'+P+'</span><span class="fn-note-id" title="'+N+'"></span></div><div class="fn-area-innerborder-left"></div><div class="fn-area-innerborder-right"></div><div class="fn-area-innerborder-top"></div><div class="fn-area-innerborder-bottom"></div>';S.appendChild(H)}}}function DragResize(B,A){var C={myName:B,enabled:true,handles:["tl","tm","tr","ml","mr","bl","bm","br"],isElement:null,isHandle:null,element:null,dragging:null,minWidth:10,minHeight:10,minLeft:0,maxRight:9999,minTop:0,maxBottom:9999,zIndex:1,mouseX:0,mouseY:0,lastMouseX:0,lastMouseY:0,mOffX:0,mOffY:0,elmX:0,elmY:0,elmW:0,elmH:0,allowBlur:true,ondragfocus:null,ondragstart:null,ondragmove:null,ondragend:null,ondragblur:null};for(var D in C){this[D]=(typeof A[D]=="undefined")?C[D]:A[D]}}DragResize.prototype.apply=function(A){var B=this;addEvent(A,"mousedown",function(C){B.mouseDown(C)});addEvent(A,"mousemove",function(C){B.mouseMove(C)});addEvent(A,"mouseup",function(C){B.mouseUp(C)})};DragResize.prototype.handleSet=function(elm,show){with(this){var h;if(!elm._handle_tr){for(h=0;h<handles.length;h++){var hDiv=document.createElement("div");hDiv.className=myName+" "+myName+"-"+handles[h];elm["_handle_"+handles[h]]=elm.appendChild(hDiv)}}for(h=0;h<handles.length;h++){elm["_handle_"+handles[h]].style.visibility=show?"inherit":"hidden"}}};DragResize.prototype.select=function(newElement){with(this){if(!document.getElementById||!enabled){return }if(newElement&&(newElement!=element)&&enabled){element=newElement;element.style.zIndex=++zIndex;handleSet(element,true);elmX=parseInt(element.style.left);elmY=parseInt(element.style.top);elmW=element.offsetWidth;elmH=element.offsetHeight;if(ondragfocus){this.ondragfocus()}}}};DragResize.prototype.deselect=function(keepHandles){with(this){if(!document.getElementById||!enabled){return }if(!keepHandles){if(ondragblur){this.ondragblur()}handleSet(element,false);element=null}dragging=null;mOffX=0;mOffY=0}};DragResize.prototype.mouseDown=function(e){with(this){if(!document.getElementById||!enabled){return true}var elm=e.target||e.srcElement,newElement=null,newHandle=null,hRE=new RegExp(myName+"-([trmbl]{2})","");while(elm){if(elm.className){if(!newHandle&&(hRE.test(elm.className)||isHandle(elm))){newHandle=elm}if(isElement(elm)){newElement=elm;break}}elm=elm.parentNode}if(element&&(element!=newElement)&&allowBlur){deselect(false)}if(newElement&&(!element||(newElement==element))){cancelEvent(e);select(newElement,newHandle);dragging=newHandle;if(dragging&&ondragstart){this.ondragstart()}}}};DragResize.prototype.mouseMove=function(e){with(this){if(!document.getElementById||!enabled){return true}mouseX=e.pageX||e.clientX+document.documentElement.scrollLeft;mouseY=e.pageY||e.clientY+document.documentElement.scrollTop;var diffX=mouseX-lastMouseX+mOffX;var diffY=mouseY-lastMouseY+mOffY;mOffX=mOffY=0;lastMouseX=mouseX;lastMouseY=mouseY;if(!dragging){return true}var hClass=dragging&&dragging.className&&dragging.className.match(new RegExp(myName+"-([tmblr]{2})"))?RegExp.$1:"";var rs=0,dY=diffY,dX=diffX;if(hClass.indexOf("t")>=0){rs=1;if(elmH-dY<minHeight){mOffY=(dY-(diffY=elmH-minHeight))}else{if(elmY+dY<minTop){mOffY=(dY-(diffY=minTop-elmY))}}elmY+=diffY;elmH-=diffY}if(hClass.indexOf("b")>=0){rs=1;if(elmH+dY<minHeight){mOffY=(dY-(diffY=minHeight-elmH))}else{if(elmY+elmH+dY>maxBottom){mOffY=(dY-(diffY=maxBottom-elmY-elmH))}}elmH+=diffY}if(hClass.indexOf("l")>=0){rs=1;if(elmW-dX<minWidth){mOffX=(dX-(diffX=elmW-minWidth))}else{if(elmX+dX<minLeft){mOffX=(dX-(diffX=minLeft-elmX))}}elmX+=diffX;elmW-=diffX}if(hClass.indexOf("r")>=0){rs=1;if(elmW+dX<minWidth){mOffX=(dX-(diffX=minWidth-elmW))}else{if(elmX+elmW+dX>maxRight){mOffX=(dX-(diffX=maxRight-elmX-elmW))}}elmW+=diffX}if(dragging&&!rs){if(elmX+dX<minLeft){mOffX=(dX-(diffX=minLeft-elmX))}else{if(elmX+elmW+dX>maxRight){mOffX=(dX-(diffX=maxRight-elmX-elmW))}}if(elmY+dY<minTop){mOffY=(dY-(diffY=minTop-elmY))}else{if(elmY+elmH+dY>maxBottom){mOffY=(dY-(diffY=maxBottom-elmY-elmH))}}elmX+=diffX;elmY+=diffY}with(element.style){left=elmX+"px";width=elmW+"px";top=elmY+"px";height=elmH+"px"}var oDF;if(window.opera&&document.documentElement){oDF=document.getElementById("op-drag-fix");if(!oDF){oDF=document.createElement("input");oDF.id="op-drag-fix";oDF.style.display="none";document.body.appendChild(oDF)}oDF.focus()}if(ondragmove){this.ondragmove()}cancelEvent(e)}};DragResize.prototype.mouseUp=function(e){with(this){if(!document.getElementById||!enabled){return }if(ondragend){this.ondragend()}deselect(true)}};var _f_idcount=1;function fnElementFade(elm,show){var speed=show?20:10;elm._f_count|=0;elm._f_timer|=null;clearTimeout(elm._f_timer);if(show&&!elm._f_count){elm.style.visibility="inherit"}elm._f_count=Math.max(0,Math.min(100,elm._f_count+speed*(show?1:-1)));var f=elm.filters,done=(elm._f_count==100);if(f){if(!done&&elm.style.filter.indexOf("alpha")==-1){elm.style.filter+=" alpha(opacity="+elm._f_count+")"}else{if(f.length&&f.alpha){with(f.alpha){if(done){enabled=false}else{opacity=elm._f_count;enabled=true}}}}}else{elm.style.opacity=elm.style.MozOpacity=elm._f_count/100.1}if(!show&&!elm._f_count){elm.style.visibility="hidden"}if(elm._f_count%100){elm._f_timer=setTimeout(function(){fnElementFade(elm,show)},50)}}function fnClassSet(B,A){B.className=B.className.replace((A?(/-inactive/):(/-active/)),(A?"-active":"-inactive"))}function fnGetContainer(B){var A=B;while(A){if((/fn-container/).test(A.className)){break}A=A.parentNode}return A}function fnGetControlBar(A){var C=null;for(var B=0;B<A.childNodes.length;B++){if((/fn-controlbar/).test(A.childNodes.item(B).className)){C=A.childNodes.item(B);break}}return C}function fnContainerSet(A,D){var C=fnGetControlBar(A);for(var B=0;B<C.childNodes.length;B++){if((/fn-controlbar-toggle/).test(C.childNodes.item(B).className)){fnClassSet(C.childNodes.item(B),!D);break}}fnClassSet(A,D)}function fnAction(B,A){if(fnActionVerb!=B){if(fnActionTrigger&&fnActionVerb){fnClassSet(fnActionTrigger,false)}fnActionVerb=B;fnActionTrigger=A;if(A){fnClassSet(A,true)}}else{fnActionVerb="";if(A){fnClassSet(A,false)}}}function fnMouseOverOutHandler(A,E){var D=A.target||A.srcElement;if(D.nodeType!=1){D=D.parentNode}while(D&&!((D.className||"").indexOf("fn-container")>-1)){if(D&&((D.className||"").indexOf("fn-area")>-1)&&!fnActionVerb){var C=D;var B=C.firstChild;while(B&&B.nodeType!=1){B=B.nextSibling}if(!B){return }clearTimeout(fnHideTimer);if(E){if(fnActiveNote&&(B!=fnActiveNote)){fnElementFade(fnActiveNote,false)}fnElementFade(B,true);if(fnActiveNote){fnActiveNote.parentNode.style.zIndex=1}B.parentNode.style.zIndex=2;fnActiveNote=B}else{fnHideTimer=setTimeout("if (fnActiveNote) { fnElementFade(fnActiveNote, false); fnActiveNote = null }",200)}}D=D.parentNode}}function fnClickHandler(B){var F=B.target||B.srcElement;if(F.nodeType!=1){F=F.parentNode}while(F&&!((F.className||"").indexOf("fn-container")>-1)){if((/fn-editbar-ok/).test(F.className)){return fnEditButtonHandler(true)}if((/fn-editbar-cancel/).test(F.className)){return fnEditButtonHandler(false)}if(fnEditingData){return }if((/fn-area/).test(F.className)){var E=F;if(fnActionVerb=="del"){fnDelNote(E)}if(fnActionVerb=="edit"){var D=E.firstChild;while(D&&D.nodeType!=1){D=D.nextSibling}if(D){fnEditNote(D)}}return }var C;if((/fn-controlbar-logo/).test(F.className)){C=((/fn-controlbar-active/).test(F.parentNode.className));fnClassSet(F.parentNode,!C);return }if((/fn-controlbar-credits/).test(F.className)){alert(FN_CREDITS);return }if((/fn-controlbar-del/).test(F.className)){if(!fnXMLHTTP){return alert(FN_POST_UNSUPPORTED)}if(FN_DELETE=="deny"){return alert(FN_DISALLOWED)}return fnAction("del",F)}if((/fn-controlbar-edit/).test(F.className)){if(!fnXMLHTTP){return alert(FN_POST_UNSUPPORTED)}if(FN_MODIFY=="deny"){return alert(FN_DISALLOWED)}return fnAction("edit",F)}if((/fn-controlbar-add/).test(F.className)){if(!fnXMLHTTP){return alert(FN_POST_UNSUPPORTED)}if(FN_ADD=="deny"){return alert(FN_DISALLOWED)}return fnAddNote(F)}if((/fn-controlbar-toggle/).test(F.className)){var A=fnGetContainer(F);if(A){C=((/fn-container-active/).test(A.className));fnContainerSet(A,!C)}}F=F.parentNode}}function fnEditUISet(show){if(!fnEditingData){return }with(fnEditingData){if(show){dragresize.select(area,area)}else{dragresize.deselect()}area.className=show?"fn-area-editing":"fn-area";fnElementFade(form,show);fnClassSet(form,show);fnContainerSet(container,!show);fnClassSet(fnGetControlBar(container),!show)}}function fnAddNote(D){var B=fnGetContainer(D);if(!B){return }fnAction("add",D);var I=document.createElement("div");I.className="fn-area";I.style.left=(Math.round(B.offsetWidth/2)-25)+"px";I.style.top=(Math.round(B.offsetHeight/2)-25)+"px";I.style.width="50px";I.style.height="50px";I.id="fn-area-new";var E=document.createElement("div");E.className="fn-note";I.appendChild(E);var A=document.createElement("span");A.className="fn-note-title";E.appendChild(A);var J=document.createElement("span");J.className="fn-note-content";E.appendChild(J);var F=document.createElement("span");F.className="fn-note-author";E.appendChild(F);var G=document.createElement("span");G.className="fn-note-userid";E.appendChild(G);var H=document.createElement("span");H.className="fn-note-id";H.title="";E.appendChild(H);var C;C=document.createElement("div");C.className="fn-area-innerborder-right";I.appendChild(C);C=document.createElement("div");C.className="fn-area-innerborder-left";I.appendChild(C);C=document.createElement("div");C.className="fn-area-innerborder-top";I.appendChild(C);C=document.createElement("div");C.className="fn-area-innerborder-bottom";I.appendChild(C);B.appendChild(I);fnEditingData={area:I,note:E};fnEditNote()}function fnEditNote(K){var B=null;if(K){B=K.parentNode;fnEditingData={area:B,note:K}}else{B=fnEditingData.area;K=fnEditingData.note}var A=fnGetContainer(B);if(!A){return }var C=A.getElementsByTagName("form");if(!C){return }C=C.item(0);var N="",E="",J="",G="";var I=B.getElementsByTagName("span");for(var D=0;D<I.length;D++){var L=I.item(D);if(L.className=="fn-note-id"){G=L.getAttribute("title")}if(L.className=="fn-note-title"){N=L.innerHTML}if(L.className=="fn-note-author"){E=L.innerHTML}if(L.className=="fn-note-content"){J=L.innerHTML}}fnEditingData.container=A;fnEditingData.form=C;fnEditingData.noteID=G;fnEditingData.oldTitle=N;fnEditingData.oldAuthor=E;fnEditingData.oldContent=J;fnEditingData.oldLeft=parseInt(B.style.left);fnEditingData.oldTop=parseInt(B.style.top);fnEditingData.oldWidth=B.offsetWidth;fnEditingData.oldHeight=B.offsetHeight;fnEditingData.newTitle=fnEditingData.newAuthor=fnEditingData.newContent="";fnEditingData.newLeft=fnEditingData.newTop=0;fnEditingData.newWidth=fnEditingData.newHeight=0;var H=C.getElementsByTagName("input");for(var F=0;F<H.length;F++){if((/title/).test(H[F].className)){H[F].value=fnUnescapeHTML(N)}if((/author/).test(H[F].className)){H[F].value=fnUnescapeHTML(E)}}var M=C.getElementsByTagName("textarea");if(M&&(/content/).test(M.item(0).className)){M.item(0).value=fnUnescapeHTML(J)}fnEditUISet(true)}function fnEscapeHTML(A){return A.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function fnUnescapeHTML(A){return A.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&amp;/g,"&")}function fnEditButtonHandler(ok){if(!fnEditingData){return }with(fnEditingData){if(ok){newTitle=newAuthor=newUserid=newEntryid=newContent=newBorderColor="";var inputs=form.getElementsByTagName("input");for(var i=0;i<inputs.length;i++){if((/title/).test(inputs[i].className)){newTitle=inputs[i].value}if((/author/).test(inputs[i].className)){newAuthor=inputs[i].value}if((/userid/).test(inputs[i].className)){newUserid=inputs[i].value}if((/entry_id/).test(inputs[i].className)){newEntryid=inputs[i].value}if((/border_color/).test(inputs[i].className)){newBorderColor=inputs[i].value}}var textarea=form.getElementsByTagName("textarea");if(textarea&&(/content/).test(textarea.item(0).className)){newContent=textarea.item(0).value}newLeft=parseInt(area.style.left);newTop=parseInt(area.style.top);newWidth=parseInt(area.style.width);newHeight=parseInt(area.style.height);if(fnDebugMode){alert("Begin server save operation newBorderColor: "+newBorderColor)}var sFact=1;for(var n=0;n<container.childNodes.length;n++){if((/fn-scalefactor/).test(container.childNodes.item(n).className)){sFact=parseFloat(container.childNodes.item(n).getAttribute("title"))}}fnSaveUpdate(noteID,parseInt(newLeft/sFact),parseInt(newTop/sFact),parseInt((newLeft+newWidth)/sFact),parseInt((newTop+newHeight)/sFact),newTitle,newContent)}else{if(fnActionVerb=="add"){area.parentNode.removeChild(area)}else{area.style.left=oldLeft+"px";area.style.top=oldTop+"px";area.style.width=oldWidth+"px";area.style.height=oldHeight+"px"}fnEditUISet(false);fnAction("",null);fnEditingData=null}}}function fnDelNote(C){var B="",A=C.getElementsByTagName("span");for(var D=0;D<A.length;D++){if(A.item(D).className=="fn-note-id"){B=A.item(D).getAttribute("title")}}if(!B){alert(FN_SAVE_FAIL)}if(B&&confirm(FN_DELETE_CONFIRM)){fnEditingData={area:C,note:null,container:fnGetContainer(C)};fnSaveDel(B)}else{fnAction("",null)}}function fnGetNoteRegex(A){var C=A.split("-");var B='<note\\s+left="'+C[0]+'"\\s+top="'+C[1]+'"\\s+right="'+C[2]+'"\\s+bottom="'+C[3]+'"[^<]*</note>';return new RegExp(B)}function fnSaveUpdate(noteID,left,top,right,bottom,title,content){var inputField=document.getElementById(fnInputFieldID);var newNote='<note left="'+left+'" top="'+top+'" right="'+right+'" bottom="'+bottom+'" title="'+fnEscapeHTML(title)+'">'+fnEscapeHTML(content)+"</note>";var noteRegex;if(noteID){noteRegex=fnGetNoteRegex(noteID);inputField.value=inputField.value.replace(noteRegex,newNote)}else{if(fnOuterTag){var pos=inputField.value.indexOf("</"+fnOuterTag+">");if(pos<0){inputField.value+="<"+fnOuterTag+">\n"+newNote+"\n</"+fnOuterTag+">"}else{inputField.value=inputField.value.substring(0,pos)+newNote+"\n"+inputField.value.substring(pos)}}else{if(inputField.value){inputField.value+="\n"}inputField.value+=newNote}}with(fnEditingData){for(var n=0;n<note.childNodes.length;n++){var field=note.childNodes.item(n);if(field.className=="fn-note-title"){field.innerHTML=fnEscapeHTML(newTitle)}if(field.className=="fn-note-author"){field.innerHTML=newAuthor}if(field.className=="fn-note-content"){field.innerHTML=fnEscapeHTML(newContent)}if(field.className=="fn-note-id"){field.title=left+"-"+top+"-"+right+"-"+bottom}}fnEditUISet(false)}fnAction("",null);fnEditingData=null}function fnSaveDel(noteID){var inputField=document.getElementById(fnInputFieldID);var noteRegex=fnGetNoteRegex(noteID);inputField.value=inputField.value.replace(noteRegex,"");with(fnEditingData){area.parentNode.removeChild(area)}fnEditingData=null;fnAction("",null)}if(document.getElementById){var dragresize=new DragResize("dragresize",{allowBlur:false});dragresize.isElement=function(B){if(!(/(add|edit)/).test(fnActionVerb)){return false}if((/fn-area-editing/).test(B.className)){var A=fnGetContainer(B);this.maxRight=A.offsetWidth-2;this.maxBottom=A.offsetHeight-2;return true}};dragresize.isHandle=function(A){if(!(/(add|edit)/).test(fnActionVerb)){return false}if((/fn-area-editing/).test(A.className)){return true}};dragresize.ondragfocus=function(){this.element.style.cursor="move"};dragresize.ondragblur=function(){this.element.style.cursor="default"};dragresize.apply(document);addEvent(document,"mouseover",new Function("e","fnMouseOverOutHandler(e, 1)"));addEvent(document,"mouseout",new Function("e","fnMouseOverOutHandler(e, 0)"));if(document.createElement&&document.documentElement){addEvent(document,"click",fnClickHandler)}}