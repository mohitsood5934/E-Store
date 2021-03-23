import React from "react";
import { Spinner } from "react-bootstrap";
const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "100px",
        height: "100px",
        margin: "auto",
        display: "block",
      }}
    >
        <span className='sr-only'>Loading...</span>
    </Spinner>
  );
};

export default Loader;
// import React from "react";
// import { Button, Spinner } from "react-bootstrap";

// const Loader = () => {
//   return (
//     <div style={{ textAlign: "center" }}>
//       <Button variant="success" disabled>
//         <Spinner
//           as="span"
//           animation="border"
//           size="sm"
//           role="status"
//           aria-hidden="true"
//         />
//         <span className="sr-only">Loading...</span>
//       </Button>{" "}
//       <Button variant="success" disabled>
//         <Spinner
//           as="span"
//           animation="grow"
//           size="sm"
//           role="status"
//           aria-hidden="true"
//         />
//         Loading...
//       </Button>
//     </div>
//   );
// };

// export default Loader;
