import { useEffect, useReducer } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import { Starter } from "./Starter";
import Quiz from "./Quiz";
import Finish from "./Finish";
const quiz = {
  score: 0,
  status: "notAnswered",
  selected: -1,
  crntQ: 14,
  timer: {
    min: 10,
    sec: 0,
  },
};
const initialState = {
  questions: [],
  status: "loading",
  isUserReady: false,
  quiz,
  maxScore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "setQuestions":
      return { ...state, questions: action.payload, status: "ready" };
    case "error":
      return { ...state, status: "error" };
    case "userReady":
      return { ...state, isUserReady: true };

    case "choose":
      return {
        ...state,
        quiz: {
          ...state.quiz,
          score:
            state.quiz.score + action.payload.isTrue * action.payload.value,
          status: action.payload.isTrue ? "success" : "fail",
          selected: action.payload.selectedOption,
        },
      };
    case "nextQuestion":
      return {
        ...state,
        quiz: {
          ...state.quiz,
          selected: -1,
          status: "notAnswered",
          crntQ: state.quiz.crntQ + 1,
        },
      };
    case "decTime":
      if (state.quiz.timer.sec === 0 && state.quiz.timer.min > 0) {
        return {
          ...state,
          quiz: {
            ...state.quiz,
            timer: {
              sec: 59,
              min: state.quiz.timer.min - 1,
            },
          },
        };
      } else if (state.quiz.timer.sec > 0)
        return {
          ...state,
          quiz: {
            ...state.quiz,
            timer: {
              sec: state.quiz.timer.sec - 1,
              min: state.quiz.timer.min,
            },
          },
        };
    // eslint-disable-next-line no-fallthrough
    case "finish":
      return {
        ...state,
        status: "finish",
        maxScore: Math.max(state.maxScore, state.quiz.score),
      };
    case "restart":
      return { ...state, isUserReady: false, status: "ready", quiz };
    default:
      throw new Error("Undefined Action type");
  }
}
export default function App() {
  const [{ questions, status, isUserReady, quiz, maxScore }, dispatch] =
    useReducer(reducer, initialState);
  useEffect(
    function () {
      const ctrl = new AbortController();
      if (!isUserReady) return;
      async function getQuestions() {
        try {
          const response = await fetch("http://localhost:8000/questions", {
            method: "GET",
            signal: ctrl.signal,
          });
          const data = await response.json();
          dispatch({ type: "setQuestions", payload: data });
        } catch (err) {
          dispatch({ type: "error", payload: err.meessage });
        }
      }
      getQuestions();
      return () => ctrl.abort();
    },
    [isUserReady]
  );
  return (
    <div className="app">
      <Header />
      <div className="main">
        {!isUserReady && (
          <Starter clickHandle={() => dispatch({ type: "userReady" })} />
        )}
        {isUserReady && status === "loading" && <Loader />}
        {isUserReady && status === "error" && <Error />}
        {isUserReady && status === "ready" && (
          <Quiz Questions={questions} dispatch={dispatch} quiz={quiz} />
        )}
        {status === "finish" && (
          <Finish dispatch={dispatch} quiz={quiz} maxScore={maxScore} />
        )}
      </div>
    </div>
  );
}
