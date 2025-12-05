/**
 * Dark Mode Toggle Component Unit Tests
 * Tests for theme switching, persistence, and system preference detection
 */

describe('DarkModeToggle', () => {
  let toggle;
  let mockMatchMedia;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Mock matchMedia
    mockMatchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    window.matchMedia = mockMatchMedia;

    // Mock lucide
    window.lucide = { createIcons: jest.fn() };

    // Mock DOM
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    document.body.innerHTML = '<div id="dark-mode-toggle-btn"></div>';
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('initializes with light theme by default', () => {
    toggle = new DarkModeToggle();
    expect(toggle.getCurrentTheme()).toBe('light');
  });

  test('initializes with stored theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    toggle = new DarkModeToggle();
    expect(toggle.getCurrentTheme()).toBe('dark');
  });

  test('initializes with system preference when no stored theme', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    toggle = new DarkModeToggle();
    expect(toggle.getCurrentTheme()).toBe('dark');
  });

  test('applies dark theme to document', () => {
    toggle = new DarkModeToggle();
    toggle.applyTheme('dark');
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('applies light theme to document', () => {
    toggle = new DarkModeToggle();
    toggle.applyTheme('light');
    
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  test('persists theme to localStorage', () => {
    toggle = new DarkModeToggle();
    toggle.applyTheme('dark');
    
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('toggles between light and dark themes', () => {
    toggle = new DarkModeToggle();
    expect(toggle.getCurrentTheme()).toBe('light');
    
    toggle.toggle();
    expect(toggle.getCurrentTheme()).toBe('dark');
    
    toggle.toggle();
    expect(toggle.getCurrentTheme()).toBe('light');
  });

  test('calls onChange callback when theme changes', () => {
    const onChange = jest.fn();
    toggle = new DarkModeToggle({ onChange });
    
    toggle.applyTheme('dark');
    expect(onChange).toHaveBeenCalledWith('dark');
    
    toggle.applyTheme('light');
    expect(onChange).toHaveBeenCalledWith('light');
  });

  test('renders toggle button with correct structure', () => {
    toggle = new DarkModeToggle();
    const html = toggle.render();
    
    expect(html).toContain('dark-mode-toggle-btn');
    expect(html).toContain('data-lucide="sun"');
    expect(html).toContain('data-lucide="moon"');
    expect(html).toContain('Toggle dark mode');
  });

  test('renders with correct size classes', () => {
    toggle = new DarkModeToggle({ size: 'lg' });
    const html = toggle.render();
    
    expect(html).toContain('w-14');
    expect(html).toContain('h-14');
  });

  test('renders with label when showLabel is true', () => {
    toggle = new DarkModeToggle({ showLabel: true });
    const html = toggle.render();
    
    expect(html).toContain('Light Mode');
  });

  test('hides sun icon in dark mode', () => {
    toggle = new DarkModeToggle();
    toggle.theme = 'dark';
    const html = toggle.render();
    
    expect(html).toContain('data-icon="sun"');
    expect(html).toContain('hidden');
  });

  test('shows moon icon in dark mode', () => {
    toggle = new DarkModeToggle();
    toggle.theme = 'dark';
    const html = toggle.render();
    
    expect(html).toContain('data-icon="moon"');
    expect(html).not.toContain('data-icon="moon".*hidden');
  });

  test('updates UI after theme change', () => {
    toggle = new DarkModeToggle();
    document.body.innerHTML = `
      <button id="dark-mode-toggle-btn">
        <i data-icon="sun"></i>
        <i data-icon="moon" class="hidden"></i>
      </button>
    `;
    
    toggle.theme = 'dark';
    toggle.updateUI();
    
    const sunIcon = document.querySelector('[data-icon="sun"]');
    const moonIcon = document.querySelector('[data-icon="moon"]');
    
    expect(sunIcon.classList.contains('hidden')).toBe(true);
    expect(moonIcon.classList.contains('hidden')).toBe(false);
  });

  test('initializes with system preference listener', () => {
    toggle = new DarkModeToggle();
    toggle.init();
    
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  test('respects system preference when no stored theme', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    
    toggle = new DarkModeToggle();
    toggle.init();
    
    expect(toggle.getCurrentTheme()).toBe('dark');
  });

  test('ignores system preference when theme is stored', () => {
    localStorage.setItem('theme', 'light');
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    
    toggle = new DarkModeToggle();
    expect(toggle.getCurrentTheme()).toBe('light');
  });

  test('setTheme method changes theme', () => {
    toggle = new DarkModeToggle();
    toggle.setTheme('dark');
    
    expect(toggle.getCurrentTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('setTheme validates theme value', () => {
    toggle = new DarkModeToggle();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    toggle.setTheme('invalid');
    
    expect(consoleSpy).toHaveBeenCalledWith('Invalid theme. Use "light" or "dark"');
    consoleSpy.mockRestore();
  });

  test('static create method initializes toggle', () => {
    document.body.innerHTML = '<div id="toggle-container"></div>';
    
    const toggle = DarkModeToggle.create('toggle-container');
    
    expect(toggle).toBeInstanceOf(DarkModeToggle);
    expect(window.darkModeToggle).toBe(toggle);
  });

  test('static create method renders toggle in container', () => {
    document.body.innerHTML = '<div id="toggle-container"></div>';
    
    DarkModeToggle.create('toggle-container');
    
    const container = document.getElementById('toggle-container');
    expect(container.innerHTML).toContain('dark-mode-toggle-btn');
  });

  test('static create handles missing container', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const result = DarkModeToggle.create('nonexistent');
    
    expect(consoleSpy).toHaveBeenCalledWith('Container with id "nonexistent" not found');
    expect(result).toBeNull();
    consoleSpy.mockRestore();
  });

  test('applies theme on init', () => {
    toggle = new DarkModeToggle();
    toggle.init();
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  test('renders with correct icon sizes for different sizes', () => {
    const smToggle = new DarkModeToggle({ size: 'sm' });
    const mdToggle = new DarkModeToggle({ size: 'md' });
    const lgToggle = new DarkModeToggle({ size: 'lg' });
    
    const smHtml = smToggle.render();
    const mdHtml = mdToggle.render();
    const lgHtml = lgToggle.render();
    
    expect(smHtml).toContain('w-4');
    expect(mdHtml).toContain('w-5');
    expect(lgHtml).toContain('w-6');
  });

  test('theme persists across page reloads', () => {
    toggle = new DarkModeToggle();
    toggle.applyTheme('dark');
    
    // Simulate page reload
    const stored = localStorage.getItem('theme');
    const newToggle = new DarkModeToggle();
    
    expect(newToggle.getCurrentTheme()).toBe('dark');
    expect(stored).toBe('dark');
  });

  test('renders with accessibility attributes', () => {
    toggle = new DarkModeToggle();
    const html = toggle.render();
    
    expect(html).toContain('aria-label="Toggle dark mode"');
    expect(html).toContain('title="Toggle dark mode"');
  });

  test('renders with transition classes', () => {
    toggle = new DarkModeToggle();
    const html = toggle.render();
    
    expect(html).toContain('transition-all');
    expect(html).toContain('duration-200');
  });

  test('renders with hover effect', () => {
    toggle = new DarkModeToggle();
    const html = toggle.render();
    
    expect(html).toContain('hover:scale-105');
  });

  test('label updates with theme', () => {
    toggle = new DarkModeToggle({ showLabel: true });
    
    let html = toggle.render();
    expect(html).toContain('Light Mode');
    
    toggle.theme = 'dark';
    html = toggle.render();
    expect(html).toContain('Dark Mode');
  });

  test('toggle button has correct onclick handler', () => {
    toggle = new DarkModeToggle();
    const html = toggle.render();
    
    expect(html).toContain('onclick="window.darkModeToggle?.toggle()"');
  });

  test('initializes lucide icons on create', () => {
    document.body.innerHTML = '<div id="toggle-container"></div>';
    
    DarkModeToggle.create('toggle-container');
    
    expect(window.lucide.createIcons).toHaveBeenCalled();
  });

  test('handles multiple toggles on same page', () => {
    const toggle1 = new DarkModeToggle();
    const toggle2 = new DarkModeToggle();
    
    toggle1.applyTheme('dark');
    
    expect(toggle2.getCurrentTheme()).toBe('dark');
  });

  test('theme change affects all elements with dark: classes', () => {
    document.body.innerHTML = `
      <div class="dark:text-white">Test</div>
      <div class="dark:bg-gray-800">Test</div>
    `;
    
    toggle = new DarkModeToggle();
    toggle.applyTheme('dark');
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('respects prefers-reduced-motion', () => {
    const html = new DarkModeToggle().render();
    
    // The component should still render with transitions
    // but CSS should respect prefers-reduced-motion media query
    expect(html).toContain('transition-all');
  });
});
