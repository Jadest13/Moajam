export function loadPreferences(scope = 'm1'): Record<string, unknown> {
  try {
    return JSON.parse(
      localStorage.getItem(`moajam-preferences/${scope}`) ??
        (scope === 'm1' ? localStorage.getItem('moajam-preferences') : null) ??
        '{}',
    );
  } catch {
    return {};
  }
}
export function savePreferences(value: unknown, scope = 'm1') {
  localStorage.setItem(`moajam-preferences/${scope}`, JSON.stringify(value));
}
