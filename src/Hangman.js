import React, {useEffect, useState} from 'react';
import {dictionary} from './words.json';
import './Hangman.css';

const HANGMAN_COMPLETE_VALUE = 6;

export default function Hangman() {
  const [word, setWord] = useState();
  const [wordBlanks, setWordBlanks] = useState();
  const [inputValue, setInputValue] = useState('');
  const [hangmanProgress, setHangmanProgress] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [gameWon, setGameWon] = useState();
  const [guessedLetters, setGuessedLetters] = useState({
    correct: [],
    incorrect: [],
  });
  const [showRepeatGuessMessage, setShowRepeatGuessMessage] = useState(false);

  useEffect(() => {
    if (
      hangmanProgress < HANGMAN_COMPLETE_VALUE &&
      !wordBlanks?.includes('_')
    ) {
      setGameWon(true);
      resetGame();
    }
  }, [hangmanProgress, wordBlanks]);

  useEffect(() => {
    if (hangmanProgress === HANGMAN_COMPLETE_VALUE) {
      setGameWon(false);
      resetGame();
    }
  }, [hangmanProgress, word]);

  const guessedLetterBank = formattedGuessedLetters();

  const gameOverMessage = gameWon
    ? 'You win!'
    : `You lose! The word was: ${word?.join('')}`;
  return (
    <div className="Board">
      <div className="Word">
        {gameWon !== undefined && (
          <p className="GameOverMessage">{gameOverMessage}</p>
        )}
        {gameInProgress ? (
          <>
            <p className="WordBlanks">{wordBlanks}</p>
            <input
              type="text"
              className="Input"
              onChange={handleInputChange}
              onKeyDown={handleGuess}
              value={inputValue}
              maxLength={1}
            />
            {showRepeatGuessMessage && <p>Letter already guessed</p>}
            <div className="GuessedLetters">{guessedLetterBank}</div>
          </>
        ) : (
          <>
            <button className="Button" onClick={getRandomWord}>
              New Game
            </button>
          </>
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
  );

  function handleInputChange(event) {
    const {value} = event.target;
    setShowRepeatGuessMessage(false);
    setInputValue(value);
  }

  function handleGuess(event) {
    if (event.keyCode !== 13) return;

    if (word.includes(inputValue)) {
      if (guessedLetters.correct.includes(inputValue)) {
        setShowRepeatGuessMessage(true);
      } else {
        setGuessedLetters({
          ...guessedLetters,
          correct: [...guessedLetters.correct, inputValue],
        });
      }
    } else {
      if (guessedLetters.incorrect.includes(inputValue)) {
        setShowRepeatGuessMessage(true);
      } else {
        setHangmanProgress(hangmanProgress + 1);
        setGuessedLetters({
          ...guessedLetters,
          incorrect: [...guessedLetters.incorrect, inputValue],
        });
      }
    }

    if (
      guessedLetters.correct.includes(inputValue) ||
      guessedLetters.incorrect.includes(inputValue)
    ) {
      setShowRepeatGuessMessage(true);
    }

    const matchIndices = word.reduce(
      (acc, letter, index) => (letter === inputValue ? [...acc, index] : acc),
      []
    );

    const wordBlanksCopy = wordBlanks;
    matchIndices.map((matchIndex) =>
      wordBlanksCopy.splice(matchIndex, 1, inputValue)
    );

    setWordBlanks(wordBlanksCopy);
    setInputValue('');
  }

  function formattedGuessedLetters() {
    const combinedGuesses = [
      ...guessedLetters.correct,
      ...guessedLetters.incorrect,
    ].sort();

    return combinedGuesses.map((letter) => {
      return (
        <p key={letter}>
          {guessedLetters.incorrect.includes(letter) ? (
            <span className="IncorrectGuess">{letter}</span>
          ) : (
            letter
          )}
        </p>
      );
    });
  }

  function resetGame() {
    setGameInProgress(false);
    setHangmanProgress(0);
    setGuessedLetters({correct: [], incorrect: []});
  }

  function getRandomWord() {
    setGameWon(undefined);
    setGameInProgress(true);

    const randomWord = dictionary[
      Math.floor(Math.random() * dictionary.length)
    ].split('');
    setWord(randomWord);

    setWordBlanks(new Array(randomWord.length).fill('_'));
  }
}
