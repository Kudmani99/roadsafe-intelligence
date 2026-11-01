interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
}

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="card flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
        {trend && (
          <p className="mt-1 text-xs font-medium text-accent">{trend}</p>
        )}
      </div>
    </div>
  );
}
