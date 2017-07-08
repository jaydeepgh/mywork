/*
following section is for mareqee
Latest offer / declaration / news will scroll here.

*/
    var getMarquee = function (element)
    {
        var m = $('<marquee></marquee>');
        $.getJSON('../config/OtherText.json', function (data) {
            for (i = 0; i < data.length; i++)
            {
                if (data[i]["id"] == "topmarquee")
                {
                    $(m).text(data[i]["text"]);
                    break;
                }
            }
        });
        m.appendTo(element);
    };

    var getSliderImages = function (element)
    {
        var slides = [],
        slideNumber = 1;
        var numslides = 0;
        $.getJSON('../config/OtherText.json', function (data) {
            for (i = 0; i < data.length; i++) {
                if (data[i]["id"] == "NoOfSlide") {
                    //alert(data[i]["text"]);
                    numslides = parseInt(data[i]["text"]);
                    break;
                }
            }
        });
        
        setTimeout(function () {
            while (slideNumber <= numslides) {
                var slideimg = $('<li><img src="../Slider/img/pic-' + slideNumber + '.jpg" /></li>');
                slideimg.appendTo(element);
                slideNumber++;
            }
        }, 3000);


    }


/*
following section is for main panel
*/
    var getMainPanel = function(panelNo) {
        var caption = $('.mainCaption');
        var content = $('.mainContent');
        
        //alert(panelNo);
        $.getJSON("../config/MainPanel.json", function (data) {
            for (i = 0; i < data.length; i++)
            {                
                if (data[i]["page"] == panelNo)
                {
                    $(caption).text(data[i]["Caption"]);
                    $(content).text(data[i]["Content"])
                    break;
                }
            }
        });
        
    }

    var getPage = function (pageName)
    {
        pageName = pageName.replace(' ', '');
        $('#mainPanel').load('../html/' + pageName + '.html #container');
        setTimeout(getPageContent(pageName,1000));

    }

    var getPageContent = function (pageName)
    {
        $.getJSON('../config/Pages.json', function (data) {

            var pageElement = data[pageName]['elements'];
            setTimeout(function () {
                //alert(pageElement.length);
                for (i = 0; i < pageElement.length; i++) {
                    //alert(pageElement.length);
                    var elem = $('#' + pageElement[i]["id"]);
                    
                    //if (pageElement[i]["id"] == 'googleMap')
                       // alert(elem.attr('id'));
                    if (typeof elem != 'undefined') {

                        //alert(elem.attr('id').indexOf('map'));
                        if (elem.is('div')) {
                            //alert(elem.attr('id'));
                            if(elem.attr('id') === 'map1') {
                                //alert('I am here');
                                loadScript();
                            }
                            
                            else if(elem.attr('id') === 'map2') {
                                continue;
                                //loadScript1();
                            }
                            
                            else {
                               var html = $.parseHTML(pageElement[i]["text"]);
                                elem.append(html);
                            }
                            //$(elem).text(pageElement[i]["text"]);
                        }
                        else if (elem.is('img')) {
                            $(elem).attr('src', pageElement[i]["text"]);
                        }
                        else if (elem.is('script')) {
                            alert('script tag found');
                            $(elem).attr('src', pageElement[i]["text"]);
                        }
                        else
                        {
                            $(elem).text(pageElement[i]["text"]);
                        }
                    }
                }
            }, 1000);
            
        });

    }

    function loadScript()
    {
        //alert('here');
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLh7W95ZxfwQpUpbQy-IXv4BiMzHozdMM&callback=initMap';
        document.body.appendChild(script);


    }


/*get slider*/
    var getSlider = function () {
        $('#sliderContainer').load('../html/Slider.html #main');
//        setTimeout(getPageContent(pageName, 1000));

    }



/*
get footer
*/
    var getFooter = function ()
    {
        $.getJSON('../config/Footer.json', function (data) {

            //alert('<a href="' + links[i]["url"] + '" onclick="window.open(\'../html/Franchisee.html\');"></a>');
            //link section
            var con = $('#footer1');
            var br = $('<br />');
            var p = $('<p />');
            var cap = $('<div class="footer-caption"></div>');
            $(cap).text(data["Links"]["Caption"]);
            cap.appendTo(con);
            p.appendTo(con);
            var links = data["Links"]["href"];
            for (var i = 0; i < links.length; i++)
            {
                var ldiv = $('<div class="footerMainContent"></div>');
                var href = null;

                if(links[i]["text"] == 'Franchisee') {
                    href = $('<a href="' + links[i]["url"] + '" onclick="window.open(\'../html/Franchisee.html\');"></a>');
                } else {
                    href = $('<a href="' + links[i]["url"] + '" onclick="getPage(\'' + links[i]["text"] + '\');"></a>');
                }
                //href = $('<a href="' + links[i]["url"] + '" onclick="getPage(\'' + links[i]["text"] + '\');"></a>');

                $(href).text(links[i]["text"]);

                href.appendTo(ldiv);
                ldiv.appendTo(con);
                br.appendTo(con);
            }
            ////////////////////////////////////////////

            //services
            con = $('#footer2');
            p = $('<p />');
            cap = $('<div class="footer-caption"></div>');
            $(cap).text(data["Services"]["Caption"]);
            cap.appendTo(con);
            p.appendTo(con);
            var e = $('<div class="footerMainContent" id="event"></div');
            var htm = $.parseHTML(data["Services"]["text"]);
            e.append(htm);
            e.appendTo(con);


            //event
            con = $('#footer3');
            br = $('<br />');
            p = $('<p />');
            cap = $('<div class="footer-caption"></div>');
            $(cap).text(data["Events"]["Caption"]);
            cap.appendTo(con);
            p.appendTo(con);
            var e = $('<div class="footerMainContent" id="event"></div');
            $(e).text(data["Events"]["EventText"]);
            e.appendTo(con);

            //burnches
            con = $('#footer4');
            p = $('<p />');
            cap = $('<div class="footer-caption"></div>');
            $(cap).text(data["Branches"]["Caption"]);
            cap.appendTo(con);
            p.appendTo(con);
            var e = $('<div class="footerMainContent" id="event"></div');
            htm = $.parseHTML(data["Branches"]["text"]);
            e.append(htm);
            e.appendTo(con);


            //Gallary - no need
            /*
            con = $('#footer3');
            br = $('<br />');
            p = $('<p />');
            cap = $('<div class="header3"></div>');
            $(cap).text(data["Gallary"]["Caption"]);
            cap.appendTo(con);
            p.appendTo(con);
            var imgs = data["Gallary"]["Images"];
            for (var i = 0; i < imgs.length; i++) {
                var ldiv = $('<div class="gallaryImg"></div>');
                var img = $('<img class="thumbImage" src="' + imgs[i]["url"] + '" alt="' + imgs[i]["id"] + '"></a>');
                //$(href).text(links[i]["text"]);

                img.appendTo(ldiv);
                ldiv.appendTo(con);
                //br.appendTo(con);
            }*/
            
            //Social media
            /*
            con = $('#footer4');
            br = $('<br />');
            p = $('<p />');
            cap = $('<div class="header3"></div>');
            $(cap).text(data["SocialMedia"]["Caption"]);
            cap.appendTo(con);
            p.appendTo(con);
            var media = data["SocialMedia"]["Media"];
            for (var i = 0; i < media.length; i++) {
                var ldiv = $('<div class="mediaDiv"></div>');
                var a = $('<a href="' + media[i]["url"] + '"></a>');
                var l = $('<span></span>');
                $(l).text('  ' + media[i]["text"]);
                var img = $('<img class="mediaIcon" src="' + media[i]["icon"] + '" alt="' + media[i]["text"] + '"></a>');

                img.appendTo(a);
                l.appendTo(a);
                //$(a).text('&nbsp;&nbsp;' + media[i]["text"]);

                a.appendTo(ldiv);
                ldiv.appendTo(con);
                //br.appendTo(con);
            }
            */
        });


    }



/*
Following section is for menu generation
*/



    var dataUrl = "../config/Menu.json";
    var builddata = function () {
        var source = [];
        var items = [];
        // build hierarchical source.
        $.getJSON(dataUrl, function (data) {
            for (i = 0; i < data.length; i++) {
                var item = data[i];
                var label = item["text"];
                var parentid = item["parentid"];
                var id = item["id"];
                var target = item["target"];
                //alert(target);
                if (items[parentid]) {
                    var item = { parentid: parentid, label: label, item: item, id:id, target:target };
                    if (!items[parentid].items) {
                        items[parentid].items = [];
                    }
                    items[parentid].items[items[parentid].items.length] = item;
                    items[id] = item;
                }
                else {
                    items[id] = { parentid: parentid, label: label, item: item, id:id, target:target };
                    source[id] = items[id];
                }
            }
        });

        return source;
    }

    var buildUL = function (parent, items) {
        $.each(items, function () {
            if (this.label) {
                //var page = this.id;
                var page = this.label;
                var target = this.target;
                // create LI element and append it to the parent element.
                var li = $("<li></li>");
                var a = $("<a class='leftMenu' id='" + this.id + "' href='#pageCaption'>&nbsp;&nbsp;" + this.label + "</a>");
                $(a).click(function () {
                    //getMainPanel(page);
                    if (target == 'new')
                        window.open('../html/Franchisee.html');
                    else
                        getPage(page);
                    $('#mobile-nav').trigger('click');
                });
                a.appendTo(li);
                li.appendTo(parent);
                if (this.items && this.items.length > 0) {
                    var ul = $("<ul class='menu'></ul>");
                    ul.appendTo(li);
                    buildUL(ul, this.items);
                }
            }
        });
    }

