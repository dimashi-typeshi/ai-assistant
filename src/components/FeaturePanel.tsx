type FeaturePanelProps = {
  title: string;
  items: string[];
};

export function FeaturePanel({ title, items }: FeaturePanelProps) {
  return (
    <section className="feature-panel">
      <h2>{title}</h2>
      <div className="feature-list">
        {items.map((item) => (
          <article className="feature-card" key={item}>
            <span />
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
