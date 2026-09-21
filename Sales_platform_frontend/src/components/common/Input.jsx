function Input({ label, error, id, className = "", ...props }) {
  return <div className="field-group">
    {label && <label htmlFor={id}>{label}</label>}
    <input id={id} className={`input ${className}`.trim()} {...props} />
    {error && <small className="field-error">{error}</small>}
  </div>;
}

export default Input;
