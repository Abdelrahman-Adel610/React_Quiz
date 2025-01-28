import { useEffect, useReducer } from "react";

const initialState = {
  score: 0,
  status: "notAnswered",
  selected: -1,
  crntQ: 0,
  timer: {
    min: 10,
    sec: 0,
  },
};
function reducer(state, action) {
  switch (action.type) {
    case "choose":
      return {
        ...state,
        score: state.score + action.payload.isTrue * action.payload.value,
        status: action.payload.isTrue ? "success" : "fail",
        selected: action.payload.selectedOption,
      };
    case "nextQuestion":
      return {
        ...state,
        selected: -1,
        status: "notAnswered",
        crntQ: state.crntQ + 1,
      };
    case "decTime":
      if (state.timer.sec === 0 && state.timer.min > 0) {
        return {
          ...state,
          timer: {
            sec: 59,
            min: state.timer.min - 1,
          },
        };
      } else if (state.timer.sec > 0)
        return {
          ...state,
          timer: {
            sec: state.timer.sec - 1,
            min: state.timer.min,
          },
        };
      else return { ...state };
    default:
      throw new Error("Undefined action");
  }
}
export default function Quiz({ Questions }) {
  const [
    {
      status,
      score,
      selected,
      timer: { sec, min },
      crntQ,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  useEffect(function () {
    function callBack() {
      dispatch({ type: "decTime" });
    }
    setInterval(callBack, 1000);
    return clearInterval(callBack);
  }, []);
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
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    </div>
  );
}
