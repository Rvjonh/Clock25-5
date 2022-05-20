import { useState, useEffect, useRef } from 'react';
import './app.scss';

import upButton from './assets/up.png';
import downButton from './assets/down.png';
import AlarmBeep from './alarm-beep.mp3';

import playButton from './assets/play.png';
import pausaButton from './assets/pausa.png';
import resetButton from './assets/reset.png';

import logoTwitter from './assets/logho.png';

function useInterval(callback, delay){
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function App(){
    const alarmTag = useRef(null)

    const [state, setState] = useState({
        breakLength : 5,
        sessionLength : 25,
        timeType : "Session", //or Break
        timeLeft : "25:00",
        running : false
    })

    const [paint, setPaint] = useState({
        timeLabel:false
    });

    const handleDecrementBreak = ()=>{
        if (state.breakLength-1 > 0 && state.breakLength-1<=60){
            setState({...state, breakLength: state.breakLength-1})
        }
    }
    const handleIncrementBreak = ()=>{
        if (state.breakLength+1 >0 && state.breakLength+1<=60){
            setState({...state, breakLength: state.breakLength+1})
        }
    }

    const handleDecrementSession = ()=>{
        if (state.sessionLength-1 > 0 && state.sessionLength-1<=60){
            setState({...state, 
                sessionLength: state.sessionLength-1,
                timeLeft : `${getFormatedTime(state.sessionLength-1)}:00`
            })
        }
    }
    const handleIncrementSession = ()=>{
        if (state.sessionLength+1 >0 && state.sessionLength+1<=60){
            setState({...state, 
                sessionLength: state.sessionLength+1,
                timeLeft : `${getFormatedTime(state.sessionLength+1)}:00`
            })
        }
    }
    
    const handleStartStopClock = ()=>{
        setState({...state, running: !state.running,})
    }
    useInterval(()=>{
        decreaseTime()
    }, state.running ? 1000 : null)

    const decreaseTime = ()=>{
        let time = state.timeLeft.split(":");
        let mm = parseInt(time[0])
        let ss = parseInt(time[1])

        //it goes reducing by 1 second, and 1 minute every 59 seconds (obviously)
        if (ss>=1){
            ss--;
        }else{
            mm--;
            ss=59;
        }

        //just to change the color of the text-label to red, when it's lower than 1 minute
        if (mm===0){
            setPaint({timeLabel:true});
        }else{
            setPaint({timeLabel:false});
        }

        if (mm ===0 && ss===0){
            playAlarm()
        }

        if (canChangedToBreak(mm, ss)){
            setState({...state,
                timeType:"Break",
                timeLeft: `${getFormatedTime(state.breakLength)}:00`
            })
        }else if(canChangedToSession(mm, ss)){
            setState({...state,
                timeType:"Session",
                timeLeft: `${getFormatedTime(state.sessionLength)}:00`
            })
        }else{
            setState({...state, timeLeft: `${getFormatedTime(mm)}:${getFormatedTime(ss)}`})
        }
    }
    const playAlarm=()=>{
        alarmTag.current.play();
    }
    const stopAlarm=()=>{
        alarmTag.current.pause();
        alarmTag.current.currentTime = 0;
    }

    const canChangedToBreak=(mm, ss)=>{
        return mm<0 && ss===59 && state.timeType ==="Session";
    }
    const canChangedToSession=(mm, ss)=>{
        return mm<0 && ss===59 && state.timeType ==="Break"
    }
    const getFormatedTime=(num)=>{
        return num<=9 ? "0"+num : num;
    }

    const handleResetClock = ()=>{
        setState({
            ...state,
            breakLength : 5,
            sessionLength : 25,
            timeType : "Session",
            timeLeft : "25:00",
            running : false
        })
        stopAlarm();
    }

    return(
        <div className='body'>

        <div className={`main ${paint.timeLabel? "finishing-main":""}`}>
            <h2 className='title'>Clock 25 + 5</h2>

            <div className='containers'>
                <div className='braek-container'>
                    <div id="break-label">Break Length</div>
                    <button className='button-options' onClick={handleIncrementBreak} id="break-increment" disabled={state.running}>
                        <img src={upButton} alt="button to increase the break length"/>
                    </button>
                    <span id="break-length">{state.breakLength}</span>
                    <button className='button-options' onClick={handleDecrementBreak} id="break-decrement" disabled={state.running}>
                        <img src={downButton} alt="button to decrease the break length"/>
                    </button>
                </div>

                <div className='session-container'>
                    <div id="session-label" className=''>Session Label</div>
                    <button className='button-options' onClick={handleIncrementSession} id="session-increment" disabled={state.running}>
                        <img src={upButton} alt="button to increase the break length"/>
                    </button>
                    <span id="session-length">{state.sessionLength}</span>
                    <button className='button-options' onClick={handleDecrementSession} id="session-decrement" disabled={state.running}>
                        <img src={downButton} alt="button to decrease the break length"/>
                    </button>
                </div>
            </div>

            <div className='clock'>
                <span className='time-type' id="timer-label">{state.timeType}</span>
                <span className={`time-left ${paint.timeLabel? "finishing":""}`} id="time-left">{state.timeLeft}</span>
            </div>

            <div className='clock-controls'>
                <button className='button-controls' onClick={handleStartStopClock} id="start_stop">
                    <img src={state.running? pausaButton:playButton} alt="play or pause the clock" />
                </button>
                <button className='button-controls' onClick={handleResetClock} id="reset">
                    <img src={resetButton} alt="reset the clock" />
                </button>
            </div>
            <audio src={AlarmBeep} id="beep" ref={alarmTag}></audio>
        </div>
        <h6 className='contact'><a href='https://twitter.com/Rvjonh' rel="noreferrer" target="_blank">Author: Jonh R. Gomez <img className='small-img' src={logoTwitter} alt="my twiter account"/></a></h6>

        </div>
    )
}