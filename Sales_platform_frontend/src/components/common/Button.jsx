function Button({ variant = "primary", type = "button", className = "", children, ...props }) {
  const variantClass = variant === "danger" ? "danger-btn" : variant === "secondary" ? "secondary-btn" : "primary-btn";
  return <button type={type} className={`${variantClass} ${className}`.trim()} {...props}>{children}</button>;
}

export default Button;
