export const INITIAL_CLAIMS = [
  {
    id: "CLM-8921",
    claimantName: "Alexander Wright",
    policyNumber: "POL-HTH-7721",
    policyType: "Health Standard",
    claimType: "Medical Invoice",
    amount: 1450.00,
    coveredAmount: 1450.00,
    incidentDate: "2026-07-28",
    submittedDate: "2026-08-01",
    status: "Approved",
    confidence: 96.4,
    fraudRisk: "Low (4.2%)",
    fraudScore: 4.2,
    documentName: "st_jude_hospital_bill.pdf",
    explanation: "Medical invoice matches outpatient emergency policy limits under Section H-104. No exclusions apply. Total claim amount ($1,450.00) is within the $2,500 per-incident emergency coverage ceiling.",
    retrievedClause: "Section H-104: Outpatient Emergency Medical Expenses are covered up to $2,500.00 per event subject to a $100 copay.",
    evidence: [
      "Itemized hospital charge verified against St. Jude Medical System rates.",
      "Claimant policy POL-HTH-7721 is active with zero outstanding premiums.",
      "Diagnosis code ICD-10-S93.4 (Ankle Sprain) covered under emergency standard schedule."
    ],
    timeline: [
      { step: "Upload", status: "completed", timestamp: "10:14:02 AM", detail: "File st_jude_hospital_bill.pdf uploaded (1.8 MB)" },
      { step: "OCR Extraction", status: "completed", timestamp: "10:14:05 AM", detail: "Extracted $1,450.00 billing, Provider ID #88921" },
      { step: "Policy RAG Match", status: "completed", timestamp: "10:14:07 AM", detail: "Retrieved Section H-104 (Similarity 0.94)" },
      { step: "Fraud Analysis", status: "completed", timestamp: "10:14:08 AM", detail: "Zero duplicate invoices found across 100k database" },
      { step: "Decision Engine", status: "completed", timestamp: "10:14:09 AM", detail: "Auto-Approved (Confidence 96.4% >= 90% threshold)" }
    ]
  },
  {
    id: "CLM-8922",
    claimantName: "Sophia Martinez",
    policyNumber: "POL-AUT-4402",
    policyType: "Auto Premium",
    claimType: "Collision Damage Repair",
    amount: 8200.00,
    coveredAmount: 0.00,
    incidentDate: "2026-07-30",
    submittedDate: "2026-08-03",
    status: "Human Review",
    confidence: 78.2,
    fraudRisk: "Medium (24.8%)",
    fraudScore: 24.8,
    documentName: "auto_body_estimate_repair.pdf",
    explanation: "Repair estimate includes unverified aftermarket performance modifications (Exhaust & Spoiler upgrades, $3,200) not registered under primary vehicle schedule. Escalated to Claims Officer for manual adjustment.",
    retrievedClause: "Section A-302: Vehicle repairs are covered up to actual cash value for OEM replacement parts. Custom aftermarket non-factory accessories require endorsement endorsement A-MOD.",
    evidence: [
      "Collision estimate total $8,200.00 exceeds standard single-part auto threshold ($5,000).",
      "Line items 4-7 list non-OEM sport exhaust system.",
      "Policy record lacks endorsement A-MOD rider."
    ],
    timeline: [
      { step: "Upload", status: "completed", timestamp: "11:02:11 AM", detail: "File auto_body_estimate_repair.pdf uploaded" },
      { step: "OCR Extraction", status: "completed", timestamp: "11:02:14 AM", detail: "Extracted 12 repair items totaling $8,200.00" },
      { step: "Policy RAG Match", status: "completed", timestamp: "11:02:16 AM", detail: "Retrieved Section A-302 (Custom Accessories)" },
      { step: "Fraud Analysis", status: "completed", timestamp: "completed", detail: "Aftermarket parts flag triggered" },
      { step: "Decision Engine", status: "completed", timestamp: "11:02:19 AM", detail: "Escalated to Officer (Confidence 78.2% < 90% threshold)" }
    ]
  },
  {
    id: "CLM-8923",
    claimantName: "Marcus Vance",
    policyNumber: "POL-PRP-9011",
    policyType: "Property Gold",
    claimType: "Water Damage Infiltration",
    amount: 15400.00,
    coveredAmount: 15400.00,
    incidentDate: "2026-07-25",
    submittedDate: "2026-08-04",
    status: "Approved",
    confidence: 93.8,
    fraudRisk: "Low (8.1%)",
    fraudScore: 8.1,
    documentName: "restoration_invoice_water.pdf",
    explanation: "Sudden pipe burst damage verified via certified plumber inspection report. Property Gold policy Section P-201 covers water damage up to $50,000.",
    retrievedClause: "Section P-201: Direct physical loss from accidental discharge or overflow of water or steam from plumbing systems is fully covered.",
    evidence: [
      "Licensed plumber invoice confirms main line rupture.",
      "Moisture readings and thermal imaging logs attached.",
      "Claim amount $15,400 is within Property Gold limit ($50,000)."
    ],
    timeline: [
      { step: "Upload", status: "completed", timestamp: "02:40:15 PM", detail: "File restoration_invoice_water.pdf uploaded" },
      { step: "OCR Extraction", status: "completed", timestamp: "02:40:19 PM", detail: "Extracted plumber report and drying log" },
      { step: "Policy RAG Match", status: "completed", timestamp: "02:40:21 PM", detail: "Retrieved Section P-201 (Plumbing Burst)" },
      { step: "Fraud Analysis", status: "completed", timestamp: "02:40:22 PM", detail: "Verified license #PL-99203 against municipal directory" },
      { step: "Decision Engine", status: "completed", timestamp: "02:40:24 PM", detail: "Auto-Approved (Confidence 93.8% >= 90% threshold)" }
    ]
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-1001",
    timestamp: "2026-08-05 10:14:09",
    agent: "Decision Agent",
    claimId: "CLM-8921",
    action: "AUTO_APPROVE",
    confidence: 96.4,
    decision: "Claim Approved automatically based on verified Section H-104 clause match.",
    evidence: "Emergency treatment itemized receipt verified, $1,450 <= $2,500 policy ceiling.",
    piiStatus: "Masked (Claimant: A. W****, SSN: XXX-XX-4912)"
  },
  {
    id: "LOG-1002",
    timestamp: "2026-08-05 11:02:19",
    agent: "Decision Agent",
    claimId: "CLM-8922",
    action: "HUMAN_REVIEW_ESCALATION",
    confidence: 78.2,
    decision: "Escalated to Claims Officer due to confidence score below 90% threshold.",
    evidence: "Unregistered aftermarket parts ($3,200) detected in repair estimate.",
    piiStatus: "Masked (Claimant: S. M****, Phone: +1 (555) ***-8821)"
  },
  {
    id: "LOG-1003",
    timestamp: "2026-08-05 11:02:17",
    agent: "Fraud Agent",
    claimId: "CLM-8922",
    action: "FRAUD_FLAG_TRIGGERED",
    confidence: 85.0,
    decision: "Fraud Risk flagged at 24.8% (Medium Risk).",
    evidence: "Repair invoice contains non-OEM part modifications.",
    piiStatus: "Masked (Policy: POL-***-4402)"
  },
  {
    id: "LOG-1004",
    timestamp: "2026-08-05 11:02:14",
    agent: "Document Agent",
    claimId: "CLM-8922",
    action: "OCR_EXTRACTION_SUCCESS",
    confidence: 98.5,
    decision: "Extracted 12 structured fields from auto_body_estimate_repair.pdf.",
    evidence: "Azure AI Document Intelligence read table matrix with 100% field completeness.",
    piiStatus: "Masked (Provider: Apex *** Motors)"
  }
];
