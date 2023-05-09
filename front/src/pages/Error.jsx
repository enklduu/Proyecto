import React from "react";
import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const miError = useRouteError();
  console.log(miError);

  return (
    <>
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{miError.statusText || miError.message}</i>
        </p>
      </div>
      <Link to={"/"} className="text-center mb-4">
        Volver a la vista principal
      </Link>
    </>
  );
};

export default Error;
