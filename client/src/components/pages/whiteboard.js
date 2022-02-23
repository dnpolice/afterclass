import React, { useRef, useEffect, useState } from 'react'
import { PhotoshopPicker } from 'react-color';

// class Lines {
//     constructor(prevX, prevY, x, y) {
//         this.prevX = x,
//         this.prevY = prevY,
//         this.x = prev.y,
//         this.y = prev
//     }
// }

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const context = useRef(null);

    const [mouseDown, setMouseDown] = useState(false);
    const [drawingColor, setDrawingColor] = useState("#FFFFFF");
    const [lastBufferTime, setLastBufferTime] = useState(undefined);
    const [bufferedMoves, setBufferedMoves] = useState([]);
    const [openColorPicker, setOpenColorPicker] = useState(false);
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
            context.current.lineWidth = 10;
            context.current.lineJoin = "round";
            context.current.beginPath();
            context.current.moveTo(prevPosition.x, prevPosition.y);
            console.log(prevPosition);
            console.log(x, y);
            context.current.lineTo(x, y);
            context.current.closePath();
            context.current.stroke();

            bufferedMoves.push([prevPosition.x, prevPosition.y, x, y]);
            setPrevPosition({x, y});
            setLastBufferTime(date.getTime());
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
        setBufferedMoves([]);
    };
    

    return (
        <div id="whiteboard">
            <canvas
                id="canvas"
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
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
            <div id="sideBar">
                <div onClick={() => setOpenColorPicker(true)}>
                </div>
                <div>
                    
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Whiteboard
