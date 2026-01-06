import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const demandData = [
  { price: 10000, quantity: 20, label: 'A' },
  { price: 8000, quantity: 40, label: 'B' },
  { price: 6000, quantity: 60, label: 'C' },
  { price: 4000, quantity: 80, label: 'D' },
  { price: 2000, quantity: 100, label: 'E' },
];

export function DemandCurveChart() {
  const [activePoint, setActivePoint] = useState<typeof demandData[0] | null>(null);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={demandData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="quantity" 
                label={{ value: 'Jumlah Diminta (Qd)', position: 'bottom', offset: 0 }}
                className="text-muted-foreground"
              />
              <YAxis 
                dataKey="price"
                label={{ value: 'Harga (P)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `${value/1000}k`}
                className="text-muted-foreground"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-bold text-primary">Titik {data.label}</p>
                        <p className="text-sm text-foreground">Harga: Rp{data.price.toLocaleString()}</p>
                        <p className="text-sm text-foreground">Jumlah: {data.quantity} unit</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="linear" 
                dataKey="price" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: 'hsl(var(--secondary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-4">
          💡 Hover pada titik-titik kurva untuk melihat detail harga dan jumlah permintaan
        </p>
      </CardContent>
    </Card>
  );
}
