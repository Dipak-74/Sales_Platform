function EmptyState({ title = "Nothing to show", description }) {
  return <div className="empty-state"><strong>{title}</strong>{description && <p>{description}</p>}</div>;
}

export default EmptyState;
