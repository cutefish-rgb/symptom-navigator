type DepartmentCardProps = {
  departments: string[];
};

export function DepartmentCard({ departments }: DepartmentCardProps) {
  return (
    <section className="department-panel" aria-labelledby="department-title">
      <p className="eyebrow">建議科別</p>
      <h2 id="department-title">可以先考慮掛這些科</h2>
      <div className="department-list">
        {departments.map((department) => (
          <div className="department-item" key={department}>
            <strong>{department}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
