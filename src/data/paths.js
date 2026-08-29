export const PATHS = [
  {
    key: "NEG",
    name: "Negotiation",
    basis: "No statutory framework — settlement binds as a contract",
    statute: "Indian Contract Act, 1872",
    timeline: "15–30 days (party-set)",
    outcome: "Settlement agreement, enforceable as a contract",
    docket: "JN/NEG/2026/0417",
    steps: [
      { label: "Request", sub: "One party opens the file and states the claim.", active: true },
      { label: "Consent", sub: "The other side agrees to negotiate; a window is fixed." },
      { label: "Exchange", sub: "Documents and offers move through the platform." },
      { label: "Facilitator", sub: "Optional. Invited only if both sides ask." },
      { label: "Settlement", sub: "Terms recorded and executed digitally." }
    ],
    note: "There is no neutral here unless you invite one. That is what makes it fastest — and what makes it fail if either side is not negotiating in good faith."
  },
  {
    key: "MED",
    name: "Mediation",
    basis: "Mediated settlement enforceable as a judgment or decree",
    statute: "Mediation Act, 2023 · s. 27",
    timeline: "120 days, extendable by 60 (s. 18)",
    outcome: "Mediated settlement agreement",
    docket: "JN/MED/2026/0417",
    steps: [
      { label: "Filing", sub: "Claim and contract uploaded; pre-institution route flagged.", active: true },
      { label: "Appointment", sub: "Mediator appointed from the panel on domain and language fit." },
      { label: "Joint session", sub: "Opening session; issues narrowed on the record." },
      { label: "Caucus", sub: "Private sessions with each side, kept confidential." },
      { label: "Agreement", sub: "Terms drafted, signed and authenticated." }
    ],
    note: "For commercial disputes above the specified value, pre-institution mediation is the default first step under s. 12A of the Commercial Courts Act, 2015."
  },
  {
    key: "CON",
    name: "Conciliation",
    basis: "Settlement carries the same status as an arbitral award",
    statute: "Arbitration and Conciliation Act, 1996 · Part III, s. 74",
    timeline: "45–90 days (indicative)",
    outcome: "Settlement agreement with the force of an award",
    docket: "JN/CON/2026/0417",
    steps: [
      { label: "Invitation", sub: "Written invitation to conciliate; proceedings begin on acceptance.", active: true },
      { label: "Appointment", sub: "Conciliator appointed; statements of case exchanged." },
      { label: "Sessions", sub: "Conciliator may meet parties together or separately." },
      { label: "Proposal", sub: "Terms of settlement formulated and put to both sides." },
      { label: "Signature", sub: "Settlement signed and authenticated by the conciliator." }
    ],
    note: "The conciliator may actively propose terms — unlike a mediator, who facilitates."
  },
  {
    key: "ARB_FAST",
    name: "Fast-track arbitration",
    basis: "Award within six months; decided on documents unless oral hearing is sought",
    statute: "Arbitration and Conciliation Act, 1996 · s. 29B",
    timeline: "6 months from constitution",
    outcome: "Final arbitral award",
    docket: "JN/ARB/2026/0417",
    steps: [
      { label: "Reference", sub: "Invoked on the clause or by written agreement to fast-track.", active: true },
      { label: "Appointment", sub: "Sole arbitrator appointed from the panel." },
      { label: "Pleadings", sub: "Written submissions and documents filed on a fixed calendar." },
      { label: "Hearing", sub: "Only if a party requests it or the tribunal finds it necessary." },
      { label: "Award", sub: "Scrutinised, signed and issued with the case record." }
    ],
    note: "Best suited to document-heavy, fact-light matters: unpaid invoices and MSME claims."
  },
  {
    key: "ARB",
    name: "Arbitration",
    basis: "Award within twelve months of completion of pleadings, extendable by six",
    statute: "Arbitration and Conciliation Act, 1996 · s. 29A",
    timeline: "12 months + 6 by consent",
    outcome: "Final and binding arbitral award",
    docket: "JN/ARB/2026/0417",
    steps: [
      { label: "Invocation", sub: "Notice invoking the arbitration clause is served digitally.", active: true },
      { label: "Constitution", sub: "Tribunal constituted; disclosures and conflict checks completed." },
      { label: "Pleadings", sub: "Statement of claim, defence, counterclaim and documents." },
      { label: "Evidence", sub: "Affidavits, cross-examination and oral argument on video." },
      { label: "Award", sub: "Reasoned award, scrutinised before signature." }
    ],
    note: "A challenge under s. 34 is narrow by design."
  },
  {
    key: "LOK",
    name: "Lok Adalat",
    basis: "Award deemed a decree of a civil court; final, with no appeal",
    statute: "Legal Services Authorities Act, 1987 · s. 21",
    timeline: "Single sitting",
    outcome: "Award deemed a civil court decree",
    docket: "JN/LOK/2026/0417",
    steps: [
      { label: "Referral", sub: "Matter referred by a party or by a court to the sitting.", active: true },
      { label: "Bench", sub: "Panel constituted for the sitting." },
      { label: "Conciliation", sub: "Bench assists the parties towards a compromise." },
      { label: "Award", sub: "Compromise recorded as an award; no appeal lies." }
    ],
    note: "Fastest and cheapest, but it needs agreement — a Lok Adalat cannot adjudicate."
  }
];

const paths = {
  NEG: PATHS[0],
  MED: PATHS[1],
  CON: PATHS[2],
  ARB_FAST: PATHS[3],
  FTA: PATHS[3],
  ARB: PATHS[4],
  LOK: PATHS[5]
};

export default paths;