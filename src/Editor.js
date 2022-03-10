export default function Editor({ node }) {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "calc(100% - 2em)",
        display: "flex",
        backgroundColor: "#0005",
        alignContent: "center",
        justifyContent: "center",
        padding: "1em",
      }}
    >
      <div
        style={{
          border: "1px solid black",
          backgroundColor: "white",
          width: "70%",
          display: "flex",
          borderRadius: "10px",
          flexDirection: "column",
          padding: "2em",
        }}
      >
        <input style={{ textAlign: "center" }} value={node.title} />
        <div>
          <h3>Connections</h3>
          <div
            style={{
              position: "relative",
              border: "1px solid gray",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              padding: "0 1em 1em 1em",
              marginBottom: "1em",
            }}
          >
            <h4>Headcount growth</h4>
            Reasoning:
            <textarea>Headcount growth gives more opportunities etc</textarea>
            <div style={{ position: "absolute", top: "1em", right: "1em" }}>
              🅧
            </div>
          </div>
          <hr />
          <div
            style={{
              position: "relative",
              border: "1px solid gray",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              padding: "0 1em 1em 1em",
            }}
          >
            <h4>Create a new connection</h4>
            <input type="text" placeholder="Search item by name" />
          </div>
        </div>
      </div>
    </div>
  );
}
