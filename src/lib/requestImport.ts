export const requestLabelColors = ['#4f8cff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#a3e635'];

export type ImportedRequestDraft = {
  title: string;
  deadline: string;
  details: string;
  labelColor: string;
};

function pad(value: string) {
  return value.padStart(2, '0');
}

function parseDate(text: string) {
  const iso = text.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  const dotted = text.match(/\b(\d{1,2})\.(\d{1,2})(?:\.(20\d{2}))?\b/);
  const time = text.match(/\b(\d{1,2}):(\d{2})\b/);
  const hours = time ? pad(time[1]) : '18';
  const minutes = time ? time[2] : '00';

  if (iso) return `${iso[1]}-${pad(iso[2])}-${pad(iso[3])}T${hours}:${minutes}`;
  if (dotted) {
    const year = dotted[3] ?? String(new Date().getFullYear());
    return `${year}-${pad(dotted[2])}-${pad(dotted[1])}T${hours}:${minutes}`;
  }

  return '';
}

export function parseTelegramRequest(text: string): ImportedRequestDraft {
  const cleanLines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const titleLine = cleanLines.find((line) => !/дедлайн|deadline|срок|дата/i.test(line)) ?? cleanLines[0] ?? '';

  return {
    title: titleLine.replace(/^[-•\s]+/, '').slice(0, 80),
    deadline: parseDate(text),
    details: cleanLines.join('\n'),
    labelColor: requestLabelColors[0],
  };
}
