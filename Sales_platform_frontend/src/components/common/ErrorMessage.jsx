function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div className="alert alert-error" role="alert">
      {message}
    </div>
  );
}

export default ErrorMessage;
