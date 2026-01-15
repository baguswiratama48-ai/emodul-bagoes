import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
    const [email, setEmail] = useState("Bagoes87@guru.local");
    const [password, setPassword] = useState("11Maret2011");
    const [loginResult, setLoginResult] = useState<any>(null);
    const [dbCheck, setDbCheck] = useState<any>(null);
    const [envCheck, setEnvCheck] = useState<any>(null);

    useEffect(() => {
        // Check Env Vars
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        setEnvCheck({
            url_exists: !!url,
            url_prefix: url ? url.substring(0, 20) + "..." : "MISSING",
            key_exists: !!key,
            key_prefix: key ? key.substring(0, 10) + "..." : "MISSING",
        });

        // Check DB Connection
        checkDb();
    }, []);

    const checkDb = async () => {
        try {
            const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
            if (error) throw error;
            setDbCheck({ status: "SUCCESS", detail: "Connected to DB", count: data });
        } catch (err: any) {
            setDbCheck({ status: "ERROR", message: err.message, code: err.code, details: err });
        }
    };

    const handleManualLogin = async () => {
        setLoginResult({ status: "LOADING..." });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            setLoginResult({ status: "SUCCESS", user: data.user?.email, role: data.user?.role });
        } catch (err: any) {
            setLoginResult({
                status: "ERROR",
                message: err.message,
                name: err.name,
                code: err.code || "No Code",
                status_code: err.status || "No Status"
            });
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-red-600">Halaman Diagnosa Masalah (Debug)</h1>

            {/* 1. Environment Check */}
            <Card>
                <CardHeader><CardTitle>1. Cek Kunci (Environment)</CardTitle></CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                        {JSON.stringify(envCheck, null, 2)}
                    </pre>
                    <p className="text-sm text-gray-500 mt-2">Pastikan URL tidak ada spasi/enter aneh.</p>
                </CardContent>
            </Card>

            {/* 2. DB Connection Check */}
            <Card>
                <CardHeader><CardTitle>2. Cek Koneksi Database</CardTitle></CardHeader>
                <CardContent>
                    <pre className={`p-4 rounded text-xs overflow-auto ${dbCheck?.status === 'ERROR' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {JSON.stringify(dbCheck, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            {/* 3. Login Test */}
            <Card>
                <CardHeader><CardTitle>3. Tes Login Manual</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <Input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        type="text" // Show password visible for debugging
                    />
                    <Button onClick={handleManualLogin}>Coba Login & Lihat Error Asli</Button>

                    {loginResult && (
                        <div className="mt-4">
                            <h3 className="font-bold">Hasil:</h3>
                            <pre className="bg-black text-white p-4 rounded text-xs overflow-auto">
                                {JSON.stringify(loginResult, null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>

            <p className="text-center text-gray-500">Fotokan halaman ini dan kirim ke saya.</p>
        </div>
    );
}
