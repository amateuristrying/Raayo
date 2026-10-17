const themeButton = document.getElementById('theme-toggle');
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
}
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('raayo:landing-theme', theme); } catch {}
  updateThemeButton();
  window.dispatchEvent(new CustomEvent('raayo:theme', { detail: theme }));
});
updateThemeButton();
