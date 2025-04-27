import React, { useState, useEffect } from 'react';

const GamepadHandler = () => {
  const [gamepadData, setGamepadData] = useState(null);

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
      }
    };

    const handleGamepadConnect = () => {
      console.log("Gamepad connected!");
      const interval = setInterval(updateGamepad, 100);
      return () => clearInterval(interval);
    };

    const handleGamepadDisconnect = () => {
      console.log("Gamepad disconnected!");
      setGamepadData(null);
    };

    window.addEventListener("gamepadconnected", handleGamepadConnect);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnect);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnect);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnect);
    };
  }, []);

  return (
    <div>
      <h2>Gamepad Input</h2>
      {gamepadData ? (
        <div>
          <h3>Buttons:</h3>
          <ul>
            {gamepadData.buttons.map((button) => (
              <li key={button.index}>
                Button {button.index}: {button.pressed ? "Pressed" : "Not Pressed"} (Value: {button.value})
              </li>
            ))}
          </ul>
          <h3>Axes:</h3>
          <ul>
            {gamepadData.axes.map((axis, index) => (
              <li key={index}>
                Axis {index}: {axis.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>ゲームパッドを接続してください！</p>
      )}
    </div>
  );
};

export default GamepadHandler;
