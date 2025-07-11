export function isValidPhase1(phase: string[][]) {
  if (phase.length !== 2) return false;

  return phase.every(group => {
    if (group.length !== 3) return false;
    const numbers = group.map(c => c.replace(/^[RGBY]/, ''));
    return numbers.every(n => n === numbers[0]);
  });
}
