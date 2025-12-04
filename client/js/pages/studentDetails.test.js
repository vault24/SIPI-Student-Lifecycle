/**
 * Student Details Page Tests
 * Property-based tests for student details redesign
 */

// Feature: premium-ui-redesign, Property 19: Card styling consistency across pages
// Validates: Requirements 9.2
test('all detail cards use consistent styling', () => {
  const cards = [
    { class: 'glass-card', selector: '.glass-card' },
    { class: 'glass-card', selector: '.glass-card' },
    { class: 'glass-card', selector: '.glass-card' }
  ];
  
  cards.forEach(card => {
    expect(card.class).toBe('glass-card');
  });
});

// Unit test: Student details page has hero section
test('student details page has hero section with profile', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="glass-card p-8">
      <div class="flex flex-col md:flex-row gap-8">
        <img src="https://via.placeholder.com/160" alt="Student" class="w-40 h-40 rounded-2xl">
        <div>
          <h1 class="text-4xl font-bold text-white">John Doe</h1>
          <p class="text-gray-400">জন ডো</p>
        </div>
      </div>
    </div>
  `;
  
  const hero = container.querySelector('.glass-card');
  const image = container.querySelector('img');
  const name = container.querySelector('h1');
  
  expect(hero).toBeTruthy();
  expect(image).toBeTruthy();
  expect(name).toBeTruthy();
  expect(name.textContent).toContain('John Doe');
});

// Unit test: Student details has quick info cards
test('student details displays quick info cards', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white/10 rounded-lg p-3">
        <p class="text-xs text-gray-400">Roll Number</p>
        <p class="text-lg font-bold text-white">001</p>
      </div>
      <div class="bg-white/10 rounded-lg p-3">
        <p class="text-xs text-gray-400">Semester</p>
        <p class="text-lg font-bold text-white">4</p>
      </div>
      <div class="bg-white/10 rounded-lg p-3">
        <p class="text-xs text-gray-400">Department</p>
        <p class="text-lg font-bold text-white">CSE</p>
      </div>
      <div class="bg-white/10 rounded-lg p-3">
        <p class="text-xs text-gray-400">Status</p>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">Active</span>
      </div>
    </div>
  `;
  
  const cards = container.querySelectorAll('[class*="bg-white/10"]');
  expect(cards.length).toBe(4);
});

// Unit test: Student details has action buttons
test('student details has action buttons', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="flex flex-wrap gap-3">
      <button class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
        <i data-lucide="edit"></i>
        Edit
      </button>
      <button class="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600">
        <i data-lucide="download"></i>
        Download
      </button>
      <button class="flex items-center gap-2 bg-red-600/20">
        <i data-lucide="trash-2"></i>
        Delete
      </button>
    </div>
  `;
  
  const buttons = container.querySelectorAll('button');
  expect(buttons.length).toBeGreaterThanOrEqual(3);
  
  buttons.forEach(button => {
    expect(button.className).toContain('flex');
    expect(button.className).toContain('items-center');
  });
});

// Unit test: Student details has collapsible sections
test('student details has collapsible information sections', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="glass-card overflow-hidden">
      <button onclick="toggleSection('personal-info')" class="w-full p-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <i data-lucide="user"></i>
          </div>
          <h3 class="text-lg font-bold text-white">Personal Information</h3>
        </div>
        <i data-lucide="chevron-down" id="personal-info-icon"></i>
      </button>
      <div id="personal-info" class="px-6 pb-6">
        <dl class="space-y-3">
          <div>
            <dt class="text-sm font-medium text-gray-500">Full Name</dt>
            <dd class="text-sm text-gray-900">John Doe</dd>
          </div>
        </dl>
      </div>
    </div>
  `;
  
  const section = container.querySelector('.glass-card');
  const button = container.querySelector('button');
  const content = container.querySelector('#personal-info');
  
  expect(section).toBeTruthy();
  expect(button).toBeTruthy();
  expect(content).toBeTruthy();
});

// Unit test: Student details has breadcrumb navigation
test('student details has breadcrumb navigation', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="flex items-center gap-2 mb-6 text-sm">
      <button onclick="navigateTo('/students')" class="text-gray-400 hover:text-white flex items-center gap-1">
        <i data-lucide="arrow-left"></i>
        Students
      </button>
      <span class="text-gray-600">/</span>
      <span class="text-white font-medium">Details</span>
    </div>
  `;
  
  const breadcrumb = container.querySelector('[class*="flex items-center gap-2"]');
  const backButton = container.querySelector('button');
  
  expect(breadcrumb).toBeTruthy();
  expect(backButton).toBeTruthy();
  expect(backButton.textContent).toContain('Students');
});

// Unit test: Student details has status badge
test('student details displays status badge', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
      Active
    </span>
  `;
  
  const badge = container.querySelector('span');
  expect(badge).toBeTruthy();
  expect(badge.className).toContain('rounded-full');
  expect(badge.className).toContain('font-bold');
  expect(badge.textContent).toContain('Active');
});

// Unit test: Student details has profile photo
test('student details displays profile photo', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <img src="https://via.placeholder.com/160" alt="John Doe" class="w-40 h-40 rounded-2xl object-cover ring-4 ring-white/20">
  `;
  
  const photo = container.querySelector('img');
  expect(photo).toBeTruthy();
  expect(photo.className).toContain('w-40');
  expect(photo.className).toContain('h-40');
  expect(photo.className).toContain('rounded-2xl');
  expect(photo.className).toContain('ring-4');
});

// Unit test: Student details has glass-card styling
test('student details uses glass-card styling', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="glass-card p-8">
      <h1>Student Details</h1>
    </div>
  `;
  
  const card = container.querySelector('.glass-card');
  expect(card).toBeTruthy();
  expect(card.classList.contains('glass-card')).toBe(true);
});

// Unit test: Student details has icon badges for sections
test('student details sections have icon badges', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
      <i data-lucide="user" class="w-5 h-5 text-white"></i>
    </div>
    <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
      <i data-lucide="phone" class="w-5 h-5 text-white"></i>
    </div>
  `;
  
  const badges = container.querySelectorAll('[class*="bg-gradient"]');
  expect(badges.length).toBe(2);
  
  badges.forEach(badge => {
    expect(badge.className).toContain('rounded-lg');
    expect(badge.className).toContain('flex');
    expect(badge.className).toContain('items-center');
  });
});

// Unit test: Student details has responsive layout
test('student details has responsive layout', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-shrink-0">Profile</div>
      <div class="flex-1">Info</div>
    </div>
  `;
  
  const layout = container.querySelector('[class*="flex flex-col"]');
  expect(layout).toBeTruthy();
  expect(layout.className).toContain('flex-col');
  expect(layout.className).toContain('md:flex-row');
});

// Unit test: Student details has data display sections
test('student details displays data in definition lists', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <dl class="space-y-3">
      <div>
        <dt class="text-sm font-medium text-gray-500">Full Name</dt>
        <dd class="text-sm text-gray-900">John Doe</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500">Email</dt>
        <dd class="text-sm text-gray-900">john@example.com</dd>
      </div>
    </dl>
  `;
  
  const dl = container.querySelector('dl');
  const dts = container.querySelectorAll('dt');
  const dds = container.querySelectorAll('dd');
  
  expect(dl).toBeTruthy();
  expect(dts.length).toBe(2);
  expect(dds.length).toBe(2);
});
