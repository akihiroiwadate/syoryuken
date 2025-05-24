import React, { useState, useEffect } from 'react';

const GamepadHandler = () => {
  const [gamepadData, setGamepadData] = useState(null);
  const [gamepadRireki, setGamePadRireki] = useState([]);
  const [eienRireki, setEienRireki] = useState([]);
  const [showHadokenImage, setShowHadokenImage] = useState(false);
  const [showHadokenImage2, setShowHadokenImage2] = useState(false);
  const [showSinkuHadokenImage, setShowSinkuHadokenImage] = useState(false);
  const [showSyoryukenImage, setShowSyoryukenImage] = useState(false);
  const [showSyoryukenImage2, setShowSyoryukenImage2] = useState(false);
  const [SyoryukenCnt, setSyoryukenCnt] = useState(0);

  useEffect(() => {

    const updateGamepad = () => {

      const gamepads = navigator.getGamepads();
      if (gamepads[0]) {
        const gamepad = gamepads[0];
        const inputData = {
          buttons: gamepad.buttons.map((button, index) => ({
            index,
            pressed: button.pressed,
            value: button.value,
          })),
          axes: gamepad.axes,
        };
        setGamepadData(inputData);

        //入力されたボタンを変数に設定
        const newRireki = []; 
        gamepad.buttons.forEach((button, index) => {
          if(button.value === 1){
            newRireki.push(index);
          }
        });
        gamepad.axes.forEach((axis, index) => {
          if(index === 9 && axis.toFixed(2) !== "1.29") {
            newRireki.push(axis.toFixed(2))
          }
        });
        
        // 入力されたボタンを編集
        let newRireki2 = [];
        if(newRireki[0] === 13 && newRireki[1] === 15){
          newRireki2.push("↘️");
        } else if(newRireki[0] === 13 && newRireki[1] === 14) {
          newRireki2.push("↙️");
        } else {
          switch(newRireki[0]){
            case 13: newRireki2.push("⬇️"); break;
            case 14: newRireki2.push("⬅️"); break;
            case 15: newRireki2.push("➡️"); break;
            case "0.14": newRireki2.push("⬇️"); break;
            case "-0.14": newRireki2.push("↘️"); break;
            case "-0.43": newRireki2.push("➡️"); break;
            case 2: newRireki2.push("🅟"); break;
            case 3: newRireki2.push("🅟"); break;
            case 5: newRireki2.push("🅟"); break;
            default: newRireki2.push(newRireki[0]); break;
          }
        }
        let updatedRireki;
        const commandRireki = setGamePadRireki((prevRireki) => {
          if(newRireki2.length > 0) {
            if(newRireki2[0] !== undefined) {
              if(newRireki2[0] === prevRireki[0]){
                newRireki2[0] = undefined;
              }
            }
          }
  
          if(newRireki2[0] !== undefined) {
            updatedRireki =[...newRireki2, ...prevRireki];
            updatedRireki = updatedRireki.slice(0, 20);
          } else {
            updatedRireki = prevRireki;
          }


          if(checkSinkuHadoken(updatedRireki)) {
            updatedRireki = [];
            setShowSinkuHadokenImage(true);
            setTimeout(() => {
              setShowSinkuHadokenImage(false);
            }, 4300);
          } else if(checkHadoken(updatedRireki)) {
            updatedRireki = [];
            setShowHadokenImage(true);
            setTimeout(() => {
              setShowHadokenImage(false);
            }, 1200);
          }

          if(checkHadoken2(updatedRireki)) {
            updatedRireki = [];
            setShowHadokenImage2(true);
            setTimeout(() => {
              setShowHadokenImage2(false);
            }, 1200);
          }

          if(checkSyoryuken(updatedRireki)) {
            setSyoryukenCnt(prevCnt => prevCnt + 0.5);
            updatedRireki = [];
            setShowSyoryukenImage(true);
            setTimeout(() => {
              setShowSyoryukenImage(false);
            }, 1300);
          }

          if(checkSyoryuken2(updatedRireki)) {
            setSyoryukenCnt(prevCnt => prevCnt + 0.5);
            updatedRireki = [];
            setShowSyoryukenImage2(true);
            setTimeout(() => {
              setShowSyoryukenImage2(false);
            }, 1300);
          }

        

          if(updatedRireki.length === 1 && updatedRireki[0] === "🅟"){
            updatedRireki = [];
          }

          return updatedRireki;
        });

        let updatedcommandEienRireki;
        let commandEienRireki = setEienRireki((prevEienRireki) => {
          if(newRireki2.length > 0) {
            if(newRireki2[0] !== undefined) {
              if(newRireki2[0] === prevEienRireki[0]){
                newRireki2[0] = undefined;
              }
            }
          }
          if(newRireki2[0] !== undefined) {
            updatedcommandEienRireki = [...newRireki2, ...prevEienRireki].slice(0, 20);
          } else {
            updatedcommandEienRireki = prevEienRireki;
          }
          return updatedcommandEienRireki;
        })
  
      }


    };


    const handleGamepadConnect = () => {
      console.log("Gamepad connected!");
      const interval = setInterval(updateGamepad, 40);
      return () => clearInterval(interval);
    };

    const handleGamepadDisconnect = () => {
      console.log("Gamepad disconnected!");
      setGamepadData(null);
      setGamePadRireki(null);
    };

    window.addEventListener("gamepadconnected", handleGamepadConnect);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnect);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnect);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnect);
    };
  }, []);

  const checkHadoken = (gamepadRireki) => {
    if(gamepadRireki === undefined) return false;
    for(let i = 0; i < gamepadRireki.length; i++) {
      if (gamepadRireki[i] === "🅟" && 
        gamepadRireki[i + 1] === "➡️" && 
        gamepadRireki[i + 2] === "↘️" &&
        gamepadRireki[i + 3] === "⬇️" 
      ) {
        return true; // 条件が満たされた場合
      }
    }
    return false;
  };

  const checkHadoken2 = (gamepadRireki) => {
    if(gamepadRireki === undefined) return false;
    for(let i = 0; i < gamepadRireki.length; i++) {
      if (gamepadRireki[i] === "🅟" && 
        gamepadRireki[i + 1] === "⬅️" && 
        gamepadRireki[i + 2] === "↙️" &&
        gamepadRireki[i + 3] === "⬇️" 
      ) {
        return true; // 条件が満たされた場合
      }
    }
    return false;
  };

  const checkSinkuHadoken = (gamepadRireki) => {
    if(gamepadRireki === undefined) return false;
    for(let i = 0; i < gamepadRireki.length; i++) {
      if (gamepadRireki[i] === "🅟" && 
        gamepadRireki[i + 1] === "➡️" && 
        gamepadRireki[i + 2] === "↘️" &&
        gamepadRireki[i + 3] === "⬇️" &&
        gamepadRireki[i + 4] === "➡️" &&
        gamepadRireki[i + 5] === "↘️" &&
        gamepadRireki[i + 6] === "⬇️"
      ) {
        return true; // 条件が満たされた場合
      }
    }
    return false;
  };

  const checkSinkuHadoken2 = (gamepadRireki) => {
    if(gamepadRireki === undefined) return false;
    for(let i = 0; i < gamepadRireki.length; i++) {
      if (gamepadRireki[i] === "🅟" && 
        gamepadRireki[i + 1] === "⬅️" && 
        gamepadRireki[i + 2] === "↙️" &&
        gamepadRireki[i + 3] === "⬇️" 
      ) {
        return true; // 条件が満たされた場合
      }
    }
    return false;
  };

  const checkSyoryuken = (gamepadRireki) => {
    if(gamepadRireki === undefined) return false;
    for(let i = 0; i < gamepadRireki.length; i++) {
      if (gamepadRireki[i] === "🅟" && 
        gamepadRireki[i + 1] === "↘️" && 
        gamepadRireki[i + 2] === "⬇️" &&
        gamepadRireki[i + 3] === "➡️" 
      ) {
        return true; // 条件が満たされた場合
      }
    }
    return false;
  };

  const checkSyoryuken2 = (gamepadRireki) => {
    if(gamepadRireki === undefined) return false;
    for(let i = 0; i < gamepadRireki.length; i++) {
      if (gamepadRireki[i] === "🅟" && 
        gamepadRireki[i + 1] === "↙️" && 
        gamepadRireki[i + 2] === "⬇️" &&
        gamepadRireki[i + 3] === "⬅️" 
      ) {
        return true; // 条件が満たされた場合
      }
    }
    return false;
  };


  const playSoundHadoken = () => {
    const audio = new Audio('./sound/波動拳音.m4a');
    audio.play();
  };

  const playSoundSinkuHadoken = () => {
    const audio = new Audio('./sound/真空波動拳音.m4a');
    audio.play();
  };

  const playSoundSyohuken = () => {
    const audio = new Audio('./sound/昇竜拳音.m4a');
    audio.play();
  };


  return (
    <div>
      <h2>世界の昇竜拳：{SyoryukenCnt}</h2>
      {gamepadRireki ? (
        <div style={{display: "flex", gap: "10px"}}>
          <div>
            <p>{eienRireki.map((rireki) => (
              <p>{rireki}</p>
              ))}
            </p>
          </div>          
          {/* 波動拳画像表示 */}
          <div>
            <p>{
              showHadokenImage && (
                <img src="./img/波動拳アニメ.gif" alt="波動拳" onLoad={playSoundHadoken} style={{ border: "2px solid black" } }/>
              )}
            </p>
            <p>{
              showHadokenImage2 && (
                <div style={{transform: "scaleX(-1)"}}>
                  <img src="./img/波動拳アニメ.gif" alt="波動拳" onLoad={playSoundHadoken} style={{ border: "2px solid black" } }/>
                </div>
              )}
            </p>
            <p>{
              showSyoryukenImage && (
                <img src="./img/昇竜拳アニメ.gif" alt="昇竜拳" onLoad={playSoundSyohuken} style={{ border: "2px solid black" }}/>
              )}
            </p>
            <p>{
              showSyoryukenImage2 && (
                <div style={{transform: "scaleX(-1)"}}>
                  <img src="./img/昇竜拳アニメ.gif" alt="昇竜拳" onLoad={playSoundSyohuken} style={{ border: "2px solid black" }}/>
                </div>
              )}
            </p>
            <p>{
              showSinkuHadokenImage && (
                <div style={{transform: "scaleX(-1)"}}>
                  <img src="./img/真空波動拳アニメ.gif" alt="真空波動拳" onLoad={playSoundSinkuHadoken} style={{ border: "2px solid black" } }/>
                </div>
              )}
            </p>
          </div>
        </div>
      ) : (
        <p>ゲームパッドを接続してください！</p>
      )}

    </div>
  );
};

export default GamepadHandler;
