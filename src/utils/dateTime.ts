export function getKoreaToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function parseDateParts(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

export function getKoreaTodayDate() {
  const { year, month, day } = parseDateParts(getKoreaToday());
  return new Date(year, month - 1, day);
}
