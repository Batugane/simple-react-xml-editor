import React from "react";
import CustomEditor from "./CustomEditor";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CustomEditor style={{ width: "80%", height: "60%" }} />
    </div>
  );
}

export default App;
