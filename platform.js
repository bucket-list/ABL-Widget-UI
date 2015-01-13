'use strict';
/*globals document, console, XMLHttpRequest*/
// var server = "https://js.ablsolution.com";
var server = "http://162.242.170.162";
//var server = "http://localhost:54100";

(function(global) {
    var serverHost = '<%= serverHost %>';
    var api_key = '<%= api_key %>';
   
    var useIframe = <%= useIframe %>;

    init();
    injectStyles();

    function init() {
        var ablWidgets = document.querySelectorAll('.abl-widget');
        for (var i = 0; i < 1; ++i) {
            var ablWidget = ablWidgets[i];
            processablWidget(ablWidget);
        }
    }
// ablWidgets.length
    function processablWidget(ablWidget) {
        var id = ablWidget.getAttribute('data-abl-id');
        //console.log(ablWidget);
        var key = location.search.split("api_key=")[1];//ablWidget.getAttribute('data-api-key');
        // console.log(key);
        var processed = ablWidget.getAttribute('data-abl-processed');

        if (!id || processed === 'done') {
            //skip this one as it has either already been processed, or lacks an ID
            //This is done to ensure logic is not executed twice in the event that the
            //user erroneously embeds the script tag more than once on a single page
            console.log('skipping element:', ablWidget);
            return;
        }
        createablWidget(ablWidget, id, key);
    }

    function createablWidget(ablWidget, id, key) {
        <% if (useIframe) { %>
            var iframe = document.createElement('iframe');
            //iframe.setAttribute('src', server+'/api/3rd/abl-ui/widget/'+id+'/init?iframe=true&api_key='+api_key);
            iframe.setAttribute('src', server+'/iframe/widget/'+id+'/init?iframe=true&api_key='+api_key);
            iframe.setAttribute('class', 'abl-widget');
            iframe.setAttribute('data-abl-id', id);
            //iframe.setAttribute('data-api-key', key);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            iframe.style.border = 'none';
            iframe.style.height = '650px';
            iframe.style.width = '750px';
            iframe.style.position = 'relative';
            iframe.style.overflow = 'hidden';
            ablWidget.appendChild(iframe);
            ablWidget.setAttribute('data-abl-processed', 'done');
        <% } else { %>
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                ablWidget.innerHTML = this.responseText;
                ablWidget.setAttribute('data-abl-processed', 'done');

                var ablWidgetButton = ablWidget.querySelector('.bar-button');
                if (!ablWidgetButton) {
                    return;
                }
                var ablWidgetButtonFunction = function() {
                    //TODO disable the button temporarily to prevent accidental double-click
                    var barXhr = new XMLHttpRequest();
                    barXhr.onload = function() {
                        var result = JSON.parse(this.responseText);
                        console.log(result);
                        var barPara = ablWidget.querySelector('.bar');
                        if (barPara) {
                            barPara.innerHTML = JSON.stringify(result);
                        }
                    };
                    barXhr.open('POST', server+'/api/3rd/abl-ui/widget/'+id+'/bar?api_key='+api_key);
                    var content = {
                        ablId: id,
                    };
                    content = JSON.stringify(content);
                    barXhr.setRequestHeader('Content-type', 'application/json');
                    barXhr.send(content);
                };
                if (ablWidgetButton.addEventListener) {
                    ablWidgetButton.addEventListener('click', ablWidgetButtonFunction);
                }
                else if (ablWidgetButton.attachEvent) {
                    ablWidgetButton.attachEvent('onclick', ablWidgetButtonFunction);
                }
                else {
                    ablWidgetButton.onclick = ablWidgetButtonFunction;
                }
            };
            xhr.open("GET", server+'/api/3rd/abl-ui/widget/'+id+'/init?api_key='+api_key);
            xhr.send();
        <% } %>
    }

    //See http://css-tricks.com/snippets/javascript/inject-new-css-rules
    function injectStyles() {
        var css = '<%= inlineCss %>';
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        var head = document.head || document.querySelector('head');
        head.appendChild(style);
    }
}());
