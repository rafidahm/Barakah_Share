import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useApp } from '../../context/AppContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a2e29', color: '#fff', padding: '0.6rem 1rem',
      borderRadius: 10, fontSize: 13, fontFamily: 'Inter',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    }}>
      <p style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#a5b4fc' }}>Borrowings: <strong>{payload[0].value}</strong></p>
    </div>
  );
};

export default function BorrowingTrendChart() {
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

  // Aggregate borrowing requests
  requests.forEach(req => {
    if (req.status === 'REJECTED') return;
    
    const itemType = req.item?.type || (req.item && typeof req.item === 'object' ? req.item.type : null);
    if (itemType !== 'LEND') return;

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
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="borrowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 2' }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#6366f1"
          strokeWidth={3}
          fill="url(#borrowGrad)"
          name="Borrowings"
          dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 7, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
