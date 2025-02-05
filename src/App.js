import { useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import { Starter } from "./Starter";
import Quiz from "./Quiz";
import Finish from "./Finish";
import { useQuizContext } from "./contexts/QuizContext";

export default function App() {
  const { status, isUserReady, dispatch } = useQuizContext();
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
    [dispatch, isUserReady]
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
        {status === "finish" && <Finish />}
      </div>
    </div>
  );
}
