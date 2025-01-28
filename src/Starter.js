export function Starter({ clickHandle }) {
  return (
    <div className="main">
      <div className="start">
        <h2>Welcome to the React Quiz!</h2>
        <h3>15 questions to test React mastery</h3>
        <button className="btn" onClick={clickHandle}>
          Let's start
        </button>
      </div>
    </div>
  );
}
