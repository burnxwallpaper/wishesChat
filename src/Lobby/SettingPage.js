import React, { useState } from 'react';
import './SettingPage.css';
import freezeBlack from '../Common/freezeBlack'
import Spinner from '../Common/Spinner'

function SettingPage({ socket, accountInfo }) {
    const [mouse, setMouse] = useState(
        {
            dragging: false,
            startX: null,
            startY: null,
        }
    )
    const [touchEnd, setTouchEnd] = useState()
    const [image, setImage] = useState()
    const [trimPosition, setTrimPosition] = useState({
        startX: null,
        startY: null,
        width: null,
        height: null
    })

    function handleFiles(e) {
        let file = e.target.files[0]
        var imageType = /image.*/;
        if (!file.type.match(imageType)) { console.log("invalid file type"); return }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (function () {
            return function (e) {
                let image = new Image();
                image.onload = function () {
                    console.log(document.documentElement.clientWidth)
                    //responsive
                    let maxCanvasWidth = Math.min(document.documentElement.clientWidth, 300)
                    //take longer side and resize image
                    this.canvasImgRatio = maxCanvasWidth / Math.max(this.width, this.height)
                    console.log(this.width + 'x' + this.height + ";Canvas-Img ratio:" + this.canvasImgRatio);
                    image.crossOrigin = 'Anonymous'
                    setImage(image)
                    //display canvas
                    let trimCanvasWrapper = document.getElementById("trimCanvasArea")
                    trimCanvasWrapper.style.display = "unset";
                    let trimBtn = document.getElementById("btn-trim")
                    trimBtn.style.display = "inline-block";
                    //filter freeze
                    freezeBlack()
                    //initialize canvas
                    clearDraw()
                    let canvas = document.getElementById("mycanvas")
                    canvas.width = this.width * this.canvasImgRatio
                    canvas.height = this.height * this.canvasImgRatio
                    canvas.style.maxWidth = this.width * this.canvasImgRatio + "px"
                    canvas.style.maxHeight = this.height * this.canvasImgRatio + "px"
                    canvas.style.display = "block"
                    //draw
                    draw(image, this.width * this.canvasImgRatio, this.height * this.canvasImgRatio)
                }
                image.src = e.target.result
            };
        })();

    }
    //clear trimArea
    function clearDraw() {
        let c = document.getElementById("mycanvas");
        let ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
    }
    //draw trimArea
    function draw(image, width, height) {
        let c = document.getElementById("mycanvas");
        let ctx = c.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
    }
    //judge the mouse offset if it is to move the trim area
    function moveRule(e) {
        let mouseX = e.nativeEvent.offsetX,
            mouseY = e.nativeEvent.offsetY,
            trimXStart = trimPosition.startX,
            trimYStart = trimPosition.startY,
            trimXEnd = trimPosition.startX + trimPosition.width,
            trimYEnd = trimPosition.startY + trimPosition.height;
        let condition1 = false
        let condition2 = false
        mouseX > trimXStart && mouseX < trimXEnd && (condition1 = true)
        mouseY > trimYStart && mouseY < trimYEnd && (condition2 = true)
        //console.log(`
        //trimXStart:${trimXStart},trimYStart:${trimYStart},trimXEnd:${trimXEnd},trimYEnd:${trimYEnd},x:${mouseX},y:${mouseY}`)
        if (condition1 && condition2) return true
    }
    // resize judge
    function resizeRule(e) {
        let mouseX = e.nativeEvent.offsetX,
            mouseY = e.nativeEvent.offsetY,
            trimXStart = trimPosition.startX,
            trimYStart = trimPosition.startY,
            trimXEnd = trimPosition.startX + trimPosition.width,
            trimYEnd = trimPosition.startY + trimPosition.height;
        let resizeJudgerange = 4
        function inRange(x, min, max) {
            return ((x - min) * (x - max) <= 0);
        }
        let xconditionLeft = inRange(mouseX, trimXStart - resizeJudgerange, trimXStart + resizeJudgerange)
        let xconditionRight = inRange(mouseX, trimXEnd - resizeJudgerange, trimXEnd + resizeJudgerange)
        let yconditionTop = inRange(mouseY, trimYStart - resizeJudgerange, trimYStart + resizeJudgerange)
        let yconditionBottom = inRange(mouseY, trimYEnd - resizeJudgerange, trimYEnd + resizeJudgerange)

        if (inRange(mouseX, trimXStart - resizeJudgerange, trimXEnd + resizeJudgerange)) {
            if (inRange(mouseY, trimYStart - resizeJudgerange, trimYEnd + resizeJudgerange)) {
                if (xconditionLeft) {
                    if (yconditionTop) { return "nwse-resize" }
                    else if (yconditionBottom) { return "nesw-resize" }
                    else return "ew-resize"
                }
                else if (xconditionRight) {
                    if (yconditionTop) { return "nesw-resize" }
                    else if (yconditionBottom) { return "nwse-resize" }
                    else return "ew-resize"
                }
                else if (yconditionTop || yconditionBottom) {
                    return 'ns-resize'
                }
            }
        }
        else return false
    }
    //mousedown
    function mouseDownEvent(e) {
        //for touch event, if touch, only drag event will be fired
        var rect = e.target.getBoundingClientRect();
        let touchX
        let touchY
        if (e.targetTouches) {
            touchX = e.targetTouches[0].pageX - rect.left;
            touchY = e.targetTouches[0].pageY - rect.top;
            console.log("x:" + touchX + "y:" + touchY)
        }
        //ResizeTrim    
        if (resizeRule(e)) {
            console.log("ResizeTrim")
            setMouse(
                {
                    startX: e.nativeEvent.offsetX,
                    startY: e.nativeEvent.offsetY,
                    resizeTrim: resizeRule(e),
                    mouseOffsetX: e.nativeEvent.offsetX,
                    mouseOffsetY: e.nativeEvent.offsetY
                }
            )
        }
        //MoveTrim
        else if (moveRule(e)) {
            console.log("moveTrim")
            setMouse(
                {
                    ...mouse,
                    moveTrim: true,
                    mouseOffsetX: e.nativeEvent.offsetX - trimPosition.startX,
                    mouseOffsetY: e.nativeEvent.offsetY - trimPosition.startY

                }
            )
        }
        //DragTrim
        else if (!mouse.moveTrim) {
            console.log("DragTrim")
            setMouse({
                ...mouse,
                dragging: true,
                startX: e.nativeEvent.offsetX || touchX,
                startY: e.nativeEvent.offsetY || touchY
            })
        }
    }

    // mousemove
    function mouseMoveEvent(e) {
        var rect = e.target.getBoundingClientRect();
        let touchX
        let touchY
        if (e.targetTouches) {
            touchX = e.targetTouches[0].pageX - rect.left;
            touchY = e.targetTouches[0].pageY - rect.top;
            console.log("touchX:" + touchX + "touchY:" + touchY)
        }
        console.log("x:" + e.nativeEvent.offsetX + ";y:" + e.nativeEvent.offsetY)
        let c = document.getElementById("mycanvas");
        let ctx = c.getContext("2d");
        //resizeFunction
        if (resizeRule(e) || mouse.resizeTrim) {
            c.style.cursor = mouse.resizeTrim || resizeRule(e);
            if (mouse.resizeTrim) {
                let tempStartX = trimPosition.startX;
                let tempStartY = trimPosition.startY;
                let tempHeight = trimPosition.height;
                let tempWidth = trimPosition.width;
                // +2 = judgement area range
                if (mouse.startX > tempStartX + 2) { tempWidth = trimPosition.width + ((e.nativeEvent.offsetX || touchX) - mouse.startX) }
                else {
                    tempStartX = e.nativeEvent.offsetX || touchX
                    tempWidth = trimPosition.width + ((-e.nativeEvent.offsetX || touchX) + mouse.startX)
                }
                if (mouse.startY > tempStartY + 2) { tempHeight = trimPosition.height + ((e.nativeEvent.offsetY || touchY) - mouse.startY) }
                else {
                    tempStartY = e.nativeEvent.offsetY || touchY
                    tempHeight = trimPosition.height + ((-e.nativeEvent.offsetY || touchY) + mouse.startY)
                }
                let maxX = image.canvasImgRatio * image.width
                let maxY = image.canvasImgRatio * image.height
                tempStartX = Math.min(tempStartX, maxX);
                tempStartY = Math.min(tempStartY, maxY);
                drawTrim(tempStartX, tempStartY, tempWidth, tempHeight, ctx)
                return
            }
        }
        //move
        else if (moveRule(e)) {
            c.style.cursor = 'move';
            if (mouse.moveTrim) {
                let tempWidth = trimPosition.width,
                    tempHeight = trimPosition.height,
                    tempStartX = e.nativeEvent.offsetX - mouse.mouseOffsetX,
                    tempStartY = e.nativeEvent.offsetY - mouse.mouseOffsetY;
                let trimCanvas = document.getElementById("mycanvas")
                let maxWidth = trimCanvas.width
                let maxHeight = trimCanvas.height
                //prevent over border
                tempStartX = Math.max(0, Math.min(tempStartX, maxWidth - tempWidth))
                tempStartY = Math.max(0, Math.min(tempStartY, maxHeight - tempHeight))

                drawTrim(tempStartX, tempStartY, tempWidth, tempHeight, ctx)
                setTrimPosition(
                    {
                        startX: tempStartX,
                        startY: tempStartY,
                        width: tempWidth,
                        height: tempHeight
                    }
                )
                return
            }
        } else { c.style.cursor = 'unset'; }

        if (!mouse.dragging) return;
        //Dragging function
        // cal trim width and height
        let tempWidth = (e.nativeEvent.offsetX || touchX) - mouse.startX,
            tempHeight = (e.nativeEvent.offsetY || touchY) - mouse.startY;
        console.log("tempWidth:" + tempWidth + "; tempHeight:" + tempHeight)
        drawTrim(mouse.startX, mouse.startY, tempWidth, tempHeight, ctx)
        if (touchX) {
            setTouchEnd({
                touchXEnd: touchX,
                touchYEnd: touchY
            })
        }
    }

    // 移出/松开事件
    function mouseRemoveEvent(e) {
        let touchX
        let touchY
        if (e.targetTouches) {
            if (!touchEnd) return
            touchX = touchEnd.touchXEnd;
            touchY = touchEnd.touchYEnd;
            console.log("x:" + touchX + "y:" + touchY)
        }
        //moveTrim
        function settrim() {
            let width = (e.nativeEvent.offsetX || touchX) - mouse.startX
            let height = (e.nativeEvent.offsetY || touchY) - mouse.startY

            setTrimPosition({
                startX: width >= 0 ? mouse.startX : mouse.startX + width,
                startY: height >= 0 ? mouse.startY : mouse.startY + height,
                width: Math.abs(width),
                height: Math.abs(height)
            })
            console.log(({
                startX: width >= 0 ? mouse.startX : mouse.startX + width,
                startY: height >= 0 ? mouse.startY : mouse.startY + height,
                width: Math.abs(width),
                height: Math.abs(height)
            }))
        }

        if (mouse.moveTrim) {
            console.log("moveTrimdone")
        } else if (mouse.resizeTrim) {
            let tempWidth = trimPosition.width,
                tempHeight = trimPosition.height;
            let tempStartX = trimPosition.startX
            let tempStartY = trimPosition.startY
            if (mouse.startX > tempStartX + 2) { tempWidth = trimPosition.width + (e.nativeEvent.offsetX - mouse.startX) }
            else {
                tempStartX = e.nativeEvent.offsetX
                tempWidth = trimPosition.width + (-e.nativeEvent.offsetX + mouse.startX)
            }
            if (mouse.startY > tempStartY + 2) { tempHeight = trimPosition.height + (e.nativeEvent.offsetY - mouse.startY) }
            else {
                tempStartY = e.nativeEvent.offsetY
                tempHeight = trimPosition.height + (-e.nativeEvent.offsetY + mouse.startY)
            }

            tempStartX = Math.min(tempStartX, 300);
            tempStartY = Math.min(tempStartY, 300);
            setTrimPosition({
                startX: Math.min(tempStartX, tempStartX + tempWidth),
                startY: Math.min(tempStartY, tempStartY + tempHeight),
                width: Math.abs(tempWidth),
                height: Math.abs(tempHeight)
            })
            console.log(({
                startX: Math.min(tempStartX, tempStartX + tempWidth),
                startY: Math.min(tempStartY, tempStartY + tempHeight),
                width: Math.abs(tempWidth),
                height: Math.abs(tempHeight)
            }))
        } else {
            settrim()
        }

        setMouse({
            resizeTrim: false,
            dragging: false,
            moveTrim: false,
        })
    }
    function drawTrim(startX, startY, width, height) {
        let c = document.getElementById("mycanvas");
        let ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 300, 300);

        // draw cover layer
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; // layer color
        ctx.fillRect(0, 0, 300, 300);

        // cut cover layer (area=trim area)
        ctx.globalCompositeOperation = 'source-atop';
        ctx.clearRect(startX, startY, width, height); //cut 

        // draw 8 dots
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#fc178f';
        let size = 5; // dot size
        function drawPoint(startX, startY, size) {
            ctx.beginPath();
            ctx.arc(startX, startY, size, 0, 2 * Math.PI, true);
            ctx.fill();
        }
        drawPoint(startX, startY, size)//top left
        drawPoint(startX + width / 2, startY, size) //top mid
        drawPoint(startX + width, startY, size)//top right
        drawPoint(startX, startY + height / 2, size) //mid left
        drawPoint(startX + width, startY + height / 2, size) //mid right
        drawPoint(startX, startY + height, size) //bot left
        drawPoint(startX + width / 2, startY + height, size) //bot mid 
        drawPoint(startX + width, startY + height, size) //bot right
        ctx.restore();

        // draw image under the cover layer
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(image, 0, 0, image.width * image.canvasImgRatio, image.height * image.canvasImgRatio);
        ctx.restore();
    }

    function getTrim() {
        //temporarily put image with original size to 2nd canvas 
        let resizeCanvas = document.getElementById("resizeCanvas");
        let resizeImg = resizeCanvas.getContext("2d");
        resizeCanvas.width = image.width
        resizeCanvas.height = image.height
        resizeImg.clearRect(0, 0, resizeCanvas.width, resizeCanvas.height);
        resizeImg.drawImage(image, 0, 0, resizeCanvas.width, resizeCanvas.height);


        //get trimed data from original image and put to 3rd canvas //just for test the trimed image is original size 

        let { startX, startY, width, height } = trimPosition
        if (!startX || !trimPosition) {
            let trimCanvas = document.getElementById("mycanvas")
            startX = 0;
            startY = 0;
            width = trimCanvas.width
            height = trimCanvas.height
        }

        let finishTrimCanvas = document.getElementById("finishTrim");
        let saveImg = finishTrimCanvas.getContext("2d");
        finishTrimCanvas.width = width / image.canvasImgRatio
        finishTrimCanvas.height = height / image.canvasImgRatio
        saveImg.clearRect(0, 0, finishTrimCanvas.width, height / finishTrimCanvas.height);
        const data = resizeImg.getImageData(startX / image.canvasImgRatio, startY / image.canvasImgRatio, width / image.canvasImgRatio, height / image.canvasImgRatio)
        saveImg.putImageData(data, 0, 0)

        //get trimed data from original image (2nd canvas)and put to 4rd canvas for preview Icon

        let previewIconCanvas = document.getElementById("previewIconCanvas")
        previewIconCanvas.style.display = "block"
        let wrapper = document.getElementById("wrapper")
        wrapper.style.display = "block"
        let mycanvas = document.getElementById("mycanvas")
        mycanvas.style.display = "none"
        let trimBtn = document.getElementById("btn-trim")
        trimBtn.style.display = "none";
        let backBtn = document.getElementById("btn-back")
        backBtn.style.display = "inline-block";
        let uploadBtn = document.getElementById("btn-upload")
        uploadBtn.style.display = "inline-block"


        previewIconCanvas.width = width / image.canvasImgRatio
        previewIconCanvas.height = height / image.canvasImgRatio

        previewIconCanvas.getContext("2d").putImageData(data, 0, 0)
        //resize to desired size
        previewIconCanvas.style.width = (width > height ? 200 * (width / height) : 200) + "px"
        previewIconCanvas.style.height = (height > width ? 200 * (height / width) : 200) + "px"
    }

    function upload() {
        let finishTrimCanvas = document.getElementById("finishTrim");
        finishTrimCanvas.toBlob(async (blob) => {

            blob.lastModifiedDate = new Date();
            let imageURL = await imgurUpload(blob)
            console.log("updateIcon:" + imageURL)
            if (!imageURL) return
            socket.emit("updateIcon", { imageURL: imageURL })
            cancelTrim()
        })
    }

    async function imgurUpload(img) {
        let auth = 'Client-ID ' + "6a5e9804b828604";
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        let file = img
        var formdata = new FormData();
        formdata.append("image", file);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        let imageURL
        Spinner()
        await fetch("https://api.imgur.com/3/image", requestOptions)
            .then(response => response.json()
            )
            .then(result => {
                console.log(result)
                let img = document.createElement("img");
                img.classList.add("previewIcon");
                img.src = result.data.link;
                imageURL = result.data.link
            })

            .catch(error => console.log('error', error));
        console.log("uploaded to imgur")
        Spinner(false)
        return imageURL

    }
    function backToTrim() {
        let mycanvas = document.getElementById("mycanvas")
        mycanvas.style.display = "block"
        let wrapper = document.getElementById("wrapper")
        wrapper.style.display = "none"
        let trimBtn = document.getElementById("btn-trim")
        trimBtn.style.display = "inline-block"
        let backBtn = document.getElementById("btn-back")
        backBtn.style.display = "none"
        let uploadBtn = document.getElementById("btn-upload")
        uploadBtn.style.display = "none"
    }

    function cancelTrim() {
        freezeBlack(false)
        setTrimPosition({})
        let trimCanvasWrapper = document.getElementById("trimCanvasArea")
        trimCanvasWrapper.style.display = "none"
        let previewIcon = document.getElementById("previewIconCanvas")
        previewIcon.style.display = "none"
        backToTrim()
        document.getElementById("file-uploader").value = ""

    }
    let defaultIcon = "https://www.pngfind.com/pngs/m/93-938050_png-file-transparent-white-user-icon-png-download.png"
    return (
        <div className="settingPage">

            <div className="iconImgArea">
                <label htmlFor="file-uploader"><i className="fas fa-edit"></i></label>
                <div className="iconImg inSetting" style={{ backgroundImage: `url(${accountInfo.iconImage || defaultIcon})` }}></div>
            </div>
            <div>Name:{accountInfo.username}</div>

            <input type="file" id="file-uploader" data-target="file-uploader"
                accept="image/*" multiple="multiple" onChange={handleFiles} />
            <div id="trimCanvasArea">
                <div><button id="btn-cancel" onClick={cancelTrim}>X</button></div>
                <canvas id="mycanvas"
                    onMouseDown={mouseDownEvent}
                    onMouseMove={mouseMoveEvent}
                    onMouseUp={mouseRemoveEvent}
                    onTouchStart={mouseDownEvent}
                    onTouchMove={mouseMoveEvent}
                    onTouchEnd={mouseRemoveEvent}
                ></canvas>
                <div id="wrapper">
                    <canvas id="previewIconCanvas"></canvas>
                </div>
                <button id="btn-trim" className="btn-trim" onClick={() => getTrim()}>Trim {`&`} preview</button>
                <button id="btn-back" className="btn-back" onClick={() => backToTrim()}>Back</button>
                <button id="btn-upload" className="btn-upload" onClick={() => upload()}>upload</button>
            </div>
            <canvas id="resizeCanvas"></canvas>
            <canvas id="finishTrim" width="300" height="300"></canvas>
        </div>
    )
}

export default SettingPage