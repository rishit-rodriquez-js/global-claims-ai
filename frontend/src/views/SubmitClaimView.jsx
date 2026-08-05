import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import ProgressTimeline from '../components/ProgressTimeline.jsx';

export default function SubmitClaimView({ onSubmitClaimSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    claimantName: 'Eleanor Vance',
    policyNumber: 'POL-HTH-7721',
    policyType: 'Health Standard',
    claimType: 'Emergency Medical',
    amount: '1850.00',
    incidentDate: '2026-08-02',
    description: 'Emergency department consultation and X-ray imaging for acute wrist injury.'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setProcessingStep(1);

    // Simulate 4-agent timeline progress steps (2s total for crisp demo)
    setTimeout(() => setProcessingStep(2), 1200);
    setTimeout(() => setProcessingStep(3), 2400);
    setTimeout(() => setProcessingStep(4), 3600);

    setTimeout(() => {
      setIsProcessing(false);
      const newClaim = {
        id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
        claimantName: formData.claimantName,
        policyNumber: formData.policyNumber,
        policyType: formData.policyType,
        claimType: formData.claimType,
        amount: parseFloat(formData.amount) || 1850.00,
        coveredAmount: parseFloat(formData.amount) || 1850.00,
        incidentDate: formData.incidentDate,
        submittedDate: new Date().toISOString().split('T')[0],
        status: parseFloat(formData.amount) > 5000 ? "Human Review" : "Approved",
        confidence: parseFloat(formData.amount) > 5000 ? 84.5 : 95.2,
        fraudRisk: parseFloat(formData.amount) > 5000 ? "Medium (18.4%)" : "Low (3.1%)",
        fraudScore: parseFloat(formData.amount) > 5000 ? 18.4 : 3.1,
        documentName: selectedFile ? selectedFile.name : "medical_emergency_bill.pdf",
        explanation: `Claim for ${formData.claimType} of $${formData.amount} evaluated under policy ${formData.policyNumber}. Standard emergency coverage applies with itemized hospital verification.`,
        retrievedClause: "Section H-104: Emergency medical evaluation and diagnostic imaging are covered up to $2,500.00 per event.",
        evidence: [
          "Itemized billing statement extracted via Azure AI Document Intelligence.",
          "Claimant policy POL-HTH-7721 active with zero lapse in coverage.",
          "Verified diagnostic code ICD-10-M79.641 (Right Hand Pain)."
        ],
        timeline: [
          { step: "Upload", status: "completed", timestamp: "Just now", detail: `File ${selectedFile ? selectedFile.name : "medical_emergency_bill.pdf"} uploaded` },
          { step: "OCR", status: "completed", timestamp: "Just now", detail: `Extracted $${formData.amount} billing matrix` },
          { step: "Policy Match", status: "completed", timestamp: "Just now", detail: "Retrieved Section H-104 (Similarity 0.95)" },
          { step: "Fraud Check", status: "completed", timestamp: "Just now", detail: "Zero duplicate invoices detected" },
          { step: "Reasoning", status: "completed", timestamp: "Just now", detail: "Grounded reasoning engine evaluated coverage limits" },
          { step: "Decision", status: "completed", timestamp: "Just now", detail: "Decision rendered cleanly" }
        ]
      };
      onSubmitClaimSuccess(newClaim);
    }, 4800);
  };

  return (
    <div class="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] flex items-center justify-between">
        <div>
          <h1 class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileText class="w-5 h-5 text-blue-400" />
            File New Insurance Claim
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Submit claim details and supporting documents for GenAI automated processing</p>
        </div>

        {/* Step Indicator */}
        <div class="flex items-center gap-2 text-xs">
          <span class={`px-2.5 py-1 rounded font-semibold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1. Details</span>
          <span class="text-slate-600">→</span>
          <span class={`px-2.5 py-1 rounded font-semibold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2. Upload & AI Run</span>
        </div>
      </div>

      {isProcessing && (
        <ProgressTimeline currentStep={processingStep} />
      )}

      {!isProcessing && step === 1 && (
        <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-6">
          <h2 class="text-sm font-semibold text-white border-b border-slate-800 pb-3">Step 1: Claimant & Policy Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block text-slate-400 font-medium mb-1.5">Claimant Full Name</label>
              <input
                type="text"
                value={formData.claimantName}
                onChange={(e) => setFormData({ ...formData, claimantName: e.target.value })}
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-slate-400 font-medium mb-1.5">Policy Number</label>
              <input
                type="text"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-slate-400 font-medium mb-1.5">Policy Category</label>
              <select
                value={formData.policyType}
                onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Health Standard">Health Standard</option>
                <option value="Auto Premium">Auto Premium</option>
                <option value="Property Gold">Property Gold</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-400 font-medium mb-1.5">Claim Type</label>
              <input
                type="text"
                value={formData.claimType}
                onChange={(e) => setFormData({ ...formData, claimType: e.target.value })}
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-slate-400 font-medium mb-1.5">Claim Amount ($ USD)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-slate-400 font-medium mb-1.5">Incident Date</label>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-400 text-xs font-medium mb-1.5">Incident Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>Next: Upload Documents</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!isProcessing && step === 2 && (
        <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-6">
          <h2 class="text-sm font-semibold text-white border-b border-slate-800 pb-3">Step 2: Upload Supporting Evidence</h2>

          {/* Drag and Drop Zone */}
          <div class="border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-xl p-8 text-center bg-slate-900/40 transition-colors">
            <UploadCloud class="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p class="text-xs font-semibold text-white">Drag & drop your medical bill, repair estimate, or invoice PDF</p>
            <p class="text-[11px] text-slate-500 mt-1">Supported formats: PDF, PNG, JPG (Max 10MB)</p>

            <label class="mt-4 inline-block">
              <span class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 cursor-pointer transition-colors">
                Browse Files
              </span>
              <input type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" class="hidden" />
            </label>

            {selectedFile && (
              <div class="mt-4 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs text-blue-300 font-mono">
                <FileText class="w-4 h-4 text-blue-400" />
                <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          <div class="p-4 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-2">
            <div class="flex items-center gap-2 text-white font-medium">
              <ShieldCheck class="w-4 h-4 text-emerald-400" />
              <span>AI Security & Guardrails Active</span>
            </div>
            <p class="text-[11px]">
              Uploaded files are strictly parsed as reference data via Azure Document Intelligence. PII data is masked, and embedded prompt instructions are sanitized.
            </p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleStartProcessing}
              class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <span>Run AI Processing Pipeline</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
