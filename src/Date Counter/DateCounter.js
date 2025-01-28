import { useReducer } from "react";
const initialState = { c: 0, s: 1 };
function reducer(state, action) {
  switch (action.type) {
    case "inc":
      return { ...state, c: state.c + state.s };
    case "dec":
      if (state.c - state.s >= 0) return { ...state, c: state.c - state.s };
      return state;
    case "setCounter":
      return { ...state, c: action.payload };
    case "setStep":
      return { ...state, s: action.payload };
    case "reset":
      return initialState;

    default:
      throw new Error("Undefined Action");
  }
}
function DateCounter() {
  const [{ c: count, s: step }, dispatch] = useReducer(reducer, initialState);
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={(e) => {
            dispatch({ type: "setStep", payload: +e.target.value });
          }}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={() => dispatch({ type: "dec" })}>-</button>
        <input
          value={count}
          onChange={(e) =>
            dispatch({ type: "setCounter", payload: +e.target.value })
          }
        />
        <button onClick={() => dispatch({ type: "inc" })}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button
          onClick={() => {
            dispatch({ type: "reset" });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
export default DateCounter;
