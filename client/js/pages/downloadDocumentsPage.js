// Download Documents Page
// Allows users to search for students and download/print documents

(function() {
  'use strict';

  async function renderDownloadDocumentsPage() {
    renderNavbar('Download / Print Documents');

    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="max-w-6xl mx-auto">
        <!-- Breadcrumb Navigation -->
        <div class="flex items-center gap-2 mb-6 text-sm">
          <button onclick="navigateTo('/')" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <i data-lucide="home" class="w-4 h-4"></i>
            Dashboard
          </button>
          <span class="text-gray-600">/</span>
          <span class="text-white font-medium">Download Documents</span>
        </div>

        <!-- Hero Section -->
        <div class="glass-card p-8 mb-8 animate-fade-in-up">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <i data-lucide="download" class="w-6 h-6 text-white"></i>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">Download / Print Documents</h1>
              <p class="text-gray-400">Search for a student and generate official documents</p>
            </div>
          </div>
        </div>

        <!-- Search Section -->
        <div class="glass-card p-6 mb-8">
          <h2 class="text-xl font-bold text-white mb-4">Step 1: Search Student</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">Student Name or Roll Number</label>
            <div class="relative">
              <input 
                type="text" 
                id="student-search-input"
                placeholder="Enter student name or roll number..."
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
              <i data-lucide="search" class="absolute right-3 top-3 w-5 h-5 text-gray-400"></i>
            </div>
          </div>

          <!-- Search Results -->
          <div id="search-results" class="hidden">
            <div class="mb-4">
              <p class="text-sm text-gray-400 mb-3">Found <span id="result-count">0</span> student(s)</p>
              <div id="results-list" class="space-y-2 max-h-96 overflow-y-auto">
                <!-- Results will be populated here -->
              </div>
            </div>
          </div>

          <!-- No Results Message -->
          <div id="no-results" class="hidden text-center py-8">
            <i data-lucide="search" class="w-12 h-12 mx-auto text-gray-500 mb-3"></i>
            <p class="text-gray-400">No students found. Try searching with a different name or roll number.</p>
          </div>
        </div>

        <!-- Selected Student Section -->
        <div id="selected-student-section" class="hidden glass-card p-6 mb-8">
          <h2 class="text-xl font-bold text-white mb-4">Step 2: Select Document Type</h2>
          
          <div id="selected-student-info" class="bg-white/10 rounded-lg p-4 mb-6 border border-white/20">
            <!-- Selected student info will be shown here -->
          </div>

          <!-- Document Templates Grid -->
          <div id="document-templates-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Document templates will be populated here -->
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();

    // Add event listeners
    const searchInput = document.getElementById('student-search-input');
    searchInput.addEventListener('input', debounce(handleStudentSearch, 300));
  }

  /**
   * Handle student search
   */
  async function handleStudentSearch(e) {
    const searchTerm = e.target.value.trim();
    const searchResults = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');
    const resultsList = document.getElementById('results-list');
    const resultCount = document.getElementById('result-count');

    if (!searchTerm) {
      searchResults.classList.add('hidden');
      noResults.classList.add('hidden');
      return;
    }

    try {
      // Fetch all students and filter
      const students = await dataManager.getStudents();
      const filtered = students.filter(student => 
        student.fullNameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.currentRollNumber.includes(searchTerm)
      );

      if (filtered.length === 0) {
        searchResults.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
      }

      // Display results
      resultCount.textContent = filtered.length;
      resultsList.innerHTML = filtered.map(student => `
        <button 
          onclick="selectStudentForDocuments('${student.id}', '${student.fullNameEnglish}', '${student.currentRollNumber}')"
          class="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-blue-500 transition-all group"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-white">${student.fullNameEnglish}</p>
              <p class="text-sm text-gray-400">Roll: ${student.currentRollNumber} | Dept: ${student.department?.name || 'N/A'}</p>
            </div>
            <i data-lucide="arrow-right" class="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors"></i>
          </div>
        </button>
      `).join('');

      searchResults.classList.remove('hidden');
      noResults.classList.add('hidden');
      lucide.createIcons();
    } catch (error) {
      console.error('Error searching students:', error);
      noResults.classList.remove('hidden');
      searchResults.classList.add('hidden');
    }
  }

  /**
   * Select student and show document templates
   */
  function selectStudentForDocuments(studentId, studentName, rollNumber) {
    const selectedSection = document.getElementById('selected-student-section');
    const selectedInfo = document.getElementById('selected-student-info');
    const templatesGrid = document.getElementById('document-templates-grid');

    // Show selected student info
    selectedInfo.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-400">Selected Student</p>
          <p class="text-lg font-bold text-white">${studentName}</p>
          <p class="text-sm text-gray-400">Roll: ${rollNumber}</p>
        </div>
        <button 
          onclick="document.getElementById('selected-student-section').classList.add('hidden'); document.getElementById('student-search-input').value = ''; document.getElementById('search-results').classList.add('hidden');"
          class="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
        >
          Change Student
        </button>
      </div>
    `;

    // Generate document templates
    const documentTypes = getAllDocumentTypes();
    templatesGrid.innerHTML = documentTypes.map(docType => {
      const metadata = getDocumentMetadata(docType);
      return `
        <button 
          onclick="navigateTo('/document-viewer/${studentId}/${docType}')"
          class="group relative p-6 bg-white/10 rounded-lg border-2 border-white/20 hover:border-blue-500 hover:bg-white/20 transition-all duration-300 text-left"
        >
          <!-- Icon -->
          <div class="w-12 h-12 bg-${metadata.color}-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${metadata.color}-500/30 transition-colors">
            <i data-lucide="${metadata.icon}" class="w-6 h-6 text-${metadata.color}-400"></i>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
            ${metadata.name}
          </h3>

          <!-- Description -->
          <p class="text-sm text-gray-400 mb-4">
            ${metadata.description}
          </p>

          <!-- Arrow Icon -->
          <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <i data-lucide="arrow-right" class="w-5 h-5 text-blue-400"></i>
          </div>
        </button>
      `;
    }).join('');

    selectedSection.classList.remove('hidden');
    lucide.createIcons();

    // Scroll to selected section
    setTimeout(() => {
      selectedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  /**
   * Debounce function for search
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Export to global scope
  window.renderDownloadDocumentsPage = renderDownloadDocumentsPage;
  window.selectStudentForDocuments = selectStudentForDocuments;

  window.DownloadDocumentsPage = {
    render: renderDownloadDocumentsPage
  };

})();
