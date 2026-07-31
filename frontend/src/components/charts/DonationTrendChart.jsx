import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';

// Each bar gets its own vivid color
const BAR_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#3b82f6', '#ec4899', '#f97316',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a2e29', color: '#fff', padding: '0.6rem 1rem',
      borderRadius: 10, fontSize: 13, fontFamily: 'Inter',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    }}>
      <p style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#ccdfd9' }}>Donations: <strong>{payload[0].value}</strong></p>
    </div>
  );
};

export default function DonationTrendChart() {
  const { requests } = useApp();

  // Generate last 7 months dynamically to show visual progression
  const today = new Date();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    data.push({
      month: monthName,
      year: d.getFullYear(),
      monthNum: d.getMonth(),
      count: 0
    });
  }

  // Aggregate donation requests
  requests.forEach(req => {
    if (req.status === 'REJECTED') return;
    
    const itemType = req.item?.type || (req.item && typeof req.item === 'object' ? req.item.type : null);
    if (itemType !== 'DONATE') return;

    const reqDate = new Date(req.createdAt);
    const reqMonth = reqDate.getMonth();
    const reqYear = reqDate.getFullYear();

    const bucket = data.find(b => b.monthNum === reqMonth && b.year === reqYear);
    if (bucket) {
      bucket.count += 1;
    }
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#6b8f89', fontFamily: 'Inter' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b8f89', fontFamily: 'Inter' }}
          axisLine={false} tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Donations" maxBarSize={40}>
          {data.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
