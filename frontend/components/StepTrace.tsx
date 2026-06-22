export function StepTrace({ steps }: { steps: any[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="step-trace">
      {steps.map((s, idx) => (
        <div key={idx} className="st-item">
          <span className="st-check">{s.status === 'done' ? '✅' : '❌'}</span>
          <span className="st-text">{s.step} · {s.detail}</span>
          <span className="st-time">{s.ms}ms</span>
        </div>
      ))}
    </div>
  );
}
