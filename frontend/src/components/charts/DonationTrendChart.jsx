import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { mockMonthlyDonations } from '../../data/mockData';

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
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={mockMonthlyDonations} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#6b8f89', fontFamily: 'Inter' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b8f89', fontFamily: 'Inter' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Donations" maxBarSize={40}>
          {mockMonthlyDonations.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
