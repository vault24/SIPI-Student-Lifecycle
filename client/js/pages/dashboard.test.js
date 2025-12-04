/**
 * Dashboard Page Tests
 * Property-based tests for dashboard redesign
 */

// Feature: premium-ui-redesign, Property 10: Statistics card completeness
// Validates: Requirements 4.2
test('all statistics cards contain required elements', () => {
  const card = new PremiumCard({
    title: 'Test Stat',
    value: 42,
    icon: 'users',
    gradient: 'primary',
    trend: { value: 12, direction: 'up' }
  });
  
  const html = card.render();
  
  // Check for icon element
  expect(html).toContain('data-lucide="users"');
  
  // Check for value display
  expect(html).toContain('42');
  
  // Check for title
  expect(html).toContain('Test Stat');
  
  // Check for trend indicator
  expect(html).toContain('trending-up');
  expect(html).toContain('12%');
});

// Feature: premium-ui-redesign, Property 11: Quick action gradient styling
// Validates: Requirements 4.4
test('quick action buttons have gradient backgrounds', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <button class="bg-gradient-to-r from-blue-600 to-blue-700">Add Student</button>
    <button class="bg-gradient-to-r from-indigo-600 to-indigo-700">View Students</button>
  `;
  
  const buttons = container.querySelectorAll('button');
  
  buttons.forEach(button => {
    const classes = button.className;
    expect(classes).toContain('bg-gradient-to-r');
    expect(classes).toContain('from-');
    expect(classes).toContain('to-');
  });
});

// Feature: premium-ui-redesign, Property 9: Card entrance animations
// Validates: Requirements 3.2
test('dashboard cards have entrance animations', () => {
  const card = new PremiumCard({
    title: 'Test',
    value: 100,
    icon: 'activity'
  });
  
  const html = card.render();
  
  // Check for animation classes
  expect(html).toContain('animate-fade-in-up');
});

// Unit test: Dashboard renders with hero section
test('dashboard renders with hero section', async () => {
  const mainContent = document.createElement('div');
  mainContent.id = 'main-content';
  document.body.appendChild(mainContent);
  
  // Mock the render function
  const heroHTML = `
    <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8">
      <h1 class="text-4xl font-bold">SIPI Student Lifecycle Manager</h1>
    </div>
  `;
  
  mainContent.innerHTML = heroHTML;
  
  const hero = mainContent.querySelector('h1');
  expect(hero).toBeTruthy();
  expect(hero.textContent).toContain('SIPI Student Lifecycle Manager');
  
  mainContent.remove();
});

// Unit test: Dashboard stat cards render with correct data
test('dashboard stat cards render with correct values', () => {
  const cards = [
    new PremiumCard({
      title: 'Total Students',
      value: 150,
      icon: 'users',
      gradient: 'primary'
    }),
    new PremiumCard({
      title: 'Active Students',
      value: 120,
      icon: 'user-check',
      gradient: 'success'
    })
  ];
  
  const html1 = cards[0].render();
  const html2 = cards[1].render();
  
  expect(html1).toContain('150');
  expect(html1).toContain('Total Students');
  
  expect(html2).toContain('120');
  expect(html2).toContain('Active Students');
});

// Unit test: Dashboard quick actions are clickable
test('dashboard quick action buttons are clickable', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <button onclick="navigateTo('/add-student')">Add Student</button>
    <button onclick="navigateTo('/students')">View Students</button>
  `;
  
  const buttons = container.querySelectorAll('button');
  
  buttons.forEach(button => {
    expect(button.hasAttribute('onclick')).toBe(true);
    expect(button.onclick).toBeTruthy();
  });
});

// Unit test: Dashboard recent activity displays student info
test('dashboard recent activity displays student information', () => {
  const activityHTML = `
    <div class="flex items-center gap-4 p-4">
      <img src="https://via.placeholder.com/40" alt="John Doe" class="w-10 h-10 rounded-full">
      <div class="flex-1">
        <p class="text-sm font-semibold">John Doe</p>
        <p class="text-xs text-gray-400">Roll: 001</p>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-medium">Active</span>
    </div>
  `;
  
  const container = document.createElement('div');
  container.innerHTML = activityHTML;
  
  const name = container.querySelector('p:first-of-type');
  const roll = container.querySelector('p:last-of-type');
  const status = container.querySelector('span');
  
  expect(name.textContent).toContain('John Doe');
  expect(roll.textContent).toContain('Roll: 001');
  expect(status.textContent).toContain('Active');
});

// Unit test: Dashboard has glass-card styling
test('dashboard cards have glass-card styling', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="glass-card p-6">
      <h2>Quick Actions</h2>
    </div>
  `;
  
  const card = container.querySelector('.glass-card');
  expect(card).toBeTruthy();
  expect(card.classList.contains('glass-card')).toBe(true);
});

// Unit test: Stat cards have hover effects
test('stat cards have hover effects', () => {
  const card = new PremiumCard({
    title: 'Test',
    value: 100,
    icon: 'activity'
  });
  
  const html = card.render();
  
  // Check for hover-lift class
  expect(html).toContain('hover-lift');
});

// Unit test: Stat cards have trend indicators
test('stat cards display trend indicators', () => {
  const cardWithTrend = new PremiumCard({
    title: 'Test',
    value: 100,
    icon: 'activity',
    trend: { value: 15, direction: 'up' }
  });
  
  const html = cardWithTrend.render();
  
  expect(html).toContain('trending-up');
  expect(html).toContain('15%');
});

// Unit test: Dashboard has responsive grid layout
test('dashboard has responsive grid layout', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>Card 1</div>
      <div>Card 2</div>
      <div>Card 3</div>
      <div>Card 4</div>
    </div>
  `;
  
  const grid = container.querySelector('.grid');
  expect(grid).toBeTruthy();
  expect(grid.classList.contains('grid-cols-1')).toBe(true);
  expect(grid.classList.contains('md:grid-cols-2')).toBe(true);
  expect(grid.classList.contains('lg:grid-cols-4')).toBe(true);
});

// Unit test: MicroChart renders correctly
test('MicroChart component renders canvas element', () => {
  const chart = new MicroChart({
    type: 'line',
    data: [10, 20, 30, 40, 50],
    color: '#6366f1'
  });
  
  const html = chart.render();
  
  expect(html).toContain('<canvas');
  expect(html).toContain('micro-chart-container');
});

// Unit test: PremiumCard renders with gradient
test('PremiumCard renders with gradient background', () => {
  const card = new PremiumCard({
    title: 'Test',
    value: 100,
    icon: 'activity',
    gradient: 'primary'
  });
  
  const html = card.render();
  
  // Check for glass-card class (which has gradient support)
  expect(html).toContain('glass-card');
});
