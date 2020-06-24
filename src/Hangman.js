import React, {useState} from 'react';
import {dictionary} from './words.json';
import './Hangman.css';

export default function Hangman() {
  const [word, setWord] = useState(null);
  const [hiddenWord, setHiddenWord] = useState(null);
  const [gameInProgress, setGameInProgress] = useState(false);

  return (
    <>
      {!gameInProgress && <button onClick={getRandomWord}>New Game</button>}
      {hiddenWord}
      <div className="Board"></div>
    </>
  );

  function getRandomWord() {
    setGameInProgress(true);
    const randomWord = dictionary[
      Math.floor(Math.random() * dictionary.length)
    ].split('');
    setWord(randomWord);
    maskWord();
  }

  function maskWord() {
    if (!word) return;
    const maskedWord = word.map((letter) => (letter = '_'));
    setHiddenWord(maskedWord);
  }
}
