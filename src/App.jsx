import { useState } from 'react';
import './App.css';
import useStickyState from "./useStickyState"
import useInterval from './useInterval'; // Asegúrate de importar el nuevo hook aquí


function App() {
  const [leaderboard, setLeaderboard] = useStickyState([], "leaderboard");
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  // Nuevos estados y lógica para el temporizador
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  useInterval(() => {
    if (running) {
      setTimer(prevTime => prevTime + 1);
    }
  }, 1);

  const startTimer = () => setRunning(true);
  const pauseTimer = () => setRunning(false);
  const resetTimer = () => {
    setRunning(false);
    setTimer(0);
  };
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(time % 1000).padStart(4, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };
  const removeRecord = (indexToRemove) => {
    setLeaderboard((prevLeaderboard) =>
      prevLeaderboard.filter((_, index) => index !== indexToRemove)
    );
  };


  const addRecord = () => {
    const timeParts = time.split(':');
    if (timeParts.length !== 3) {
      alert('Por favor, ingrese el tiempo en formato MM:SS:MMMM');
      return;
    }
    const totalMilliseconds =
      parseInt(timeParts[0], 10) * 60 * 1000 +  // minutos a milisegundos
      parseInt(timeParts[1], 10) * 1000 +       // segundos a milisegundos
      parseInt(timeParts[2], 10);               // milisegundos

    const newRecord = { name, time: totalMilliseconds, displayTime: time };
    setLeaderboard(oldLeaderboard => [...oldLeaderboard, newRecord].sort((a, b) => a.time - b.time));
    setName("");
    setTime("");
  };

  const copyTimeToClipboard = async () => {
    const formattedTime = formatTime(timer);
    try {
      await navigator.clipboard.writeText(formattedTime);
      console.log('Tiempo copiado al portapapeles');
    } catch (err) {
      console.error('No se pudo copiar el tiempo', err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-800 via-purple-500 to-red-500 animate-gradient-x w-screen h-screen flex flex-col items-center justify-start pt-16">

      <img src="../public/vite.svg" className="w-40 h-40 absolute top-10 left-20" />

      <h1 className="text-7xl font-bold underline">Leaderboard</h1>
      <div className='flex w-full justify-center gap-8 my-8'>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          className='backdrop-blur-md bg-white/20 text-white px-4 border placeholder:text-slate-100 rounded-xl hover:border-blue-800 hover:border-2 shadow-xl box-border w-96 h-12'
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tiempo MM:SS:MMMM"
          value={time}
          className='backdrop-blur-md bg-white/20 text-white px-4 border placeholder:text-slate-100 rounded-xl hover:border-red-500 hover:border-2 shadow-xl box-border w-80 h-12'
          onChange={(e) => setTime(e.target.value)}
        />
        <button
          className='rounded-xl hover:border-purple-600 hover:border-2 m-0 box-border w-32 h-12'
          onClick={addRecord}>Agregar</button>
      </div>
      <div className='flex items-center gap-4 mb-10'>
        <button
          className='rounded-xl hover:border-blue-800 hover:border-2 m-0 box-border w-32 h-12 bg-white/10 backdrop-blur-md border-white border-1'
          onClick={startTimer}>Iniciar</button>
        <button
          className='rounded-xl hover:border-red-500 hover:border-2 m-0 box-border w-32 h-12 bg-white/20 backdrop-blur-md border-white border-1'
          onClick={pauseTimer}>Pausar</button>
        <button
          className='rounded-xl hover:border-purple-600 hover:border-2 m-0 box-border w-32 h-12 bg-white/30 backdrop-blur-md border-white border-1'
          onClick={resetTimer}>Reiniciar</button>
        <div
          onClick={copyTimeToClipboard}
          className='backdrop-blur-md bg-white/20 text-white px-4 border placeholder:text-slate-100 rounded-xl hover:border-purple-600 hover:border-2 shadow-xl box-border w-60 h-12 flex items-center justify-center text-xl'
        >{formatTime(timer)}</div>
      </div>
      <div className='w-screen p-0 m-0 flex-row items-start justify-center h-fit'>
        <div>
          <ul
            className='backdrop-blur-xl bg-white/10 flex flex-row items-center justify-between  text-white text-xl font-bold w-screen px-32'
          >
            <li className='w-40'>Posición</li>
            <li className='w-90'>Nombre</li>
            <li className='w-40'
            >Tiempo</li>
          </ul>
        </div>
        <div

        >
          {leaderboard.map((record, index) => {

            if (index % 2 === 0) {
              return (
                <ul
                  className="backdrop-blur-md bg-white/20 flex flex-row items-center justify-between text-white text-xl font-bold w-screen px-32"
                  key={index}>
                  <li className='w-40'>{index + 1}</li>
                  <li className='w-90' onDoubleClick={() => removeRecord(index)}>{record.name}</li>
                  <li
                    className='w-40'
                  >{record.displayTime}</li>
                </ul>
              )
            }
            return (

              <ul
                className="backdrop-blur-md bg-white/10 flex flex-row items-center justify-between text-white text-xl font-bold w-screen px-32"
                key={index}>
                <li className='w-40'>{index + 1}</li>
                <li className='w-90' onDoubleClick={() => removeRecord(index)}>{record.name}</li>
                <li
                  className='w-40'
                >{record.displayTime}</li>
              </ul>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
