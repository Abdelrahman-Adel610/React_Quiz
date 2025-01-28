import { useEffect, useRef } from "react";

export default function Quiz({ Questions, dispatch, quiz }) {
  const {
    status,
    score,
    selected,
    timer: { sec, min },
    crntQ,
  } = quiz;
  const intervalId = useRef(null);
  useEffect(
    function () {
      function callBack() {
        dispatch({ type: "decTime" });
      }
      intervalId.current = setInterval(callBack, 1000);
      return () => clearInterval(intervalId.current);
    },
    [dispatch]
  );
  const { question, options, correctOption, points } = Questions[crntQ];
  return (
    <div>
      <div className="progress">
        <progress value={crntQ} max={15}></progress>
        <span>
          Question <strong>{crntQ + 1}</strong>/15
        </span>
        <span>
          <strong>{score}</strong>/280 points
        </span>
      </div>
      <h4>{question}</h4>
      <div className="options">
        {options.map((el, i) => (
          <button
            key={i}
            value={i + 1}
            disabled={status !== "notAnswered"}
            className={`btn btn-option ${
              status !== "notAnswered"
                ? i === correctOption
                  ? "correct"
                  : "wrong"
                : ""
            } ${selected === i ? "answer" : ""}`}
            onClick={() => {
              dispatch({
                type: "choose",
                payload: {
                  isTrue: i === correctOption,
                  value: points,
                  selectedOption: i,
                },
              });
            }}
          >
            {el}
          </button>
        ))}
      </div>
      <div className="timer">
        {min.toString().padStart(2, 0)}:{sec.toString().padStart(2, 0)}
      </div>
      <button
        className={`btn btn-ui ${selected === -1 ? "hidden" : ""}`}
        onClick={() => {
          if (crntQ + 1 < Questions.length) dispatch({ type: "nextQuestion" });
          else dispatch({ type: "finish" });
        }}
      >
        {crntQ + 1 < Questions.length ? "Next" : "Finish"}
      </button>
    </div>
  );
}
