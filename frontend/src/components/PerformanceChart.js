'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// A custom tooltip for a better look and feel
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--background-dark)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        fontFamily: "'IBM Plex Mono', monospace"
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ color: 'var(--accent-blue)' }}>{`Views: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data }) {
  // Define our theme colors as strings for the chart
  const borderColor = '#2a2a2a';
  const textSecondary = '#A0A0A0';
  const accentBlue = '#00BFFF';

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        {/* --- FIX: Use direct color strings --- */}
        <CartesianGrid strokeDasharray="3 3" stroke={borderColor} strokeOpacity={0.2} />
        <XAxis 
          dataKey="title" 
          stroke={textSecondary}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke={textSecondary}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent-blue-glow)' }} />
        <Bar dataKey="views" fill={accentBlue} radius={[4, 4, 0, 0]} />
        {/* ------------------------------------- */}
      </BarChart>
    </ResponsiveContainer>
  );
}