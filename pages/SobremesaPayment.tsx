import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Home as HomeIcon } from 'lucide-react';
import { dataService } from '../services/dataService';

export const SobremesaOk: React.FC = () => {
  const [params] = useSearchParams();
  const ref = params.get('ref');
  const [status, setStatus] = useState<'checking' | 'paid' | 'pending'>('checking');

  useEffect(() => {
    if (!ref) { setStatus('pending'); return; }
    (async () => {
      // Poll up to 5 times in case webhook/session update takes a moment
      for (let i = 0; i < 5; i++) {
        try {
          const r = await dataService.getSobremesaPaymentStatus(ref);
          if (r.status === 'paid') { setStatus('paid'); return; }
        } catch {}
        await new Promise(r => setTimeout(r, 1200));
      }
      setStatus('pending');
    })();
  }, [ref]);

  return (
    <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-mat-900 border-2 border-mat-500/40 rounded-3xl p-10 text-center space-y-4 shadow-2xl">
        {status === 'checking' ? (
          <>
            <Loader2 className="w-14 h-14 text-mat-500 mx-auto animate-spin" />
            <h1 className="text-2xl font-black uppercase text-white font-exo">Confirmando pago...</h1>
            <p className="text-gray-400 text-sm">Un momento.</p>
          </>
        ) : status === 'paid' ? (
          <>
            <CheckCircle2 className="w-20 h-20 text-mat-500 mx-auto" />
            <h1 className="text-3xl font-black uppercase text-white font-exo">Reserva confirmada.</h1>
            <p className="text-gray-400">Pago recibido. Te llegará un email con los detalles.</p>
            <p className="text-gray-600 text-xs font-mono">Ref: {ref}</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
              <HomeIcon size={14} /> VOLVER
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="w-14 h-14 text-mat-500 mx-auto animate-spin" />
            <h1 className="text-2xl font-black uppercase text-white font-exo">Procesando...</h1>
            <p className="text-gray-400 text-sm">
              El pago puede tardar unos segundos en reflejarse. Te enviaremos un email de confirmación en cuanto llegue.
            </p>
            <p className="text-gray-600 text-xs font-mono">Ref: {ref}</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-mat-800 hover:bg-mat-700 text-gray-300 text-xs font-black uppercase tracking-[0.3em] rounded-full">
              <HomeIcon size={14} /> VOLVER
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export const SobremesaCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-mat-900 border-2 border-red-500/40 rounded-3xl p-10 text-center space-y-4 shadow-2xl">
        <XCircle className="w-20 h-20 text-red-400 mx-auto" />
        <h1 className="text-3xl font-black uppercase text-white font-exo">Pago cancelado</h1>
        <p className="text-gray-400">La mesa no ha quedado reservada.</p>
        <p className="text-gray-500 text-sm">Puedes intentarlo de nuevo o elegir Bizum.</p>
        <Link to="/" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
          <HomeIcon size={14} /> VOLVER
        </Link>
      </div>
    </div>
  );
};
