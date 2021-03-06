//Share Module
(function ($) {
    if( $(".page-actions").length > 0 ) {
        AddSocialButtonsToPage();
    }

    //Add Social Buttons Function
    function AddSocialButtonsToPage(){

        //Share Buttons Location
        $(".page-actions").html(""); //Clear any old html
        $(".page-actions").append($('<div/>').addClass("share-buttons"));
        var share = $('.share-buttons');
        $(share).hide()

        //Set Root URL
        var root_url = $("html").attr("data-root");
        if (root_url[root_url.length-1] == '/') root_url = root_url.substr(0,root_url.length-1);

        //Set Page ID
        var page_id = $("html").attr("id");

        //Set Buttons
        var share_buttons = {
            "pdf"   : false,
            "email": true,
            "print": false,
            "facebook": true,
            "twitter": true,
            "pinterest": true,
            "rss": false
        };

        // Django
        switch(page_id) {
            case "health_topic":
                share_buttons["print"] = true;
                share_buttons["rss"] = true;
                break;
            case "easy_to_read":
            case "lab_test":
            case "medmono":
            case "home-infusion":
            case "appendix":
            case "chemo":
            case "nmcd":
            case "article":
            case "carepoint":
            case "recipe":
                share_buttons["print"] = true;
                break;
			case "genetic_condition":
			case "gene":
			case "chromosome":
			case "understanding_genetics":
				share_buttons["pdf"] = true;
            case "whats_new":
                share_buttons["rss"] = true;
                break;
        }

        //Set Language
        var page_lang = $("html").attr("lang");

        //Set Title
        var page_title = $("title").text();
        if(page_title == undefined) { //Set Fallback Defaults
            page_title = "MedlinePlus";
        }

        //Set URL
        var page_url = $('link[rel="canonical"]').attr("href");
        if(page_url == undefined) { //Set Fallback Defaults
            page_url = "https://medlineplus.gov/";
            if(page_lang == 'es') {
                page_url = "https://medlineplus.gov/spanish/";
            }
        }

        //Email Share
        if(share_buttons["email"]) {
            //English
            var email_label = "Email this page to a friend";
            var email_body = "I found this information on MedlinePlus.gov and I'd like to share it with you:\n\n"
                + page_url + "?utm_source=email&utm_medium=share&utm_campaign=mplus_share"
                + "\n\nMedlinePlus (https://medlineplus.gov): Trusted Health Information for you"
                + "\n\nTo get updates by email when new information becomes available on MedlinePlus, "
                +"sign up at https://medlineplus.gov/listserv.html.";
            //Spanish
            if(page_lang == 'es') {
                email_label = "Enviar esta p??gina a un amigo";
                email_body = "Encontr?? esta informaci??n en MedlinePlus.gov/espanol y me gustar??a compartirla con usted:\n\n"
                    + page_url + "?utm_source=email&utm_medium=share&utm_campaign=mplus_share"
                    + "\n\nMedlinePlus en espa??ol (https://medlineplus.gov/espanol): Informaci??n de salud para usted"
                    + "\n\nPara recibir novedades por email cuando nueva informaci??n se encuentre disponible en MedlinePlus en espa??ol, "
                    +"suscr??base en https://medlineplus.gov/spanish/listserv.html";
            }
            email_url = 'mailto:?subject='+encodeURIComponent(page_title)+'&amp;body='+encodeURIComponent(email_body);
            //Create Email Button
            share.append(
                '<span>'
                +'<a target="EmailWin" class="email_icon" title="'+email_label+'" href="'+email_url+'">'
                +'<img alt="'+email_label+'" class="share-icon" src="'+root_url+'/images/i_share_email.png"/>'
                +'</a>'
                +'</span> '
            );
        }

        //Print Share
        if(share_buttons["print"]) {
            //English
            var print_label = "Print";
            //Spanish
            if(page_lang == 'es') {
                print_label = "Imprimir";
            }
            //Create Print Button
            share.append(
                '<span>'
                +'<a class="mplus_print" title="'+print_label+'" href="#">'
                +'<img alt="'+print_label+'" class="share-icon" src="'+root_url+'/images/i_share_print.png"/>'
                +'</a>'
                +'</span> '
            );
            //Print Event
            if(page_id == "health_topic") {
              var print_window_label = "Print Options";
              var print_close_label = "Close print options";
              var print_option_summary = "Topic Summary only";
              var print_option_full = "Full topic including all links";
              //Spanish
              if(page_lang == 'es') {
                print_window_label = "Opciones de impresi??n";
                print_close_label = "Cerrar opciones de impresi??n ";
                print_option_summary = "S??lo la introducci??n";
                print_option_full = "Toda la p??gina incluyendo enlaces";
              }
              $("body").append(
                '<div id="print-options" class="modal">'
                  +'<div class="modal-background"></div>'
                  +'<div class="modal-card">'
                    +'<header class="modal-card-head">'
                      +'<p class="modal-card-title">'+print_window_label+'</p>'
                      +'<button class="modal-close" role="button" title="'+print_close_label+'" aria-label="'+print_close_label+'"><span aria-hidden="true">X</span></button>'
                    +'</header>'
                    +'<section class="modal-card-body">'
                      +'<button id="print-summary-btn" role="button">'+print_option_summary+'</button>'
                      +'<button id="print-full-btn" role="button">'+print_option_full+'</button>'
                    +'</section>'
                  +'</div>'
                +'</div>'
              );
              var printmodal = $("#print-options");
              var printbutton = $(".mplus_print");
              function modalClose(button, modal) {
                  $('#mplus-wrap :focusable, #'+modal.attr('id')+' :focusable').removeAttr('tabindex');
                  $('[role="button"]').attr('tabindex', '0');
                  modal.hide()
                  $(button).focus();
              }
              function modalOpen(button, modal) {
                  modal.show();
                  $(".modal-background").click(function(e) {
                    modalClose(button, modal);
                  });
                  $(".modal-close").focus();
                  $('#'+modal.attr('id')+' :focusable').attr('tabindex', '1');
                  $('#mplus-wrap :focusable').attr('tabindex', '-1');
                  $( document ).on( 'keydown', function ( e ) {
                    if ( e.keyCode === 27 ) { // ESC
                      modalClose(button, modal);
                    }
                  });
              }

              $(".modal-close").click(function(e) {
                modalClose(printbutton, printmodal);
              });
              $("#print-summary-btn").click(function(e) {
                modalClose(printbutton, printmodal);
                // add class to hide all other links in print
                $("#mplus-content").addClass("print-summary-only");
                window.print();
                e.preventDefault();
              });
              $("#print-full-btn").click(function(e) {
                modalClose(printbutton, printmodal);
                //remove class to show all other links in print
                $("#mplus-content").removeClass("print-summary-only");
                window.print();
                e.preventDefault();
              });
              $(printbutton).click(function(e) {
                modalOpen(printbutton, printmodal);
              });
            }
            else {
              $( ".mplus_print" ).click(function(e) {
                  window.print();
                  e.preventDefault();
              });
            }

        }

        //Facebook Share
        if(share_buttons["facebook"]) {
            var facebook_label = "Facebook";
            //Create Facebook Button
            share.append(
                '<span>'
                +'<a class="share-facebook" title="'+facebook_label+'" href="#">'
                +'<img alt="'+facebook_label+'" class="share-icon" src="'+root_url+'/images/i_share_fb.png"/>'
                +'</a>'
                +'</span> '
            );
            //Facebook Event
            $(".share-facebook").click(function(event) {
                var appid = "1042245625821448";
                if (page_lang == "es") {
                    appid = "824697010995507";
                }
                var fb_url = "https://www.facebook.com/dialog/share?app_id="+encodeURIComponent(appid)+"&display=popup&href="
                    +encodeURIComponent(page_url+"?utm_source=facebook&utm_medium=share&utm_campaign=mplus_share");
                window.open(fb_url, 'sharer', 'top='+((screen.height / 2) - (400 / 2))+', left='+((screen.width / 2) - (600 / 2))
                    +', toolbar=0, status=0, width='+600+', height='+400);
                event.preventDefault();
            });
        }

        //Twitter Share
        if(share_buttons["twitter"]) {
            var twitter_label = "Twitter";
            //Create Twitter Button
            share.append(
                '<span>'
                +'<a class="share-twitter" title="'+twitter_label+'" href="#">'
                +'<img alt="'+twitter_label+'" class="share-icon" src="'+root_url+'/images/i_share_twitter.png"/>'
                +'</a>'
                +'</span> '
            );
            //Twitter Event
            $(".share-twitter").click(function(event) {
                var tw_url = "https://twitter.com/intent/tweet?text="+encodeURIComponent(page_title)+"&url="
                    +encodeURIComponent(page_url+"?utm_source=twitter&utm_medium=share&utm_campaign=mplus_share");
                window.open(tw_url, 'sharer', 'top='+((screen.height / 2) - (400 / 2))+', left='+((screen.width / 2) - (600 / 2))
                    +', toolbar=0, status=0, width='+600+', height='+400);
                event.preventDefault();
            });
        }

        //Pinterest Pin
        if(share_buttons["pinterest"]) {
            var pinterest_label = "Pinterest";
            var pinterest_img = $('meta[property="og:image"]').attr('content');
            if (pinterest_img == undefined) {
              if(page_lang == 'es') {
                pinterest_img = 'https://medlineplus.gov/images/mplus_fb_sp.png';
              }
              else {
                pinterest_img = 'https://medlineplus.gov/images/mplus_fb.png';
              }
            }
            //Create Pinterest Buttonbutton
            share.append(
                '<span>'
                +'<a class="share-pinterest" title="'+pinterest_label+'" href="#">'
                +'<img alt="'+pinterest_label+'" class="share-icon" src="'+root_url+'/images/i_share_pinterest.png"/>'
                +'</a>'
                +'</span> '
            );
            //PinterestEvent
            $(".share-pinterest").click(function(event) {
                var pin_url = "https://pinterest.com/pin/create/button/"
                  +"?url="+encodeURIComponent(page_url+"?utm_source=pinterest&utm_medium=share&utm_campaign=mplus_share")
                  +"&media="+encodeURIComponent(pinterest_img)
                  +"&description="+encodeURIComponent(page_title);
                window.open(pin_url, 'sharer', 'top='+((screen.height / 2) - (600 / 2))+', left='+((screen.width / 2) - (774 / 2))
                    +', toolbar=0, status=0, width='+774+', height='+600);
                event.preventDefault();
            });
        }

        //RSS Share
        if(share_buttons["rss"]){
            //English
            var rss_label = "Subscribe to RSS";
            //Spanish
            if(page_lang == 'es') {
                rss_label = "Suscr??base al RSS";
            }

            if (page_id === 'whats_new') {
                if (page_lang === 'es') {
                    var rss_url = 'https://medlineplus.gov/spanish/feeds/whatsnew.xml'
                } else {
                    var rss_url = 'https://medlineplus.gov/feeds/whatsnew.xml'
                }

            } else {
                var rss_url = $('link[type="application/rss+xml"]').attr("href");
            }

            //Create RSS Button
            if (rss_url != undefined) {
                share.append(
                    '<span>'
                    +'<a class="rss_feed_icon" title="'+rss_label+'" href="'+rss_url+'">'
                    +'<img class="share-icon" alt="'+rss_label+'" src="'+root_url+'/images/i_share_rss.png"/>'
                    +'</a>'
                    +'</span> '
                );
            }

        }
        //Pdf Share
        if(share_buttons["pdf"]) {
			var lang = $("html").attr("lang");
			var st = {
				'es':{'ghr':'genetica','download':'download/spanish/genetica','pdf_label':'Descargar PDF','uri':'genetica/entender/'},
				'en':{'ghr':'genetics','download':'download/genetics','pdf_label':'Download PDF','uri':'genetics/understanding/'}
				};
            //English
            var pdf_label = st[lang]['pdf_label'];
            var pdf_url = window.location.protocol+'//'+window.location.host+window.location.pathname;
            pdf_url = pdf_url.replace('index.html','');
			pdf_url = pdf_url.replace('/spanish/','/');
			var hmug = pdf_url.split(st[lang]['uri']);
			var name;
			if (1!=hmug.length) {
				var s1 = hmug.shift();
				hmug = hmug[0].split('/')[0];
				name = (''==hmug)?'primer.pdf':hmug + '.pdf';
				pdf_url = s1 + st[lang]['uri'] + name;
				pdf_url = pdf_url.replace(st[lang]['ghr'],st[lang]['download']);
			}
			else {							
				pdf_url = pdf_url.replace(st[lang]['ghr'],st[lang]['download']);
				if ('/'==pdf_url[pdf_url.length-1]) {
					pdf_url = pdf_url.slice(0,-1);
				}
				var arr = pdf_url.split('/');
				name = arr[arr.length-2];
				pdf_url = pdf_url + ".pdf";
			}
            //Create PDF Button
            share.append(
                '<span>'
                +'<a target="PDFWin" class="pdf_icon" title="'+pdf_label+'" href="'+pdf_url+'">'
                +'<img alt="'+pdf_label+'" class="share-icon" src="'+root_url+'/images/i_share_pdf.png"/>'
                +'</a>'
                +'</span> '
            );
        }
      $(share).show()
    }

})(jQuery);
