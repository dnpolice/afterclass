import React, { useRef, useEffect, useState } from 'react'
import { PhotoshopPicker } from 'react-color';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const context = useRef(null);

    const [mouseDown, setMouseDown] = useState(false);
    const [drawingColor, setDrawingColor] = useState("#000000");
    const [lastBufferTime, setLastBufferTime] = useState(undefined);
    const [bufferedMoves, setBufferedMoves] = useState([]);
    const [openColorPicker, setOpenColorPicker] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
    const [prevPosition, setPrevPosition] = useState({
        x: undefined,
        y: undefined
    });

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext('2d');
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    }, [])

    const drawLine = (x, y) => {
        const date = new Date();
        if (mouseDown && !openColorPicker && date.getTime() - lastBufferTime > 10) {
            context.current.strokeStyle = drawingColor;
            context.current.lineWidth = getDrawingWidth();
            context.current.lineJoin = "round";
            context.current.beginPath();
            context.current.moveTo(prevPosition.x, prevPosition.y);
            context.current.lineTo(x, y);
            context.current.closePath();
            context.current.stroke();

            const line = getLineJson(prevPosition.x, prevPosition.y, x, y);
            setBufferedMoves(prevBufferedMoves => [...prevBufferedMoves, line]);
            setPrevPosition({x, y});
            setLastBufferTime(date.getTime());
        }
    }

    const getLineJson = (startingPositionX, startingPositionY, finalPositionX, finalPositionY) => {
        return {
            startingPositionX,
            startingPositionY,
            finalPositionX,
            finalPositionY
        }
    }

    const onMouseDown = event => {
        setMouseDown(true);
        setPrevPosition({x: event.pageX, y: event.pageY});

        const date = new Date();
        setLastBufferTime(date.getTime());
    }

    const onMouseMove = event => {
        drawLine(event.pageX, event.pageY);
        if (bufferedMoves.length > 10) sendBufferList();
    }

    const onMouseUp = event => {
        setMouseDown(false);
        if (bufferedMoves.length > 0) sendBufferList();
    }

    const changeDrawingColor = color => {
        setDrawingColor(color.hex);
        setOpenColorPicker(false);        
    }
    
    const sendBufferList = () => {
        console.log(bufferedMoves);

        setBufferedMoves([]);
    };

    const toggleBackgroundColor = () => {
        if (backgroundColor === "#FFFFFF") {
            setBackgroundColor("#000000");
            if (drawingColor === "#000000") setDrawingColor("#FFFFFF");
        } else {
            setBackgroundColor("#FFFFFF");
            if (drawingColor === "#FFFFFF") setDrawingColor("#000000");
        }
    }

    const getDrawingWidth = () => {
        if (context.current.globalCompositeOperation === 'source-over') return 10;
        return 72;
    }

    const setToDraw = () => { context.current.globalCompositeOperation = 'source-over' }

    const setToErase = () => { context.current.globalCompositeOperation = 'destination-out' }
    

    return (
        <div id="whiteboard">
            <canvas
                id="canvas"
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                style={{backgroundColor: backgroundColor}}
            />
            {openColorPicker ?
                <div id="colorPicker">
                    <PhotoshopPicker
                        color={drawingColor}
                        onChangeComplete={(color) => changeDrawingColor(color)}
                    />
                </div>
                : null
            }
            <div className="sidebar">
                <ul>
                    <li onClick={() => setToDraw()}>Pencil</li>
                    <li onClick={() => setToErase()}>Eraser</li>
                    <li>Color</li>
                    <li>Width</li>
                    <li onClick={() => toggleBackgroundColor()}>Mode</li>
                </ul>
            </div>     
            {/* <div id="sideBar">
                <div onClick={() => setOpenColorPicker(true)}>
                </div>
                <div>
                    
                </div>
                <div>
                    
                </div>
            </div> */}
        </div>
    )
}

export default Whiteboard
