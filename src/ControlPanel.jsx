import React from "react";
const MIN_SPEED=1;
const MAX_SPEED=5;
const MIN_FREQUENCY=1;
const MAX_FREQUENCY=10;

const ControlPanel = ({ speed,setSpeed,frequency,setFrequency }) => {
  return (
    <div style={{ margin: "10px" }}>
      <label>Movement Speed:</label>
      <input
        type="range"
        min={MIN_SPEED}
        max={MAX_SPEED}
        value={speed}
        onChange={(e) => setSpeed(parseInt(e.target.value))}
      />
      <label>Shooting Frequency:</label>
      <input
        type="range"
        min={MIN_FREQUENCY}
        max={MAX_FREQUENCY}
        value={frequency}
        onChange={(e) => setFrequency(parseInt(e.target.value))}
      />
    </div>
  );
};

export default ControlPanel;
