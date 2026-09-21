/**
 * Инициализация компонента переключателя тем.
 */
function initThemeSwitcher() {
    const checkbox = document.getElementById('theme-switcher');

    if (!checkbox) {
        setTimeout(initThemeSwitcher, 10);
        return;
    }

    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    checkbox.checked = (currentTheme === 'dark');
    checkbox.addEventListener('change', () => {
        const targetTheme = checkbox.checked ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    });
}


initThemeSwitcher();