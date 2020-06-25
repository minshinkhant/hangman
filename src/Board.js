import React, {useEffect, useState} from 'react';
import {Hangman} from './components/Hangman';
import {dictionary} from './words.json';
import './Board.css';

const COMPLETE_HANGMAN_SEQUENCE = [0, 1, 2, 3, 4, 5, 6];

export default function Board() {
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
  const [showInvalidCharMessage, setShowInvalidCharMessage] = useState(false);

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

  const invalidCharRegex = /[^a-zA-Z_]/;

  return (
    <div className="Board">
      <div className="Board__content">
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
            <p className="PlayerMessage">{playerMessage()}</p>
            <div className="GuessedLetters">{guessedLetterBank}</div>
          </>
        ) : (
          <button className="Button" onClick={getRandomWord}>
            New Game
          </button>
        )}
      </div>
      <div className="Board__hangman">
        <Hangman hangmanProgress={hangmanProgress} />
      </div>
    </div>
  );

  function handleInputChange(event) {
    setShowRepeatGuessMessage(false);
    setShowInvalidCharMessage(false);
    setInputValue(event.target.value);
  }

  function handleGuess(event) {
    if (event.keyCode !== 13) return;

    if (inputValue.match(invalidCharRegex)) {
      setShowInvalidCharMessage(true);
      return setInputValue('');
    }

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
        const nextHangmanSequence = hangmanProgress.length - 1 + 1;
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
    const combinedLetters = [
      ...guessedLetters.correct,
      ...guessedLetters.incorrect,
    ].sort();

    return combinedLetters.map((letter) => {
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

  function playerMessage() {
    if (showRepeatGuessMessage) return 'Letter already guessed';
    if (showInvalidCharMessage) return 'Invalid character';
  }

  function getRandomWord() {
    resetGame();

    const randomWord = dictionary[
      Math.floor(Math.random() * dictionary.length)
    ].split('');
    setWord(randomWord);

    setWordBlanks(new Array(randomWord.length).fill('_'));
  }

  function resetGame() {
    setHangmanProgress([0]);
    setGuessedLetters({correct: [], incorrect: []});
    setGameWon(undefined);
    setGameInProgress(true);
  }
}
