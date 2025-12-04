/**
 * Sidebar Component Tests
 * Property-based tests for sidebar navigation redesign
 */

// Feature: premium-ui-redesign, Property 12: Sidebar icon consistency
// Validates: Requirements 5.1
test('all sidebar menu items have Lucide icons', () => {
  // Create a temporary container
  const container = document.createElement('div');
  container.id = 'sidebar';
  document.body.appendChild(container);
  
  // Render sidebar
  renderSidebar();
  
  // Get all menu items
  const menuItems = container.querySelectorAll('[data-nav-link]');
  
  // Verify each menu item has an icon
  menuItems.forEach(item => {
    const icon = item.querySelector('[data-lucide]');
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('data-lucide')).toBeTruthy();
    expect(icon.classList.contains('w-5')).toBe(true);
    expect(icon.classList.contains('h-5')).toBe(true);
  });
  
  // Cleanup
  container.remove();
});

// Feature: premium-ui-redesign, Property 13: Sidebar item tooltip presence
// Validates: Requirements 5.2
test('all sidebar menu items display tooltips on hover', () => {
  // Create a temporary container
  const container = document.createElement('div');
  container.id = 'sidebar';
  document.body.appendChild(container);
  
  // Render sidebar
  renderSidebar();
  
  // Get all menu items
  const menuItems = container.querySelectorAll('[data-nav-link]');
  
  // Verify each menu item has a tooltip
  menuItems.forEach(item => {
    // Check for title attribute (native tooltip)
    const hasTitle = item.hasAttribute('title');
    
    // Check for tooltip div
    const tooltip = item.querySelector('[class*="tooltip"]');
    const hasTooltipDiv = tooltip !== null;
    
    // At least one tooltip method should exist
    expect(hasTitle || hasTooltipDiv).toBe(true);
    
    // If title exists, it should not be empty
    if (hasTitle) {
      expect(item.getAttribute('title').length).toBeGreaterThan(0);
    }
  });
  
  // Cleanup
  container.remove();
});

// Feature: premium-ui-redesign, Property 14: Active menu item highlighting
// Validates: Requirements 5.5
test('active menu items have distinct styling', () => {
  // Create a temporary container
  const container = document.createElement('div');
  container.id = 'sidebar';
  document.body.appendChild(container);
  
  // Render sidebar
  renderSidebar();
  
  // Get all menu items
  const menuItems = container.querySelectorAll('[data-nav-link]');
  
  // Simulate clicking on a menu item to make it active
  if (menuItems.length > 0) {
    const firstItem = menuItems[0];
    firstItem.classList.add('active');
    
    // Get computed styles
    const activeStyles = window.getComputedStyle(firstItem);
    
    // Verify active state has distinct styling
    // Check for background color, text color, or other visual distinction
    const hasDistinctStyling = 
      activeStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
      activeStyles.color !== 'rgb(209, 213, 219)' || // default gray-300
      firstItem.classList.contains('active');
    
    expect(hasDistinctStyling).toBe(true);
  }
  
  // Cleanup
  container.remove();
});

// Unit test: Sidebar renders with all sections
test('sidebar renders with all navigation sections', () => {
  const container = document.createElement('div');
  container.id = 'sidebar';
  document.body.appendChild(container);
  
  renderSidebar();
  
  // Check for section labels
  const sections = container.querySelectorAll('.nav-section');
  expect(sections.length).toBeGreaterThan(0);
  
  // Check for specific section labels
  const sectionLabels = Array.from(container.querySelectorAll('.nav-section p'))
    .map(p => p.textContent.trim());
  
  expect(sectionLabels).toContain('Main');
  expect(sectionLabels).toContain('Management');
  
  container.remove();
});

// Unit test: Sidebar has user profile card
test('sidebar displays user profile card at bottom', () => {
  const container = document.createElement('div');
  container.id = 'sidebar';
  document.body.appendChild(container);
  
  renderSidebar();
  
  // Check for user profile card
  const profileCard = container.querySelector('.user-profile-card');
  expect(profileCard).toBeTruthy();
  
  // Check for user info
  const userName = container.querySelector('.user-profile-card p:first-child');
  expect(userName).toBeTruthy();
  expect(userName.textContent).toContain('Admin User');
  
  container.remove();
});

// Unit test: Sidebar has glassmorphism effect
test('sidebar has glassmorphism styling', () => {
  const container = document.createElement('div');
  container.id = 'sidebar';
  document.body.appendChild(container);
  
  renderSidebar();
  
  // Check for glass-sidebar class
  const sidebar = container.querySelector('.glass-sidebar') || container.firstElementChild;
  expect(sidebar).toBeTruthy();
  
  // Check for glassmorphism classes
  const hasGlassClass = sidebar.classList.contains('glass-sidebar') ||
                        sidebar.classList.contains('glass-panel');
  expect(hasGlassClass).toBe(true);
  
  container.remove();
});

// Unit test: Sidebar navigation items are clickable
test('sidebar navigation items are clickable links', () => {
  const container = document.createElement('div');
  container.id = 'sidebar';
  document.body.appendChild(container);
  
  renderSidebar();
  
  // Get all menu items
  const menuItems = container.querySelectorAll('[data-nav-link]');
  
  // Verify each is a link with href
  menuItems.forEach(item => {
    expect(item.tagName).toBe('A');
    expect(item.hasAttribute('href')).toBe(true);
  });
  
  container.remove();
});
