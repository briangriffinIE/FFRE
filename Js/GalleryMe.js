/*!
 * jQuery GalleryMee - CSS3 transitions and transformations
 * (c) 2014 Si Nguyen <nguyensi.art@gmail.com>
 * MIT Licensed.
 *
 * http://singuyen.me
 */

$.fn.galleryMee = function() {

    var _this = this;
    var curThumbSlide = 0;
    var curIndex = 0;

    var large = [];   
    var thumbs = [];
    var totalThumbs;
    var thumbs_per_page;
    var maxLoad = 20;
    var is_mobile = false;
    var recheck;

    var myGallery = {
        init: function(eles,curImg) {

            /* Measure and initialise gallery's dimension */
            var winWidth = $(window).width();
            var winHeight = $(window).height();
            var isPortrait = (winWidth < winHeight) ? true : false;
            thumbs_per_page = 3;
            var thumbWidth = Math.floor(winWidth / thumbs_per_page);
            var thumbHeight = Math.floor(thumbWidth / 2);

            var largeWidth = winWidth;
            var largeHeight = Math.floor(largeWidth / 2);
            totalThumbs = eles.length;
            var thumbsHtml = '';

            var thumbActive = '';

            /* Build HTML */
            for (var i = 0; i < eles.length; i++) {
                    var src_thumb = $(eles[i]).find('img').attr('src');
                    var src_large = $(eles[i]).attr('href'); 
                    thumbs[i] = myGallery.helpers.betterImg(src_thumb,thumbWidth,thumbHeight,'thumb');
                    large[i] = myGallery.helpers.betterImg(src_large,largeWidth,largeHeight,'large');

                if (curImg == src_large) {
                    curImg = '<img src="' + large[i] + '" style=""/>';
                    curIndex = i;
                    thumbActive = 'img-active';
                } else {
                    thumbActive = '';
                }
                    thumbsHtml += '<div class="thumb-item thumb-' + i +'" data-id="' + i + '">\
                                    <div class="img-top ' + thumbActive + '"></div>\
                                    <img src="' + thumbs[i] + '" style=""/>\
                                    </div>';
            }

            var galleryHtml = '<div id="gallery-popup">\
                                    <div class="gallery-img">' + curImg + '\
                                    </div>\
                                    <div id="gallery-thumbs" style="width: ' + winWidth + 'px; height: ' + thumbHeight + 'px">\
                                        <div class="arrow-left gallery-nav"><i class="fa fa-angle-left"></i></div>\
                                        <div class="arrow-right gallery-nav"><i class="fa fa-angle-right"></i></div>\
                                        <div class="thumbs-wrapper" style="">' + thumbsHtml + '</div>\
                                        <div class="indicator">' + (parseInt(curIndex) + 1) + '/' + totalThumbs + '</div>\
                                    </div>\
                                    <div class="nav-left large-nav"><i class="fa fa-angle-left"></i></div>\
                                    <div class="nav-right large-nav"><i class="fa fa-angle-right"></i></div>\
                                    <div class="close-btn">Close</div>\
                                </div>';


            $('#gallery-popup').fadeIn(); 
            $('body').append(galleryHtml);

            $('body').css({'overflow':'hidden', 'position':'fixed'});
            if (is_mobile) {
                $('#gallery-thumbs').css({'overflow-x': 'scroll', 'overflow-y': 'hidden', '-webkit-overflow-scrolling': 'touch'});
            }

            myGallery.helpers.resizeThumb();
            myGallery.helpers.resizeLarge();

            $('.thumb-item').on('click', function(){
                var id = $(this).attr('data-id');
                myGallery.nav.goto(id);
            });

            $('.large-nav').on('click', function(){
                if ($(this).hasClass('nav-left')) {
                    myGallery.nav.prev();
                } else {
                    myGallery.nav.next();
                }
            });

            /* Navigation */
            $('.gallery-nav').on('click', function(){ 
                if ($(this).hasClass('arrow-left')) {
                    myGallery.thumbs.prevSlide();
                } else {
                    myGallery.thumbs.nextSlide();
                }
            });

            $('#gallery-popup .close-btn').on('click', function(){
                $('body,html').css({'overflow':'','position':''});
                $('#gallery-popup').fadeOut(400,function(){
                    $(this).remove();
                });
            });
        },

        thumbs: {
            nextSlide: function(){
                var galleryWidth = $('.thumbs-wrapper').width();
                var winWidth = $(window).width();
                var numpage = galleryWidth / winWidth;
                if (curThumbSlide < numpage-1) {
                    curThumbSlide++;  
                    $('.thumbs-wrapper').transit({'x': curThumbSlide * winWidth * -1});
                } else {
                    var myPos = curThumbSlide * winWidth * -1;
                    $('.thumbs-wrapper').transit({'x': myPos - 40},function(){
                        $(this).transit({'x': myPos})
                    });
                }

            },
            prevSlide: function(){
                var winWidth = $(window).width();

                if (curThumbSlide > 0) {
                    curThumbSlide--; 
                    $('.thumbs-wrapper').transit({'x': curThumbSlide * winWidth * -1});            
                } else {
                    var myPos = curThumbSlide * winWidth * -1;
                    $('.thumbs-wrapper').transit({'x': myPos + 40},function(){
                        $(this).transit({'x': myPos})
                    });
                }
            },
            correctSlide: function(curIndex){
                var galleryWidth = $('.thumbs-wrapper').width();
                var winWidth = $(window).width();
                var numpage = galleryWidth / winWidth;    
                var mySlide = (curIndex - (curIndex % thumbs_per_page)) / thumbs_per_page; 
                var myPos = mySlide * winWidth * -1;
                if (mySlide != curThumbSlide && !is_mobile) {
                    $('.thumbs-wrapper').transit({'x': myPos});
                    curThumbSlide = mySlide;
                }
            }
        },

        nav: {
            next: function() {
                curIndex++;
                if (curIndex > totalThumbs - 1) {
                    curIndex = 0;
                }
                myGallery.nav.goto(curIndex);
            },
            prev: function() {
                curIndex--;
                if (curIndex < 0) {
                    curIndex = totalThumbs - 1;
                }
                myGallery.nav.goto(curIndex);
            },
            goto: function(id) {
                curIndex = id;
                var galleryImg = $('#gallery-popup .gallery-img');

                galleryImg.empty().append('<div class="spinner"></div>');

                var index = parseInt(curIndex) + 1;
                var largeImg = '<img src="' + large[id] + '" style="display: none;"/>';
                $('.thumb-item').find('.img-top').removeClass('img-active');
                $('#gallery-thumbs .thumb-' + id + ' .img-top').addClass('img-active');
                $('#gallery-popup .indicator').text(index + '/' + totalThumbs);

                myGallery.helpers.detectImg(large[id], function(){
                    galleryImg.empty().append(largeImg);
                    galleryImg.find('img').fadeIn();
                    myGallery.thumbs.correctSlide(id);
                    myGallery.helpers.resizeLarge();    
                }); 

            }
        },

        helpers: {
            resizeLarge: function(){ //Fit the large picture
                if ($('#gallery-popup').get(0)) {
                var winWidth = $(window).width();
                var winHeight = $(window).height();
                var isPortrait = (winWidth < winHeight) ? true : false;
                var GLB_height = 0;

                var thumbHeight = $('#gallery-thumbs').find('img').height();
                var thumbWidth = thumbHeight * 2;

                var largeHeight = 0;
                var largeTop = 0;
                var largeLeft = 0;
                var largeStyle = {};
                var mode = '';

                if (isPortrait) {
                    var largeHeight = Math.floor(winWidth / 2);
                    var largeWidth = winWidth;        
                    largeTop = (winHeight - thumbHeight - largeHeight + GLB_height) / 2;
                    largeStyle = {'top': largeTop + 'px', 'width': '100%', 'height': 'auto', 'left': 0};
                    mode = largeStyle;
                } else {
                    var largeHeight = winHeight - thumbHeight - GLB_height;
                    var largeWidth = largeHeight * 2; 
                    largeLeft = (winWidth - largeWidth) / 2;
                    largeStyle = {'left': largeLeft + 'px', 'height': largeHeight + 'px', 'width': largeWidth + 'px', 'top':  GLB_height + 'px'};
                    mode = largeStyle;


                    if (winWidth/(winHeight - GLB_height - thumbHeight) < 2) {
                        var largeTop = ((winHeight - (winWidth / 2) - thumbHeight) / 2 ) + GLB_height / 2;
                        largeStyle = {'left': 0, 'width': '100%', 'height': 'auto', 'top':  largeTop + 'px'};
                        mode = largeStyle;
                    } 
                }

                    $('#gallery-popup').find('.gallery-img').find('img').css(largeStyle)
                    $('#gallery-popup .large-nav i').css({'margin-top': (winHeight - thumbHeight)/2 })
                    if (!is_mobile) {
                        myGallery.thumbs.correctSlide(curIndex);
                    }
                } else {
                    console.log('Empty');
                }
            },
            resizeThumb: function(){ //Fit the thumbs
                var winWidth = $(window).width();
                var winHeight = $(window).height();
                var totalThumbs = $('#gallery-thumbs .thumbs-wrapper img').length;
                if (winWidth < 450) {
                    thumbs_per_page = 3;
                } else if (winWidth >= 450 && winWidth < 980) {
                    thumbs_per_page = 4;
                } else {
                    thumbs_per_page = 6;
                }

                var thumbWidth = Math.floor(winWidth / thumbs_per_page);
                var thumbHeight = Math.floor(thumbWidth / 2);
                var thumbDesk = {'width': totalThumbs * thumbWidth + 'px', 'height': thumbHeight + 'px'};
 
                var thumbStyle = {'width': thumbWidth + 'px', 'height': thumbHeight + 'px'};
                $('#gallery-thumbs').find('img').each(function(){
                    $(this).css(thumbStyle);
                });
                $('#gallery-thumbs').css({'width': '100%', 'height': thumbHeight + 'px'});
                var iconHeight = $('#gallery-thumbs i').height();
                $('#gallery-thumbs i').css({'margin-top': thumbHeight/2 - iconHeight/2});

                if (is_mobile) {
                    $('#gallery-thumbs').css({'overflow-x': 'scroll', 'overflow-y': 'hidden', '-webkit-overflow-scrolling': 'touch'});
                    $('.gallery-nav').hide();
                }

                $('#gallery-thumbs .thumbs-wrapper').css(thumbDesk);
            },
            betterImg: function(url,width,height,type) {
                var newUrl;
                if (type == 'thumb') {
                    if (width < 200) {
                        width = 200;
                        height = 100;
                    }
                    newUrl = url.replace(new RegExp("/480/240/", 'g'), "/" + width + "/" + height + "/");
                    newUrl = newUrl.replace(new RegExp("/300/163/", 'g'), "/" + width + "/" + height + "/");
                } else if (type == 'large') {
                    if (width < 640) {
                        width = 640;
                        height = 320;
                    }
                    newUrl = url.replace(new RegExp("/300/163/", 'g'), "/" + width + "/" + height + "/");
                    newUrl = newUrl.replace(new RegExp("/480/240/", 'g'), "/" + width + "/" + height + "/");
                }
                return newUrl;
            },
            detectImg: function(url,callback){
                var img = new Image();
                img.src = url;
                var width = img.naturalWidth;
                var height = img.naturalHeight;

                if (width == 0 && maxLoad > 0) {
                    recheck = setTimeout(function(){ myGallery.helpers.detectImg(url,callback); },200);
                    maxLoad--;
                } else if (maxLoad <= 0) {
                    clearTimeout(recheck);
                    maxLoad = 20;
                } else {
                    callback();
                    maxLoad = 20;
                }
               
            }
        }
    }

    _this.click(function(e){
        e.preventDefault();
        var curImg = $(this).attr('href');
        myGallery.init(_this,curImg);
    });

    $(window).resize(function(){
        myGallery.helpers.resizeThumb();        
        myGallery.helpers.resizeLarge();
    });


}

