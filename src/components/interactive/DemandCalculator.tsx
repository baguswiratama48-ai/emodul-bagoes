import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

export function DemandCalculator() {
  const [p1, setP1] = useState('');
  const [q1, setQ1] = useState('');
  const [p2, setP2] = useState('');
  const [q2, setQ2] = useState('');
  const [result, setResult] = useState<{ slope: number; intercept: number; equation: string } | null>(null);

  const calculate = () => {
    const price1 = parseFloat(p1);
    const quantity1 = parseFloat(q1);
    const price2 = parseFloat(p2);
    const quantity2 = parseFloat(q2);

    if (isNaN(price1) || isNaN(quantity1) || isNaN(price2) || isNaN(quantity2)) {
      return;
    }

    const slope = (quantity2 - quantity1) / (price2 - price1);
    const intercept = quantity1 - (slope * price1);

    setResult({
      slope: Math.round(slope * 10000) / 10000,
      intercept: Math.round(intercept * 100) / 100,
      equation: `Qd = ${slope >= 0 ? '' : ''}${Math.round(slope * 10000) / 10000}P + ${Math.round(intercept * 100) / 100}`
    });
  };

  const reset = () => {
    setP1('');
    setQ1('');
    setP2('');
    setQ2('');
    setResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Kalkulator Fungsi Permintaan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Titik 1 (P₁, Q₁)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="p1">Harga (P₁)</Label>
                <Input id="p1" type="number" placeholder="10000" value={p1} onChange={(e) => setP1(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="q1">Jumlah (Q₁)</Label>
                <Input id="q1" type="number" placeholder="20" value={q1} onChange={(e) => setQ1(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Titik 2 (P₂, Q₂)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="p2">Harga (P₂)</Label>
                <Input id="p2" type="number" placeholder="8000" value={p2} onChange={(e) => setP2(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="q2">Jumlah (Q₂)</Label>
                <Input id="q2" type="number" placeholder="40" value={q2} onChange={(e) => setQ2(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculate} className="flex-1 bg-gradient-primary">Hitung</Button>
          <Button onClick={reset} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
            <h4 className="font-semibold text-success mb-2">Hasil:</h4>
            <p className="text-2xl font-mono text-foreground mb-2">{result.equation}</p>
            <p className="text-sm text-muted-foreground">Slope (a) = {result.slope}</p>
            <p className="text-sm text-muted-foreground">Intercept (b) = {result.intercept}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
