import { createContext, useContext, useReducer } from "react";
const QuizContext = createContext();
const quiz = {
  score: 0,
  status: "notAnswered",
  selected: -1,
  crntQ: 0,
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
export default function QuizContextProvider({ children }) {
  const [{ questions, status, isUserReady, quiz, maxScore }, dispatch] =
    useReducer(reducer, initialState);
  return (
    <QuizContext.Provider
      value={{ questions, status, isUserReady, quiz, maxScore, dispatch }}
    >
      {children}
    </QuizContext.Provider>
  );
}
export function useQuizContext() {
  return useContext(QuizContext);
}
