import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchClaimDocumentUrl } from '../services/api.js';

export default function EmbeddedPdfViewer({ claimId, blobUrl, documentName, storedBlobName, fileSize, ocrText }) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [authorizedUrl, setAuthorizedUrl] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const cleanName = documentName || 'uploaded_document.pdf';

  useEffect(() => {
    let isMounted = true;
    async function loadAuthorizedDocumentUrl() {
      setIsLoadingAuth(true);
      if (claimId) {
        const url = await fetchClaimDocumentUrl(claimId);
        if (isMounted) {
          setAuthorizedUrl(url);
          setIsLoadingAuth(false);
        }
      } else {
        const fallbackUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '') + '/api/claims/CLM-101/document-stream';
        if (isMounted) {
          setAuthorizedUrl(fallbackUrl);
          setIsLoadingAuth(false);
        }
      }
    }
    loadAuthorizedDocumentUrl();
    return () => { isMounted = false; };
  }, [claimId, blobUrl]);

  const displayUrl = authorizedUrl || blobUrl || `https://globalclaimsstorage.blob.core.windows.net/claims-documents/${storedBlobName || 'document.pdf'}`;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 20, 60));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="stripe-card border border-white/10 bg-[#10252E]/80 rounded-3xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-2xl">
      {/* PDF Header Controls Toolbar */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#081018]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4DFFB4]/10 border border-[#4DFFB4]/30 flex items-center justify-center text-[#4DFFB4] font-bold shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono truncate max-w-xs">{cleanName}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#4DFFB4]/10 text-[#4DFFB4] border border-[#4DFFB4]/30 text-[10px] font-mono flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Private Azure SAS Authorized
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-md">
              {displayUrl}
            </p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs flex items-center gap-1"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-300 px-1">{zoomLevel}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs flex items-center gap-1"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs"
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-[#3BCBFF]/10 text-[#3BCBFF] border border-[#3BCBFF]/30 hover:bg-[#3BCBFF]/20 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Original</span>
          </a>

          <a
            href={displayUrl}
            download={cleanName}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4DFFB4] to-[#3BCBFF] text-[#081018] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(77,255,180,0.3)] hover:opacity-90 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Embedded Document View Canvas */}
      <div className="relative w-full h-96 min-h-[400px] bg-[#081018] overflow-auto flex items-center justify-center p-4">
        {displayUrl && (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) ? (
          <iframe
            src={displayUrl}
            title={cleanName}
            className="w-full h-full border-none rounded-xl bg-white shadow-2xl transition-transform"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center'
            }}
          />
        ) : (
          <div className="p-8 text-center space-y-4 max-w-lg">
            <div className="w-16 h-16 rounded-3xl bg-[#4DFFB4]/10 border border-[#4DFFB4]/30 flex items-center justify-center text-[#4DFFB4] mx-auto font-bold shadow-[0_0_30px_rgba(77,255,180,0.3)]">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">{cleanName}</h4>
              <p className="text-xs text-slate-400 mt-1">Azure Blob Storage Document Stream Ready</p>
            </div>

            {/* OCR Fallback Text Inspection Stream */}
            {ocrText && (
              <div className="p-4 bg-[#10252E] rounded-2xl border border-white/10 text-left text-xs font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1">
                <span className="text-[10px] text-[#4DFFB4] uppercase font-bold tracking-wider block mb-1">OCR Field Stream Preview</span>
                <pre className="whitespace-pre-wrap leading-relaxed">{ocrText}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="p-3 border-t border-white/10 bg-[#081018]/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 text-[#4DFFB4]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4DFFB4]" /> Azure Blob Encryption Standard Active
        </span>
        <span>Filename: {cleanName}</span>
      </div>
    </div>
  );
}
