type EmergencyNoticeProps = {
  seeDoctorSoon: string;
  emergency: string;
};

export function EmergencyNotice({ seeDoctorSoon, emergency }: EmergencyNoticeProps) {
  return (
    <section className="notice-grid" aria-label="就醫提醒">
      <div className="notice notice-soft">
        <h2>建議就醫時機</h2>
        <p>{seeDoctorSoon}</p>
      </div>
      <div className="notice notice-danger">
        <h2>立即急診警訊</h2>
        <p>{emergency}</p>
      </div>
    </section>
  );
}
