import { useState } from "react";

export default function Login({ setPassword }) {
  const [inputValue, setInputValue] = useState("");
  return (
    <div>
      <label>
        Password:
        <input
          onChange={(e) => setInputValue(e.target.value)}
          type={"password"}
        />
        <button onClick={(e) => setPassword(inputValue)}>Login</button>
      </label>
    </div>
  );
}
