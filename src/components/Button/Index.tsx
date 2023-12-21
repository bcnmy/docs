import * as React from "react";

const Button: React.FC = () => {
  const [count, setCount] = React.useState<number>(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
};

export default Button;
