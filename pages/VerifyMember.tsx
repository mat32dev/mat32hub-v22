import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ShieldCheck, AlertTriangle, Clock, UserCheck } from 'lucide-react';

const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3003';

interface VerifyResult {
  valid: boolean;
  reason?: string;
  member_id?: number;
  member_number?: string;
  name?: string;
  status?: string;
  issued_at?: string;
  expires_at?: string;
  last_checkin?: string | null;
}

export const VerifyMember: React.FC = () => {
  const { token } = useParams();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/verify/${token}`)
      .then(r => r.json())
      .then(d => { setResult(d); setLoading(false); })
      .catch(() => { setResult({ valid: false, reason: 'Network error' }); setLoading(false); });
  }, [token]);

  const doCheckin = async () => {
    if (!token) return;
    setCheckingIn(true);
    try {
      const r = await fetch(`${API}/verify/${token}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checked_in_by: 'door-staff' }),
      });
      if (r.ok) setCheckedIn(true);
      else alert('Error al registrar entrada');
    } catch { alert('Error de red'); }
    setCheckingIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-mat-500 w-12 h-12" />
      </div>
    );
  }

  const invalid = !result?.valid;

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${invalid ? 'bg-red-950' : 'bg-mat-950'}`}>
      <div className={`max-w-md w-full rounded-3xl border-2 overflow-hidden shadow-2xl ${invalid ? 'bg-red-900/40 border-red-500' : 'bg-mat-900 border-green-500'}`}>
        {/* Header banner */}
        <div className={`px-6 py-12 text-center ${invalid ? 'bg-red-600' : 'bg-green-600'}`}>
          {invalid ? (
            <>
              <XCircle className="w-24 h-24 text-white mx-auto mb-4" strokeWidth={1.5} />
              <h1 className="text-5xl font-black uppercase text-white tracking-tight font-exo">NO VÁLIDA</h1>
              <p className="text-white/90 text-sm font-bold uppercase tracking-widest mt-2">{result?.reason || 'Tarjeta no verificable'}</p>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-24 h-24 text-white mx-auto mb-4" strokeWidth={1.5} />
              <h1 className="text-5xl font-black uppercase text-white tracking-tight font-exo">VÁLIDA</h1>
              <p className="text-white/90 text-sm font-bold uppercase tracking-widest mt-2">Miembro MAT32 activo</p>
            </>
          )}
        </div>

        {/* Body */}
        {result && (
          <div className="p-8 space-y-4">
            {result.name && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Nombre</div>
                <div className="text-3xl font-black text-white font-exo tracking-tight">{result.name}</div>
              </div>
            )}

            {result.member_number && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Nº Miembro</div>
                <div className="text-2xl font-black text-mat-500 font-mono tracking-wider">{result.member_number}</div>
              </div>
            )}

            {result.issued_at && result.expires_at && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-mat-800">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-1">Emitida</div>
                  <div className="text-xs text-gray-300 font-mono">{new Date(result.issued_at).toLocaleDateString('es-ES')}</div>
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-1">Expira</div>
                  <div className="text-xs text-gray-300 font-mono">{new Date(result.expires_at).toLocaleDateString('es-ES')}</div>
                </div>
              </div>
            )}

            {result.last_checkin && (
              <div className="pt-4 border-t border-mat-800 flex items-center gap-2 text-xs text-gray-400">
                <Clock size={12} className="text-gray-500" />
                Última entrada: {new Date(result.last_checkin).toLocaleString('es-ES')}
              </div>
            )}

            {/* Bouncer instructions */}
            {result.valid && (
              <div className="mt-6 p-4 bg-mat-800/50 rounded-xl border border-mat-700">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle size={14} className="text-mat-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    <b className="text-white">Verifica que el nombre coincide con el DNI.</b> La tarjeta es personal e intransferible.
                  </p>
                </div>
              </div>
            )}

            {/* Check-in button (only if valid) */}
            {result.valid && !checkedIn && (
              <button
                onClick={doCheckin}
                disabled={checkingIn}
                className="w-full mt-4 py-4 bg-mat-500 hover:bg-mat-400 disabled:opacity-50 text-black font-black uppercase tracking-[0.3em] text-sm rounded-xl flex items-center justify-center gap-2"
              >
                {checkingIn ? <><Loader2 className="animate-spin" size={18} /> REGISTRANDO...</> : <><UserCheck size={18} /> REGISTRAR ENTRADA</>}
              </button>
            )}

            {checkedIn && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-black uppercase tracking-widest text-green-400">ENTRADA REGISTRADA</p>
              </div>
            )}
          </div>
        )}

        <div className="px-8 py-4 border-t border-mat-800 flex items-center justify-center gap-2 text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">
          <ShieldCheck size={10} /> MAT32 · VERIFICACIÓN DE MIEMBRO
        </div>
      </div>
    </div>
  );
};
