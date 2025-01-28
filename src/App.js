import { useEffect, useReducer } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import { Starter } from "./Starter";
import Quiz from "./Quiz";
const initialState = {
  questions: [],
  status: "loading",
  isUserReady: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setQuestions":
      return { ...state, questions: action.payload, status: "ready" };
    case "error":
      return { ...state, status: "error" };
    case "userReady":
      return { ...state, isUserReady: true };
    default:
      throw new Error("Undefined Action type");
  }
}
export default function App() {
  const [{ questions, status, isUserReady }, dispatch] = useReducer(
    reducer,
    initialState
  );
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
        {isUserReady && status === "ready" && <Quiz />}
      </div>
    </div>
  );
}
