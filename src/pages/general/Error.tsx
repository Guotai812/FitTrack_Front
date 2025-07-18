import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  // you can distinguish thrown responses vs. real JS errors:
  if (isRouteErrorResponse(error)) {
    return (
      <div className="p-8">
        <h1>Oops – got a {error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1>Something went wrong</h1>
      <pre className="mt-4 text-sm">{(error as Error).message}</pre>
    </div>
  );
}
