// Created by Hivan Du 2015(Siso brand interactive team).

"use strict";

var app = {
    sprites: {
        stone: [],
        wave: []
    },

    scene: {
        availWidth: 0,
        availHeight: 0
    },

    direct: 'forward',

    canPlay: true,

    curStoneParaIndex: 0,

    preload: function () {
        var that = this;

        var Canvas = document.getElementById('stone-body');
        var ctx = Canvas.getContext('2d');

        //  set scene info
        that.scene.availWidth = screen.availWidth;
        that.scene.availHeight = screen.availHeight;

        //  init page response plugin, if device is mobile device
        if (that.scene.availWidth <= 640) {
            //var page = new pageResponse({
            //    class : 'wrap',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            //    mode : 'cover',     // auto || contain || cover ，默认模式为auto
            //    width : '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            //    height : '625'      //输入页面的高度，只支持输入数值，默认高度为504px
            //});
        } else {
            $('.wrap').addClass('zoomInTablet');

            //  set scene size to default size
            that.scene.availWidth = 375;
            that.scene.availHeight = 625;
        }

        //  set images generator
        var imgPath = "assets/images/";
        //  img amounts, use the amounts order to general image objects
        var imgAmounts = 24+169;
        var loadedAmounts = 0;
        var isLoaded = false;
        var startLoadTime = new Date().getTime();
        var endLoadTime = null;

        //  load loading image
        var birdImg = new Image();
        birdImg.src = 'assets/images/bird-sprite.png';
        birdImg.onload = function () {
            $('.loading-statue').removeClass('loading-statue');

            //  show bird
            $('.loading .bird').addClass('transform');
            $('.loading').addClass('play');

            loadMain();
        };

        //  init fast click
        FastClick.attach(document.body);

        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {
                FastClick.attach(document.body);
            }, false);
        }

        //  load main images
        function loadMain () {
            //  load stone scene frames
            for (var i = 1; i <= 24; i++) {
                //for (var i = 0; i <= 23; i++) {
                var img = new Image();
                img.src = imgPath + 's01-stone-body' + fixZero(i) + '.png';
                //img.src = 'assets/img/' + 's01-stone-body' + fixZero(i) + '.png';

                img.index = i;

                loadedAmounts++;

                img.onload = function () {
                    that.sprites.stone[this.index] = this;
                    /* check img load progress */
                    if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                        goCreatingProcess();
                    }
                };

                img.onerror = function (error) {
                    imgAmounts -= 1;

                    /* check img load progress */
                    if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                        goCreatingProcess();
                    }
                };
            }

            //  load wave scene frames
            for (var i = 1; i <= 169; i++) {
                var img = new Image();
                img.src = imgPath + 'wave_00' + fixZeroForWave(i) + '.png';

                img.index = i;

                img.onload = function () {
                    that.sprites.wave[this.index] = this;
                    loadedAmounts++;

                    /* check img load progress */
                    if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                        goCreatingProcess();
                    }
                };

                img.onerror = function (error) {
                    imgAmounts -= 1;

                    /* check img load progress */
                    if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                        goCreatingProcess();
                    }
                };
            }
        }

        function goCreatingProcess () {
            isLoaded = true;
            endLoadTime = new Date().getTime();
            var timeDifference = (endLoadTime - startLoadTime)/1000;

            //  if loaded time less than 3.5 seconds,
            //  delay then start app
            if (timeDifference < 3) {
                console.log('images loader end..');
                var delay = 3500 - timeDifference*1000;
                //var delay = 10;

                setTimeout(function () {
                    //  update loading bar
                    $('.loading .counter').text('100%');
                    $('.line-wrap').css({'background-position' : '100% 0%'});

                    setTimeout(function () {
                        app.start();
                    }, parseInt(delay/3*1));
                }, parseInt(delay/3*2));
            } else {
                //  update loading bar
                $('.loading .counter').text('100%');
                $('.line-wrap').css({'background-position' : '100% 0%'});

                console.log('images loader end..');
                setTimeout(function () {
                    app.start();
                }, 300);
            }

            ////  TODO Developing
            //console.log('images loader end..');
            //setTimeout(function () {
            //    app.start();
            //}, 300);
        }

        function checkIsAllMainImagesLoaded () {
            if (isLoaded == false) {
                var loadedRate = 0.98;

                var lineWidth = parseInt(375*0.64);
                var lineActiveWidth = 54;

                var percent = parseInt(loadedAmounts / imgAmounts*100);
                $('.loading .counter').text(percent + '%');
                $('.line-wrap').css({'background-position' : (parseInt(lineWidth*percent/100) - lineActiveWidth +'px 0px')});

                return loadedAmounts / imgAmounts >= loadedRate;
            }
        }

        function fixZero (num) {
            return num < 10 ? '0' + num : num;
        }

        function fixZeroForWave (num) {
            if (num < 10) {
                return '00' + num;
            } else if (num <100) {
                return '0' + num;
            } else {
                return num;
            }
        }
    },

    create: function (){
        var that = this;

        //  init swiper
        $('.swiper-container').show();

        var swiperItemsLength = $('.scene').length;

        app.mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            parallax : true,

            noSwiping: false,

            // init
            onInit: function (swiper) {
                $('.main-scene').addClass('active');

                $('.scene').eq(swiper.activeIndex).addClass('active');

                $('.tips-arrow').show();

                //  init texture
                that.textures = new Textures();
                that.textures.init();

                //  bound menu button
                $('.btn-main').click(function (e) {
                    e.stopPropagation();

                    //  enable slider
                    app.mySwiper.unlockSwipes();

                    //  hide back button
                    $('.btn-back').removeClass('active');

                    //  remove in big picture statue for scene big picture
                    $('.scene-big-picture').removeClass('inBigPicture');

                    //  remove big picture show, and remove big picture layout to the front
                    $('.big-picture').removeClass('inBigPicture inFrontLayer');

                    //  exist texture active status
                    that.textures.hide();

                    //  hide para right now
                    $('.main-scene .item').removeClass('active').addClass('backRightNow');
                    setTimeout(function () {
                        $('.main-scene .item').removeClass('backRightNow');
                    }, 300);

                    //  bird back to start stat
                    $('.bird').removeClass('transform transformed fly');

                    //  show bird
                    $('.scene .bird').addClass('transform');
                    setTimeout(function () {
                        $('.scene .bird').removeClass('transform')
                            .addClass('transformed');

                        setTimeout(function () {
                            $('.scene .bird').removeClass('transformed')
                                .addClass('fly');
                        }, 600);
                    }, 500);

                    //  play first time again
                    playFirstTime(stoneFrameIndexes[0], stoneFrameIndexes[1]);

                    slideTo(0);
                });

                $('.btn-menu').click(function (e) {
                    e.stopPropagation();

                    //  enable slider
                    app.mySwiper.unlockSwipes();

                    //  remove in big picture statue for scene big picture
                    $('.scene-big-picture').removeClass('inBigPicture');

                    //  remove big picture show, and remove big picture layout to the front
                    $('.big-picture').removeClass('inBigPicture inFrontLayer');

                    //  exist texture active status
                    that.textures.hide();

                    slideTo(1);
                });

                $('.btn-back').click(function (e) {
                    e.stopPropagation();

                    $(this).removeClass('active inScratch');

                    //  enable slider
                    app.mySwiper.unlockSwipes();

                    //  remove in big picture statue for scene big picture
                    $('.scene-big-picture').removeClass('inBigPicture');

                    //  remove big picture show, and remove big picture layout to the front
                    $('.big-picture').removeClass('inBigPicture inFrontLayer');

                    //  exist texture active status
                    that.textures.hide();
                });

                //  bound main scene content router
                $('.item01 .stone-txt, .menu-scene .item01').click(function(e){
                    e.stopPropagation();
                    slideTo(2);
                });

                $('.item02 .stone-txt, .menu-scene .item02').click(function(e){
                    e.stopPropagation();
                    slideTo(4);
                });

                $('.item03 .stone-txt, .menu-scene .item03').click(function(e){
                    e.stopPropagation();
                    slideTo(8);
                });

                $('.item04 .stone-txt, .menu-scene .item04').click(function(e){
                    e.stopPropagation();
                    slideTo(15);
                });

                //  cursor for content entry
                $('.cursor').click(function (e) {
                    e.stopPropagation();

                    var index = $(this).attr('class');
                    index = index[index.length-1];
                    console.log(index);

                    switch (parseInt(index)) {
                        case 1:
                            slideTo(2);
                            break;
                        case 2:
                            slideTo(4);
                            break;
                        case 3:
                            slideTo(8);
                            break;
                        case 4:
                            slideTo(15);
                            break;
                    }
                });

                function slideTo(index) {
                    $('.wrap').addClass('toContent').removeClass('mainSceneToMenu contentToMenu');
                    $('.btn-menu, .btn-main').removeClass('active');
                    swiper.slideTo(index, 0);//切换到第一个slide，速度为1秒
                }
            },

            onTransitionStart: function (swiper) {
                //  hide menu button when transition start
                $('.btn-menu, .btn-main').addClass('active');

                if (swiper.activeIndex == swiperItemsLength) {
                    $('.slider-arrow').hide();
                } else {
                    $('.slider-arrow').hide();
                }
            },

            onTransitionEnd: function (swiper) {
                $('.btn-menu, .btn-main').removeClass('active');
                $('.scene').removeClass('active');
                $('.scene').eq(swiper.activeIndex).addClass('active');

                //  show menu button if current page is not the first page
                if (swiper.activeIndex == 0) {
                    $('.btn-menu, .btn-main').addClass('active');
                } else {
                    $('.btn-menu, .btn-main').removeClass('active');
                }
            }
        });

        //  first time play BGM
        var initSound = function () {
            //  delay play
            $('#audio')[0].play();

            document.removeEventListener('touchstart', initSound, false);
        };
        document.addEventListener('touchstart', initSound, false);

        //  init sliders
        $('.bxslider').bxSlider({
            controls: false
        });

        /**
         * Animation parts
         * */
        var stoneCanvas = document.getElementById('stone-body');
        var waveCanvas = document.getElementById('stone-wave');

        var stoneCtx = stoneCanvas.getContext('2d');
        var waveCtx = waveCanvas.getContext('2d');

        var stoneCanvasWidth = stoneCanvas.width;
        var stoneCanvasHeight = stoneCanvas.height;

        var waveCanvasWidth = waveCanvas.width;
        var waveCanvasHeight = waveCanvas.height;

        /* indexes setting */
        var stoneFrameIndexes = [0, 23];
        var stoneKeyframeIndexes = [0, 8, 15, 21];

        var waveFrameIndexes = [1, 169];

        that.curFrameIndex = 1;
        var curStoneParaIndex = 0;
        that.canPlay = true;

        //  show bird
        $('.scene .bird').addClass('transform');
        setTimeout(function () {
            $('.scene .bird').removeClass('transform')
                .addClass('transformed');

            setTimeout(function () {
                $('.scene .bird').removeClass('transformed')
                    .addClass('fly');
            }, 600);
        }, 500);

        //  play stone animation
        playFirstTime(stoneFrameIndexes[0], stoneFrameIndexes[1]);

        /**  play wave animation */
        drawWaveSprite(waveFrameIndexes[0], waveFrameIndexes[1]);

        //  bind touch event
        var toucharea = document.getElementsByClassName('wrap')[0];
        var touchStartPoint = 0;
        var minMove = 2;

        toucharea.addEventListener('touchstart', setTouchStartPoint);

        toucharea.addEventListener('touchmove', setCurrentFrame);

        toucharea.addEventListener('touchend', touchEndHandler);

        //  play the first time animation
        function playFirstTime (curFrameIndex, endFrameIndex) {
            clearTimeout(that.playTimer);

            drawFirstTime(curFrameIndex, endFrameIndex);

            function drawFirstTime (curFrameIndex, endFrameIndex) {
                //  check whether currentFrame is the last frame of the current scene.
                if (curFrameIndex == endFrameIndex+1) {
                    //  draw first frame
                    drawStone(stoneFrameIndexes[0]);

                    //  show para
                    $('.main-scene .item').removeClass('active');
                    $('.main-scene .item').eq(curStoneParaIndex).addClass('active');
                    $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                        .addClass('active cursor0' + (curStoneParaIndex+1));

                    /** play the second time animation */
                    that.playTimer = setTimeout(function () {
                        //  hide para
                        $('.main-scene .item').removeClass('active');

                        //  start from second frame
                        drawStoneSprite(that.curFrameIndex+1, stoneFrameIndexes[1]);
                    }, 3000);
                } else {
                    drawStone(curFrameIndex);
                    $('.cursor').removeClass('active');

                    // drawStone next frame
                    that.playTimer = setTimeout(function () {
                        //  drawStone direction
                        that.direct == "forward" ? drawFirstTime(parseInt(curFrameIndex)+1, endFrameIndex) : drawFirstTime(parseInt(curFrameIndex)-1, endFrameIndex);
                    }, 1000/12);
                }
            }
        }

        //  recursive to drawStone sprites
        function drawStoneSprite(curFrameIndex, endFrameIndex) {
            clearTimeout(that.playTimer);

            function play () {
                //  check whether currentFrame is the last frame of the current scene.
                if (curFrameIndex == endFrameIndex) {
                    drawStone(curFrameIndex);
                    // drawStone next frame
                    that.playTimer = setTimeout(function () {
                        //  drawStone direction
                        that.direct == "forward" ? drawStoneSprite(stoneFrameIndexes[0], stoneFrameIndexes[1]) : drawStoneSprite(stoneFrameIndexes[1], stoneFrameIndexes[0]);
                    }, 1000/8);
                } else {
                    drawStone(curFrameIndex);

                    // drawStone next frame
                    that.playTimer = setTimeout(function () {
                        //  drawStone direction
                        that.direct == "forward" ? drawStoneSprite(parseInt(curFrameIndex)+1, endFrameIndex) : drawStoneSprite(parseInt(curFrameIndex)-1, endFrameIndex);
                    }, 1000/8);
                }
            }

            if (that.canPlay == true) {
                that.curFrameIndex = curFrameIndex;

                //  check whether current frame is keyframe
                for (var i = 0; i < stoneKeyframeIndexes.length; i++) {
                    if (that.curFrameIndex == stoneKeyframeIndexes[i]) {
                        curStoneParaIndex = i;
                        that.curStoneParaIndex = i;

                        //  show para
                        $('.main-scene .item').removeClass('active');
                        $('.main-scene .item').eq(curStoneParaIndex).addClass('active');
                        $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                            .addClass('active cursor0' + (curStoneParaIndex+1));

                        //  play next frames
                        that.playTimer = setTimeout(function () {
                            $('.main-scene .item').removeClass('active');
                            play();
                        }, 3200);
                        return;
                    }
                }

                // if current frame is not keyframe, play the current frame
                $('.cursor').removeClass('active');
                play();
            }
        }

        //  recursive to drawStone sprites
        function drawWaveSprite(curFrameIndex, endFrameIndex) {
            //  clear timer
            clearTimeout(that.waveTimer);

            //  check whether currentFrame is the last frame of the current scene.
            if (curFrameIndex == endFrameIndex) {
                drawWave(curFrameIndex);

                // drawStone next frame
                that.waveTimer = setTimeout(function () {
                    drawWaveSprite(waveFrameIndexes[0], waveFrameIndexes[1]);
                }, 1000/25);
            } else {
                drawWave(curFrameIndex);

                // drawStone next frame
                that.waveTimer = setTimeout(function () {
                    //  drawStone direction
                    drawWaveSprite(parseInt(curFrameIndex)+1, endFrameIndex);
                }, 1000/25);
            }
        }

        function drawStone(frameIndex) {
            /**
             * Draw frame into canvas
             * @param {Number} frameIndex  the index of frame you want to drawStone into canvas
             * */
            var img = that.sprites.stone[frameIndex];

            if (img) {
                //  clear paper
                stoneCtx.clearRect(0, 0, stoneCanvasWidth, stoneCanvasHeight);

                //  drawStone image
                stoneCtx.drawImage(img, 0, 0, stoneCanvasWidth, stoneCanvasHeight);
            } else {

            }
        }

        function drawWave(frameIndex) {
            /**
             * Draw frame into canvas
             * @param {Number} frameIndex  the index of frame you want to drawStone into canvas
             * */
            var img = that.sprites.wave[frameIndex];

            if (img) {
                //  clear paper
                waveCtx.clearRect(0, 0, waveCanvasWidth, waveCanvasHeight);

                //  drawStone image
                waveCtx.drawImage(img, 0, 0, waveCanvasWidth, waveCanvasHeight);

                waveCtx.save();
                waveCtx.globalAlpha = 0.2;
                waveCtx.drawImage(img, 0, 0, waveCanvasWidth, waveCanvasHeight);
                waveCtx.restore();
            } else {

            }
        }

        //  touch handler
        function setTouchStartPoint(e) {
            touchStartPoint = e.touches[0].pageX;
            clearTimeout(that.playTimer);

            //  hide para
            $('.main-scene .item').removeClass('active');
            $('.cursor').removeClass('active cursor01 cursor02 cursor03 cursor04');
        }

        function setCurrentFrame (e) {
            that.canPlay = false;

            //  get current touch position
            var curPoint = e.touches[0].pageX;
            var distance = Math.abs(curPoint - touchStartPoint);

            var startFrame = stoneFrameIndexes[0];
            var endFrame = stoneFrameIndexes[1];

            //  calculate the next frame's index to draw
            //  if the drag direction is "forward"
            if (distance > minMove && curPoint > touchStartPoint) {
                that.curFrameIndex += 2;

                that.curFrameIndex > endFrame ? that.curFrameIndex = stoneFrameIndexes[0] : null;
            } else if (distance > minMove && curPoint < touchStartPoint) {
                that.curFrameIndex -= 2;

                that.curFrameIndex < startFrame ? that.curFrameIndex = stoneFrameIndexes[1] : null;
            } else {

            }

            //  draw next frame
            touchStartPoint = curPoint;
            drawStone(that.curFrameIndex);
        }

        function touchEndHandler() {
            that.canPlay = true;

            //  get current frame closer which keyframe
            var min = 10000;
            var minIndex = 0;

            for (var i = 0; i < stoneKeyframeIndexes.length; i++) {
                var distance = Math.abs(that.curFrameIndex - stoneKeyframeIndexes[i]);
                if (distance < min) {
                    min = distance;
                    minIndex = i;
                }
            }

            //  show para
            $('.main-scene .item').removeClass('active');
            $('.main-scene .item').eq(minIndex).addClass('active');
            $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                .addClass('active cursor0' + (minIndex+1));


            that.playTimer = setTimeout(function () {
                //  start from second frame

                that.curFrameIndex +1 == stoneFrameIndexes[1] ? that.curFrameIndex = 0 : that.curFrameIndex++;
                drawStoneSprite(that.curFrameIndex, stoneFrameIndexes[1]);
            }, 3200);
        }

        /** picture touch */
        var pictureWraps = document.getElementsByClassName('big-picture');
        var pictureImgDom = pictureWraps[0].getElementsByClassName('picture-wrap')[0].getElementsByTagName('img')[0];
        var pictureTitleDom = document.getElementsByClassName('big-picture')[0].getElementsByClassName('title')[0].getElementsByTagName('img')[0];
        var bigPictureArr = [];
        //var pictureZoom = $('.wrap').css('transform').split(')')[0].split('(')[1].replace(/ /g, '').split(',')[0];
        var pictureZoom = 1;

        //  request big picture
        var img = new Image();
        var imgPath = 'assets/images/';
        img.src = imgPath + 'big-picture01.jpg';
        bigPictureArr.push(img);

        img = new Image();
        img.src = imgPath + 'big-picture02.jpg';
        bigPictureArr.push(img);

        img = new Image();
        img.src = imgPath + 'big-picture03.jpg';
        bigPictureArr.push(img);

        //  bind touch handler for each picture wrap
        for (var i = 0; i < pictureWraps.length; i++) {
            var pictureWrap = pictureWraps[i];

            pictureWrap.addEventListener('touchstart', pictureTouchStartHandler);
            pictureWrap.addEventListener('touchmove', pictureTouchMoveHandler);

            //  set default picture as undefined
            pictureWrap.picture = undefined;
        }

        //  bind texture entry
        $('.texture-title01').click(function () {
            that.textures.texture01();
        });

        $('.texture-title02').click(function () {
            that.textures.texture02();
        });

        $('.texture-title03').click(function () {
            that.textures.texture03();
        });

        $('.texture-title04').click(function () {
            that.textures.texture04();
        });

        $('.texture-title05').click(function () {
            that.textures.texture05();
        });

        function checkIsAllLoaded () {
            return loadedAmounts / imgAmounts >= 1;
        }

        function pictureTouchStartHandler (e) {
            this.touchStartPointX = e.touches[0].pageX;
            this.touchStartPointY = e.touches[0].pageY;

            //  catch picture
            if (!this.picture) {
                this.picture = this.getElementsByTagName('img')[0];
            }
        }

        function pictureTouchMoveHandler (e) {
            var canSetNewPosition = true;
            var picture = this.picture;
            var oldPosition = matrixToArray(this.picture.getAttribute('style'));
            var oldPositionX = oldPosition[0];
            var oldPositionY = oldPosition[1];

            //  get current touch position
            var curPointX = e.touches[0].pageX;
            var curPointY = e.touches[0].pageY;
            var oldPointX = this.touchStartPointX;
            var oldPointY = this.touchStartPointY;

            var distanceX = Math.abs(curPointX - oldPointX);
            var distanceY = Math.abs(curPointY - oldPointY);

            var newX = 0;
            var newY = 0;

            //  set new position changed value
            curPointX < oldPointX ? newX = -distanceX : newX = distanceX;
            curPointY < oldPointY ? newY = -distanceY : newY = distanceY;

            //  calculate final position
            newX = (newX + parseInt(oldPositionX));
            newY = (newY + parseInt(oldPositionY));

            //console.log(newX, newY);

            var isTheMaxLeftTop = newX > 0 || newY > 0;
            var isTheMaxLeftBottom = newX > 0 || newY < -(picture.height - that.scene.availHeight);
            var isTheMaxRightTop = newX < -(picture.width - that.scene.availWidth) || newY > 0;
            var isTheMaxRightBottom = newX < -(picture.width - that.scene.availWidth) || newY < -(picture.height - that.scene.availHeight);


            /**  if drag out of boundary */
            if ( isTheMaxLeftTop || isTheMaxLeftBottom || isTheMaxRightTop || isTheMaxRightBottom ) {
                canSetNewPosition = false;

                //  debug
                //console.log('\n', ' isTheMaxLeftTop', isTheMaxLeftTop);
                //console.log('isTheMaxLeftBottom', isTheMaxLeftBottom);
                //console.log('isTheMaxRightTop', isTheMaxRightTop);
                //console.log('isTheMaxRightBottom', isTheMaxRightBottom);
            }

            //  if can set new position
            if (canSetNewPosition) {
                //  set image new position
                picture.setAttribute('style', 'transform: translate3d(' + newX  +'px, ' + newY +  'px, 0);' + '-webkit-transform: translate3d(' + newX  +'px, ' + newY +  'px, 0);');

                //  update touchStart point
                this.touchStartPointX = curPointX;
                this.touchStartPointY = curPointY;
            }
        }

        function matrixToArray(matrix) {
            return matrix.split(')')[0].split('(')[1].replace(/ /g, '').replace(/px/g, '').split(',');
        }

    },

    start: function (){
        var that = this;

        //  let main scene active
        $('.loading').addClass('leave');

        setTimeout(function () {
            that.create()
        }, 1000);
    }
};

$(function (){
    //  limit browser drag move
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    },true);

    // init app
    app.preload();

    //  let main scene active
    //$('.loading').addClass('leave');

    console.log('app started success...');
});