import React, { useEffect, useRef, useState } from 'react'

function getPositionsRandoom(count, width, height, radius){
  const point = [];
  while(point.length < count){
    const x = Math.random() * (width - 2 * radius) + radius;
    const y = Math.random() * (height - 2 * radius) + radius;

    point.push({x, y})

  }
  return point;
}
const GamePlay = () => {
   const Width= 700;
   const Height = 550;
   const radius = 20;
   const[gameStart, setGameStart] = useState(false);
   const[clickPoint, setClickPoint] = useState([]);
   const[positions, setPositions] = useState([]);
   const[nextNumber, setNextNumber] = useState(1);
   const[pointCount, setPointCount] = useState(10);
   const[allClear, setAllClear] = useState(false);
   const[gameover, setGameOver] = useState(false);
   const[ time, setTime] = useState(0);
   const [isAuto, setIsAuto] = useState(false);
   const StartGame = () =>{
     if(pointCount < 1) return;
     setGameStart(true);
     setNextNumber(1);
     setClickPoint([]);
     setTime(0);
     setAllClear(false);
     setGameOver(false);
     setPositions(getPositionsRandoom(pointCount, Width, Height, radius));
   }
   const timeRef = useRef();
   useEffect(()=>{
     if(gameStart){
        timeRef.current = setInterval(()=>{
           setTime(prevTime => prevTime + 0.1)
        },100)
     }else{
       clearInterval(timeRef.current);
     }
      return () => {clearInterval(timeRef.current)};
   }, [gameStart])
    const handleClickNum = (num) =>{
       if(!gameStart) return
       if(num === nextNumber){
         setClickPoint((prev) => [...prev, num]);
         if(num === pointCount){
           setGameStart(false);
           setAllClear(true)
           clearInterval(timeRef.current);
         }
         setNextNumber(num + 1);
       }
       if(num !== nextNumber){
          setGameStart(false);
          setGameOver(true);
          clearInterval(timeRef.current);
          return;
       }
    }
    const InputChange = (e) => {
      let val = parseInt(e.target.value);
      if(!isNaN(val)){
        setPointCount(val);
      }
    }
    const autoRef = useRef(null);
    const isAutoRef = useRef();
    const nextNumRef = useRef(1);
    useEffect(()=>{
       nextNumRef.current = nextNumber;
    }, [nextNumber])
    const autoClick = () => {
       if(!gameStart) return;
       if(isAuto) {
         setIsAuto(false);
         isAutoRef.current = false;
         clearTimeout(autoRef.current);
         return;
       }
       setIsAuto(true);
       isAutoRef.current = true;
       
       const run = (current)=> {
         if(!gameStart || !isAutoRef.current) return;
       setClickPoint((prev) => [...prev, current]);
       setNextNumber(current + 1);
       
       if(current === pointCount){
           setAllClear(true);
           setGameStart(false);
           setIsAuto(false)
           isAutoRef.current = false;
           clearInterval(timeRef.current);
           return;
        }
        autoRef.current = setTimeout(() => {
          run(current + 1)
        }, 300);
       } 
       run(nextNumRef.current);
    }
  return (
     <div style={{margin: 60, width: 1000, height: 600, display: "flex", border:"2px solid #333"}}>
        <div style={{position: "relative", width: Width, height: Height, marginLeft: 30, marginTop: 20, border:"2px solid #333"}}>
             {
              positions.map((pos, index)=>{
                const num = index + 1;
                if(clickPoint.includes(num)) return null;
                return(
                   <div onClick={()=>handleClickNum(num)} key={num} style={{position:"absolute", left: pos.x - radius, top: pos.y - radius, width: radius * 2, height: radius * 2,
                    borderRadius: "50%", border:"2px solid #333", display: "flex", justifyContent:"center", alignItems:"center", cursor: num === nextNumber ?"pointer": "default", backgroundColor: num === nextNumber ? "#e67e22" : "white",
                    userSelect: "none"
                   }}>
                         {num}
                   </div>
                )
              })
             }
        </div>
        <div style={{marginLeft: 50, textAlign:"center", alignItems: "center", width: 300, height: 500}}>
              <h1>{gameover ? <span style={{color: "#c0392b"}}>Game Over</span> : allClear ? "All Clear" : "Let Plays"}</h1>
              <div >
                 <h1>Point</h1>
                 <input type='number' onChange={InputChange} value={pointCount} disabled={gameStart} min={1} max={100}/>
              </div>
              <h1>Time:{time.toFixed(1)}s</h1>
              {!gameStart && (
                <button onClick={StartGame}>Start</button>
              ) }
              {gameStart&&(
                <div>
                  <button onClick={StartGame}>Restart</button>
                  <button onClick={autoClick}>autoClick</button>
                
                </div>
              )}
        </div>
     </div>
  )
}

export default GamePlay