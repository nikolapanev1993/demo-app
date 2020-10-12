import React, { useState, useCallback, useRef } from 'react';
import { produce } from 'immer';

import './App.css';

const size = 10;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const Grid = () => {
  const [array, setArray] = useState(() => {
    const rows = [];
    for (let i = 0; i < size; i++) {
      rows.push(Array.from(Array(size), () => 0));
    }

    return rows;
  });

  const [playing, setPlaying] = useState(false);

  const playingRef = useRef(playing);
  playingRef.current = playing;

  const play = useCallback(() => {
    if (!playingRef.current) {
      return;
    }

    setArray((item) => {
      return produce(item, (gridCopy) => {
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < size && newJ >= 0 && newJ < size) {
                neighbors += item[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (item[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(play, 1000);
  }, []);

  return (
    <div className='App'>
      <button
        className='play-button'
        onClick={() => {
          setPlaying(!playing);
          if (!playing) {
            playingRef.current = true;
            play();
          }
        }}
      >
        {!playing ? 'Start' : 'Stop'}
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 20px)`,
          gridTemplateRows: size,
        }}
      >
        {array.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const updatedArray = produce(array, (newArray) => {
                  newArray[i][j] = newArray[i][j] ? 0 : 1;
                });
                setArray(updatedArray);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: array[i][j] ? 'red' : undefined,
                border: '1px solid black',
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
