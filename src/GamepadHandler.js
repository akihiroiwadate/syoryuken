import React, { useState, useEffect } from 'react';

const GamepadHandler = () => {
  const [gamepadData, setGamepadData] = useState(null);
  const [gamepadRireki, setGamePadRireki] = useState([]);

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
        gamepad.buttons.map((button, index) => {
            if(button.value === 1) {
              newRireki.push(index);
              return {
                index,
                pressed: button.pressed,
                value: button.value,
              }
            }
            return {
              index,
              pressed: button.pressed,
              value: button.value,
            };
        });
        gamepad.axes.map((axis, index) => {
            if(index === 9 && axis.toFixed(2) !== "1.29") {
              newRireki.push(axis.toFixed(2))
            }
        })
        
        let newRireki2 = [];
        if(newRireki[0] === 13 && newRireki[1] === 15){
          newRireki2.push("↘️");
        } else {
          switch(newRireki[0]){
            case 13: newRireki2.push("⬇️"); break;
            case 15: newRireki2.push("➡️"); break;
            case "0.14": newRireki2.push("⬇️"); break;
            case "-0.14": newRireki2.push("↘️"); break;
            case "-0.43": newRireki2.push("➡️"); break;
            case 0: newRireki2.push("🅟"); break;
            case 3: newRireki2.push("🅟"); break;
            case 5: newRireki2.push("🅟"); break;
            default: newRireki2.push(newRireki[0]); break;
          }
          
        }

        setGamePadRireki((prevRireki) => {
          const updatedRireki =[...newRireki2, ...prevRireki];
          return updatedRireki.slice(0, 20);
        });
      }
    };

    const handleGamepadConnect = () => {
      console.log("Gamepad connected!");
      const interval = setInterval(updateGamepad, 60);
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

  const checkHadoken = () => {
    for(let i = 1; i < gamepadRireki.length; i++) {
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

  const checkSyoryuken = () => {
    for(let i = 1; i < gamepadRireki.length; i++) {
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

  const playSoundHadoken = () => {
    const audio = new Audio('./sound/波動拳音.m4a');
    audio.play();
  };

  const playSoundSyohuken = () => {
    const audio = new Audio('./sound/昇竜拳音.m4a');
    audio.play();
  };


  return (
    <div>
      <h2>波動拳</h2>
      {gamepadRireki ? (
        <div>
          <p>{gamepadRireki.map((rireki) => (
            <p>{rireki}</p>
            ))}
          </p>
          {/* 波動拳画像表示 */}
          <p>{
            checkHadoken() && (
              <img src="./img/波動拳アニメ.gif" alt="波動拳" onLoad={playSoundHadoken} style={{ border: "2px solid black" } }/>
            )}
          </p>
          <p>{
            checkSyoryuken() && (
              <img src="./img/昇竜拳アニメ.gif" alt="昇竜拳" onLoad={playSoundSyohuken} style={{ border: "2px solid black" }}/>
            )}
          </p>

        </div>
      ) : (
        <p>ゲームパッドを接続してください！</p>
      )}

    </div>
  );
};

export default GamepadHandler;
