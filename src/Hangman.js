import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import {dictionary} from './words.json';
import './Hangman.css';

const COMPLETE_HANGMAN_SEQUENCE = [0, 1, 2, 3, 4, 5, 6];

export default function Hangman() {
  const [word, setWord] = useState();
  const [wordBlanks, setWordBlanks] = useState();
  const [inputValue, setInputValue] = useState('');
  const [hangmanProgress, setHangmanProgress] = useState([0]);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [gameWon, setGameWon] = useState();
  const [guessedLetters, setGuessedLetters] = useState({
    correct: [],
    incorrect: [],
  });
  const [showRepeatGuessMessage, setShowRepeatGuessMessage] = useState(false);

  useEffect(() => {
    const win =
      hangmanProgress.length !== COMPLETE_HANGMAN_SEQUENCE.length &&
      word?.every((letter) => guessedLetters.correct.includes(letter));
    const lose = hangmanProgress.length === COMPLETE_HANGMAN_SEQUENCE.length;

    if (win) {
      setGameWon(true);
      setGameInProgress(false);
    }

    if (lose) {
      setGameWon(false);
      setGameInProgress(false);
    }
  }, [guessedLetters, hangmanProgress, word]);

  const guessedLetterBank = formattedGuessedLetters();

  const gameOverMessage = gameWon
    ? 'You win!'
    : `You lose! The word was ${word?.join('').toUpperCase()}`;

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
              disabled={gameWon !== undefined}
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
          <div
            className={classNames({
              Hangman__head: true,
              VisibleHangmanPart: hangmanProgress.includes(1),
            })}
          >
            <div
              className={classNames({
                Hangman__torso: true,
                VisibleHangmanPart: hangmanProgress.includes(2),
              })}
            ></div>
            <div
              className={classNames({
                'Hangman__left-arm': true,
                VisibleHangmanPart: hangmanProgress.includes(3),
              })}
            ></div>
            <div
              className={classNames({
                'Hangman__right-arm': true,
                VisibleHangmanPart: hangmanProgress.includes(4),
              })}
            ></div>
            <div
              className={classNames({
                'Hangman__left-leg': true,
                VisibleHangmanPart: hangmanProgress.includes(5),
              })}
            ></div>
            <div
              className={classNames({
                'Hangman__right-leg': true,
                VisibleHangmanPart: hangmanProgress.includes(6),
              })}
            ></div>
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
        console.log('hangmanProgress', hangmanProgress);
        const nextHangmanSequence = hangmanProgress.length - 1 + 1;
        console.log('nextHangmanSequence', nextHangmanSequence);
        if (
          nextHangmanSequence <=
          COMPLETE_HANGMAN_SEQUENCE[COMPLETE_HANGMAN_SEQUENCE.length - 1]
        ) {
          setHangmanProgress([...hangmanProgress, nextHangmanSequence]);
        }

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

  function getRandomWord() {
    setHangmanProgress([0]);
    setGuessedLetters({correct: [], incorrect: []});
    setGameWon(undefined);
    setGameInProgress(true);

    const randomWord = dictionary[
      Math.floor(Math.random() * dictionary.length)
    ].split('');
    setWord(randomWord);

    setWordBlanks(new Array(randomWord.length).fill('_'));
  }
}
