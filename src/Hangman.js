import React, {useState} from 'react';
import {dictionary} from './words.json';
import './Hangman.css';

export default function Hangman() {
  const [word, setWord] = useState(null);
  const [mysteryWord, setMysteryWord] = useState(null);
  const [gameInProgress, setGameInProgress] = useState(false);

  return (
    <>
      <div className="Board">
        <div className="Word">
          {gameInProgress ? (
            <>
              <p className="MysteryWord">{mysteryWord}</p>
              <input
                type="text"
                className="Input"
                onChange={handleGuess}
                maxLength={1}
              />
            </>
          ) : (
            <button className="Button" onClick={getRandomWord}>
              New Game
            </button>
          )}
        </div>

        <div className="Hangman">
          <div className="Hangman__gallows">
            <div className="Hangman__head">
              <div className="Hangman__torso"></div>
              <div className="Hangman__left-arm"></div>
              <div className="Hangman__right-arm"></div>
              <div className="Hangman__left-leg"></div>
              <div className="Hangman__right-leg"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  function getRandomWord() {
    setGameInProgress(true);

    const randomWord = dictionary[
      Math.floor(Math.random() * dictionary.length)
    ].split('');
    setWord(randomWord);

    setMysteryWord(new Array(randomWord.length).fill('_'));
  }

  function handleGuess(event) {
    const guessedLetter = event.target.value;

    console.log('word:', word);
    console.log('mysteryWord:', mysteryWord);
    console.log('guessedLetter', guessedLetter);

    const matchIndices = word.reduce(
      (acc, letter, index) =>
        letter === guessedLetter ? [...acc, index] : acc,
      []
    );

    const mysteryWordCopy = mysteryWord;
    matchIndices.map((matchIndex) =>
      mysteryWordCopy.splice(matchIndex, 1, guessedLetter)
    );

    setMysteryWord(mysteryWordCopy);
  }
}
