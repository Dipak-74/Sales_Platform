function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      {items.map((item, index) => (
        <span key={item} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          <span>{item}</span>
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;
