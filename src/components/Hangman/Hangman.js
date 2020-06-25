import React from 'react';
import classNames from 'classnames';
import './Hangman.css';

export function Hangman({hangmanProgress}) {
  return (
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
  );
}
