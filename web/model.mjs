export const fields = ['name','repo','goal','verified','blockers','evidence','next','owner'];
export function validateBackup(input) {
  if (!input || input.version !== 1 || !Array.isArray(input.projects) || input.projects.length > 300) throw new Error('Use an AI Bridge version 1 backup.');
  const ids = new Set();
  for (const p of input.projects) {
    if (!p || typeof p.id !== 'string' || !p.id || ids.has(p.id)) throw new Error('Project identifiers are missing or duplicated.');
    ids.add(p.id);
    for (const f of fields) if (typeof p[f] !== 'string' || p[f].length > 12000) throw new Error('A project field is invalid or too long.');
    if (!p.name.trim()) throw new Error('Every project needs a name.');
    if (p.repo && !/^https?:\/\//i.test(p.repo)) throw new Error('Source links must use HTTP or HTTPS.');
    if (!Array.isArray(p.history) || p.history.length > 30 || p.history.some(h => typeof h?.text !== 'string' || h.text.length > 100000 || typeof h?.date !== 'string')) throw new Error('Handoff history is invalid.');
  }
  return { version:1, active: ids.has(input.active) ? input.active : input.projects[0]?.id ?? '', projects: input.projects };
}
export function handoff(p) {
  return `# ${p.name}\n\nAssistant: ${p.owner}\nSource: ${p.repo || 'Not recorded'}\nUpdated: ${p.updated || 'Unsaved draft'}\n\n## Goal\n${p.goal || 'Not recorded'}\n\n## Verified complete\n${p.verified || 'No verified completion recorded.'}\n\n## Open work and blockers\n${p.blockers || 'Not recorded'}\n\n## Evidence and files\n${p.evidence || 'No evidence recorded.'}\n\n## Next execution sequence\n${p.next || 'Not recorded'}\n\nContinue from the evidence above. Do not infer tests, deployment, customers or revenue from this handoff.\n`;
}
