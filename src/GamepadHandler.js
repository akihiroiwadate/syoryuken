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
        
        let newRireki2 = [];
        if(newRireki[0] === 13 && newRireki[1] === 15){
          newRireki2.push("↘️");
        } else {
          switch(newRireki[0]){
            case 13: newRireki2.push("⬇️"); break;
            case 15: newRireki2.push("➡️"); break;
            case 3: newRireki2.push("🅟"); break;
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

  const checkCondition = () => {

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

  const PlaySound = () => {

  }

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
            checkCondition() && (
              <img src="./img/波動拳.png" alt="波動拳" style={{ width: "300px", height: "150px", border: "2px solid black" }}/>
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
