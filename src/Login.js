import { useState } from "react";

export default function Login({ setPassword }) {
  const [inputValue, setInputValue] = useState("");
  return (
    <div>
      <form onSubmit={(e) => setPassword(inputValue)}>
        <label>
          Password:
          <input
            onChange={(e) => setInputValue(e.target.value)}
            type={"password"}
          />
          <button>Login</button>
        </label>
      </form>
    </div>
  );
}
