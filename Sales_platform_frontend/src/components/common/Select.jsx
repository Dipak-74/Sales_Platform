function Select({ label, error, id, options = [], placeholder = "Select an option", className = "", ...props }) {
  return <div className="field-group">
    {label && <label htmlFor={id}>{label}</label>}
    <select id={id} className={`select ${className}`.trim()} {...props}>
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {error && <small className="field-error">{error}</small>}
  </div>;
}

export default Select;
