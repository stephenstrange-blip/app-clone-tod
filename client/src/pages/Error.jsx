import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.log(error)
  const errorMsg = error.data ? error.data : (error.message ? error.message : (error ? error : 'Something Unexpected happended'));

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMsg}</i>
      </p>
    </div>
  );
}


// For error function boundaries
export function fallBackRender({ error, resetErrorBoundary }) {
  // resetErrorBoundary();
  return (
    <div className="error_boundary">
      <p>Something Happened while rendering</p>
    </div>
  )
}

export function logError(error, info) {
  // Do something with the error, e.g. log to an external API
  console.log('Error: ', error, "Info: ", info)
};