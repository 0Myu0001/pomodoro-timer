import * as React from "react";
import "./App.css";
import { motion } from "framer-motion";
import { Switch, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';

const App = () => {
  // display mode
  const [lightmode, setlightmode] = React.useState(true);

  React.useEffect(() => {
    if (lightmode) {
      document.body.classList.remove("dark-mode");
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    } else {
      document.body.classList.add("dark-mode");
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
    }
  }, [lightmode]);

  const toggleLightMode = () => {
    setlightmode(!lightmode);
  };

  // menu
  const [autoStartOperation, setAutoStartOperation] = React.useState(true);
  const [autoStartBreak, setAutoStartBreak] = React.useState(true);
  const [mute, setMute] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // timer logic
  const [workTime, setWorkTime] = React.useState(25);
  const [breakTime, setBreakTime] = React.useState(5);
  const [longBreakTime, setLongBreakTime] = React.useState(15);
  const [cycles, setCycles] = React.useState(4);
  const [currentCycle, setCurrentCycle] = React.useState(1);
  const [isWorkTime, setIsWorkTime] = React.useState(true);

  const [tempWorkTime, setTempWorkTime] = React.useState(workTime);
  const [tempBreakTime, setTempBreakTime] = React.useState(breakTime);
  const [tempLongBreakTime, setTempLongBreakTime] =
    React.useState(longBreakTime);
  const [tempCycles, setTempCycles] = React.useState(cycles);

  const handleSetClick = () => {
    setWorkTime(tempWorkTime);
    setBreakTime(tempBreakTime);
    setLongBreakTime(tempLongBreakTime);
    setCycles(tempCycles);
    setMenuVisible(false);
  };

  const totalTime = isWorkTime ? workTime * 60 : breakTime * 60;
  const [time, setTime] = React.useState(totalTime);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    setTime(isWorkTime ? workTime * 60 : breakTime * 60);
  }, [workTime, breakTime, isWorkTime]);

  React.useEffect(() => {
    let interval;
    if (running && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (!mute) {
        const chime = new Audio("chime.mp3");
        chime.playbackRate = 1.25;
        chime.play();
        setTimeout(() => {
          chime.pause();
          chime.currentTime = 0;
        }, 10000);
      }

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
            <TextField
              type="number"
              value={tempWorkTime}
              onChange={(e) =>
                setTempWorkTime(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
              }}
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Break</p>
            <TextField
              type="number"
              value={tempBreakTime}
              onChange={(e) =>
                setTempBreakTime(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
              }}
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Long Break</p>
            <TextField
              type="number"
              value={tempLongBreakTime}
              onChange={(e) =>
                setTempLongBreakTime(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
              }}
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Cycle</p>
            <TextField
              type="number"
              value={tempCycles}
              onChange={(e) =>
                setTempCycles(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              style={{ margin: "auto 0 auto 0" }}
            />
          </div>
          <div className="setting">
            <p>Automatic start for next work</p>
            <Switch
              defaultChecked={autoStartOperation}
              onChange={() => setAutoStartOperation(!autoStartOperation)}
              sx={{ my: "auto" }}
            />
          </div>
          <div className="setting">
            <p>Automatic start for next break</p>
            <Switch
              defaultChecked={autoStartBreak}
              onChange={() => setAutoStartBreak(!autoStartBreak)}
              sx={{ my: "auto" }}
              className="md-switch"
            />
          </div>
          <div className="setting">
            <p>Mute</p>
            <Switch
              defaultChecked={mute}
              onChange={() => setMute(!mute)}
              sx={{ my: "auto" }}
            />
          </div>
          <md-filled-button onClick={handleSetClick}>Set</md-filled-button>
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
                  stroke="#3700b3"
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
              <p>{isWorkTime ? "Work Progress" : "Rest Progress"}</p>
              <p>
                Cycle: {currentCycle}/{cycles}
              </p>
              {running ? (
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <button
                    onClick={() => setRunning(!running)}
                    style={{ backgroundColor: "#3030B8" }}
                  >
                    <span className="material-symbols-outlined">pause</span>
                  </button>
                </div>
              ) : (
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <button
                    onClick={() => {
                      setTime(totalTime);
                      setRunning(false);
                    }}
                    style={{ backgroundColor: "#3030B8" }}
                  >
                    <span className="material-symbols-outlined">replay</span>
                  </button>
                  <button
                    onClick={() => setRunning(!running)}
                    style={{ marginLeft: 10, backgroundColor: "#3030B8" }}
                  >
                    <span className="material-symbols-outlined">
                      play_arrow
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setTime(totalTime);
                      setCurrentCycle(1);
                      setIsWorkTime(true);
                      setRunning(false);
                    }}
                    style={{ marginLeft: 10, backgroundColor: "#3030B8" }}
                  >
                    <span className="material-symbols-outlined">
                      restart_alt
                    </span>
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
