import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { ITEM_CATEGORIES } from '../../data/mockData';

// Vibrant, distinct color palette for each category
const COLORS = [
  '#6366f1', // Indigo    — Books
  '#f59e0b', // Amber     — Electronics
  '#10b981', // Emerald   — Calculators
  '#ef4444', // Red       — Instruments
  '#3b82f6', // Blue      — Lab Equipment
  '#ec4899', // Pink      — Clothes
  '#f97316', // Orange    — Sports
  '#8b5cf6', // Violet    — Others
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.07) return null; // skip tiny slices
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Outfit' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function CategoryPieChart() {
  const { items } = useApp();

  const data = ITEM_CATEGORIES
    .map((cat, i) => ({ name: cat, value: items.filter(item => item.category === cat).length, color: COLORS[i] }))
    .filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={65}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v, name) => [v, name]}
          contentStyle={{
            borderRadius: 12, border: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            fontFamily: 'Inter', fontSize: 13,
          }}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value) => (
            <span style={{ fontSize: 12, color: '#3d5f58', fontFamily: 'Inter' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
