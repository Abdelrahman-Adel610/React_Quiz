export default function Finish({ dispatch, quiz, maxScore }) {
  return (
    <>
      <div className="result">
        <p>
          you have scored {quiz.score} out of 280 (
          {Math.round(quiz.score / 280) * 100}%)
        </p>
      </div>
      <p className="highscore">(Highscore: {maxScore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "restart" });
        }}
      >
        Restart Quiz
      </button>
    </>
  );
}
