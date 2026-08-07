'use client';

import React, { useState } from 'react';
import { Terminal, Play, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { runSystemDiagnostic } from '@/app/actions/diagnosticActions';

export default function TestEnginePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRunDiagnostic = async () => {
    setIsRunning(true);
    setResults(null);
    try {
      const res = await runSystemDiagnostic();
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'SUCCESS') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (status === 'FAILED') return <XCircle className="w-5 h-5 text-red-500" />;
    return <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />;
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-neutral-800 pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
              <Terminal className="w-8 h-8 text-red-600" />
              SYSTEM DIAGNOSTIC
            </h1>
            <p className="text-zinc-500 text-sm">Automated E2E Verification Engine: Database, Storage, Email</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div>
          <button 
            onClick={handleRunDiagnostic}
            disabled={isRunning}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-6 transition-colors flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRunning ? (
              <>
                <span>EXECUTING TEST PROTOCOL...</span>
                <Loader2 className="w-6 h-6 animate-spin" />
              </>
            ) : (
              <>
                <span>EXECUTE FULL SYSTEM DIAGNOSTIC</span>
                <Play className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        {/* TERMINAL OUTPUT */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-sm p-6 md:p-8 min-h-[300px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600/50" />
          <h3 className="text-xs font-bold text-zinc-600 tracking-widest uppercase mb-6">Execution Log</h3>
          
          {!results && !isRunning && (
            <div className="text-zinc-500 text-sm flex items-center h-full justify-center mt-20">
              System standing by. Awaiting execution command.
            </div>
          )}

          {isRunning && !results && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span>Pinging Supabase Database...</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span>Validating Storage Bucket Write Permissions...</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span>Dispatching Test Payload to Resend API...</span>
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {/* DATABASE */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/50 border border-neutral-800 rounded-sm gap-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(results.database.status)}
                  <div>
                    <div className="font-bold uppercase tracking-widest">Database</div>
                    <div className="text-xs text-zinc-500 mt-1">Supabase PostgreSQL Connection</div>
                  </div>
                </div>
                <div className={`text-xs font-bold tracking-widest px-3 py-1 rounded-sm uppercase ${results.database.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {results.database.message}
                </div>
              </div>

              {/* STORAGE */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/50 border border-neutral-800 rounded-sm gap-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(results.storage.status)}
                  <div>
                    <div className="font-bold uppercase tracking-widest">Storage</div>
                    <div className="text-xs text-zinc-500 mt-1">Bucket: tracks (Write/Delete Validation)</div>
                  </div>
                </div>
                <div className={`text-xs font-bold tracking-widest px-3 py-1 rounded-sm uppercase ${results.storage.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {results.storage.message}
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/50 border border-neutral-800 rounded-sm gap-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(results.email.status)}
                  <div>
                    <div className="font-bold uppercase tracking-widest">Email Pipeline</div>
                    <div className="text-xs text-zinc-500 mt-1">Resend API Dispatcher</div>
                  </div>
                </div>
                <div className={`text-xs font-bold tracking-widest px-3 py-1 rounded-sm uppercase ${results.email.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {results.email.message}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
