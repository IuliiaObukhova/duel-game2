import { useState } from 'react'
import "./index.css";
import DuelCanvas from "./DuelCanvas";
import ControlPanel from "./ControlPanel";
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const HERO_1_COLOR="blue";
const HERO_2_COLOR="green";
const App = () => {
  const [hero1Speed, setHero1Speed] = useState(2);
  const [hero2Speed, setHero2Speed] = useState(2);
  const [hero1Frequency, setHero1Frequency] = useState(2);
  const [hero2Frequency, setHero2Frequency] = useState(2);

  return (<>
      <ControlPanel
        speed={ hero1Speed} 
        setSpeed={setHero1Speed}
        frequency={hero1Frequency}
        setFrequency={setHero1Frequency}
      />
      <ControlPanel
        speed={hero2Speed}
        setSpeed={setHero2Speed}
        frequency={hero2Frequency}
        setFrequency={setHero2Frequency}
      />
      <DuelCanvas
      canvasWidth={CANVAS_WIDTH}
      canvasHeight={CANVAS_HEIGHT}
      hero1Color={HERO_1_COLOR}
      hero2Color={HERO_2_COLOR}

        hero1Speed={hero1Speed}
        hero2Speed={hero2Speed}
        hero1ShootFreq={hero1Frequency}
        hero2ShootFreq={hero2Frequency}
      /></>      
  );
};

export default App
