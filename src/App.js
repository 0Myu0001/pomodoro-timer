import * as React from "react";
import "./App.css";
import { motion } from "framer-motion";

const App = () => {
  const [lightmode, setlightmode] = React.useState(true);
  const [autoStartOperation, setAutoStartOperation] = React.useState(true);
  const [autoStartBreak, setAutoStartBreak] = React.useState(true);
  const [mute, setMute] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const [workTime, setWorkTime] = React.useState(25); // 作業時間（分）
  const [breakTime, setBreakTime] = React.useState(5); // 休憩時間（分）
  const [cycles, setCycles] = React.useState(4); // 繰り返し回数
  const [currentCycle, setCurrentCycle] = React.useState(1); // 現在のサイクル
  const [isWorkTime, setIsWorkTime] = React.useState(true); // 現在が作業時間かどうか

  React.useEffect(() => {
    if (lightmode) {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    } else {
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
    }
  }, [lightmode]);

  const toggleLightMode = () => {
    setlightmode(!lightmode);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const totalTime = isWorkTime ? workTime * 60 : breakTime * 60;
  const [time, setTime] = React.useState(totalTime);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    let interval;
    if (running && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (isWorkTime) {
        if (currentCycle < cycles) {
          setIsWorkTime(false);
          setTime(breakTime * 60);
        } else {
          setRunning(false);
        }
      } else {
        setIsWorkTime(true);
        setCurrentCycle((prevCycle) => prevCycle + 1);
        setTime(workTime * 60);
      }
    }
    return () => clearInterval(interval);
  }, [running, time, isWorkTime, currentCycle, cycles, workTime, breakTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const radius = 160;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (time / totalTime) * circumference;
  return (
    <div className="App">
      <div className="header">
        <button onClick={toggleMenu}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1>Pomodoro Timer</h1>
        <button onClick={toggleLightMode}>
          {lightmode ? (
            <span className="material-symbols-outlined">light_mode</span>
          ) : (
            <span className="material-symbols-outlined">dark_mode</span>
          )}
        </button>
      </div>
      {menuVisible ? (
        <div className="menu">
          <h3 style={{ margin: "0" }}>Settings</h3>
          <div className="setting">
            <p>Work</p>
            <md-outlined-text-field
              type="number"
              value="25"
              suffix-text="min"
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Break</p>
            <md-outlined-text-field
              type="number"
              value="5"
              suffix-text="min"
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Long Break</p>
            <md-outlined-text-field
              type="number"
              value="15"
              suffix-text="min"
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Cycle</p>
            <md-outlined-text-field
              type="number"
              value="4"
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Automatic start of next operation</p>
            <md-switch
              selected={autoStartOperation}
              onChange={() => setAutoStartOperation(!autoStartOperation)}
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Automatic start of next break</p>
            <md-switch
              selected={autoStartBreak}
              onChange={() => setAutoStartBreak(!autoStartBreak)}
              style={{ margin: "auto 0 auto 0" }}
              className="md-switch"
            />
          </div>
          <div className="setting">
            <p>Mute</p>
            <md-switch
              selected={mute}
              onChange={() => setMute(!mute)}
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
        </div>
      ) : (
        <div className="timer">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", width: 400, height: 400 }}>
              <svg
                width="400"
                height="400"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="200"
                  cy="200"
                  r={radius}
                  stroke="gray"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="200"
                  cy="200"
                  r={radius}
                  stroke="orange"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: progress }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                  color: "white",
                }}
              >
                {formatTime(time)}
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              {running ? (
                <button
                  onClick={() => setRunning(!running)}
                  style={{ backgroundColor: "#3030B8" }}
                >
                  <span className="material-symbols-outlined">pause</span>
                </button>
              ) : (
                <div style={{ display: "flex" }}>
                  <button
                    onClick={() => setRunning(!running)}
                    style={{ backgroundColor: "#3030B8" }}
                  >
                    <span className="material-symbols-outlined">
                      play_arrow
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setTime(totalTime);
                      setRunning(false);
                    }}
                    style={{ marginLeft: 10, backgroundColor: "#3030B8" }}
                  >
                    <span className="material-symbols-outlined">replay</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
