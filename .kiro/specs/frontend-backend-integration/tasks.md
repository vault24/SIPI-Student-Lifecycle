# Implementation Plan

- [x] 1. Create core utility modules


  - Create `client/js/utils/http.js` with HTTP client functions
  - Implement request(), get(), post(), put(), patch(), del(), and upload() methods
  - Add authentication token injection from localStorage
  - Add request timeout handling (30 seconds default)
  - Add response parsing and error transformation
  - _Requirements: 1.4_

- [x] 2. Create error handling module


  - Create `client/js/utils/errorHandler.js` with APIError class
  - Implement handleAPIError() function to process API errors
  - Implement getErrorMessage() to convert errors to user-friendly messages
  - Add showErrorToast() function for displaying error notifications
  - Handle special cases: 401 (redirect to login), 403 (access denied), 404 (not found)
  - _Requirements: 3.1, 3.2, 3.3, 13.1, 13.2, 13.3, 13.4_




- [ ] 3. Create loading state module
  - Create `client/js/utils/loadingState.js` with loading state functions
  - Implement showLoadingSkeleton() for different skeleton types (table, card, form, stats)
  - Implement hideLoadingSkeleton() to remove skeletons
  - Implement setButtonLoading() to disable buttons and show spinners
  - Implement showSpinner() for centered loading spinners


  - Implement showProgressBar() for file upload progress
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4. Update backend API module
  - Update `client/js/api/backend.js` to use http.js instead of fetch
  - Add apiCall() wrapper function for error handling
  - Update all studentsAPI methods to use http client
  - Update all alumniAPI methods to use http client
  - Update all applicationsAPI methods to use http client
  - Update all documentsAPI methods to use http client
  - Update all departmentsAPI methods to use http client
  - Update all dashboardAPI methods to use http client
  - _Requirements: 1.2, 1.4_

- [x] 5. Migrate Dashboard page



  - Update `client/js/pages/dashboardPage.js` to use backendAPI
  - Replace dataManager calls with dashboardAPI.getStats()
  - Add loading skeleton for stat cards while fetching
  - Handle API errors with retry button
  - Remove all mock data calculations
  - Update recent activity to use real API data
  - _Requirements: 1.1, 1.3, 1.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 6. Migrate Student List page



  - Update `client/js/pages/studentListPage.js` to use backendAPI
  - Replace dataManager.getStudents() with studentsAPI.getAll()
  - Move filtering to server-side using query parameters
  - Implement debounced search (300ms delay)
  - Use API pagination instead of client-side pagination
  - Add loading skeleton while fetching students
  - Handle empty results with appropriate message
  - Handle API errors with retry button
  - _Requirements: 1.1, 1.3, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 15.1, 15.2, 15.3, 15.4, 15.5, 16.1, 16.2, 16.3, 16.4, 16.5_


- [x] 7. Migrate Add Student page

  - Update `client/js/pages/addStudentPage.js` to use backendAPI
  - Replace dataManager.addStudent() with studentsAPI.create()
  - Add button loading state during submission
  - Handle validation errors from API
  - Display field-specific error messages
  - Handle photo upload separately if needed
  - Show success toast on completion
  - Redirect to student list after success
  - _Requirements: 1.1, 1.3, 1.5, 2.2, 2.3, 3.4, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. Migrate Student Details page




  - Update `client/js/pages/studentDetailsPage.js` to use backendAPI
  - Replace dataManager.getStudent() with studentsAPI.getById()
  - Add loading skeleton while fetching student details
  - Handle 404 errors with appropriate message
  - Implement delete functionality with studentsAPI.delete()
  - Show confirmation modal before delete
  - Handle delete errors
  - Redirect to student list after successful delete
  - _Requirements: 1.1, 1.3, 1.5, 3.1, 3.2, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Migrate Edit Student page





  - Update `client/js/pages/editStudentPage.js` to use backendAPI
  - Load student data using studentsAPI.getById()
  - Replace dataManager.updateStudent() with studentsAPI.update()
  - Add loading skeleton while loading form data
  - Add button loading state during submission
  - Handle validation errors from API
  - Display field-specific error messages
  - Handle photo updates separately if needed
  - Show success toast on completion
  - Redirect to student details after success
  - _Requirements: 1.1, 1.3, 1.5, 2.2, 2.3, 3.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 10. Migrate Alumni page



  - Update `client/js/pages/alumniPage.js` to use backendAPI
  - Replace applicationManager calls with alumniAPI methods
  - Implement alumniAPI.getAll() with filtering support
  - Add loading states for data fetching
  - Implement create functionality with alumniAPI (via student transition)
  - Implement update functionality with alumniAPI.update()
  - Handle career position additions
  - Handle support category updates
  - Show success/error messages appropriately
  - _Requirements: 1.1, 1.3, 1.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 11. Migrate Documents page


  - Update `client/js/pages/documentsPage.js` to use backendAPI
  - Replace mock document handling with documentsAPI.getAll()
  - Implement file upload with documentsAPI.upload()
  - Add upload progress bar using showProgressBar()
  - Handle multipart/form-data correctly
  - Implement delete with documentsAPI.delete()
  - Show confirmation modal before delete
  - Handle file size limits and validation errors
  - Show success/error messages appropriately

  - _Requirements: 1.1, 1.3, 1.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 12. Migrate Departments page


  - Update `client/js/pages/departmentsPage.js` to use backendAPI
  - Replace mock data with departmentsAPI.getAll()
  - Add loading states while fetching departments
  - Implement department details view with departmentsAPI.getById()
  - Implement department students view with departmentsAPI.getStudents()
  - Handle errors with appropriate messages


  - _Requirements: 1.1, 1.3, 1.5, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 13. Migrate Discontinued Students page


  - Update `client/js/pages/discontinuedStudentsPage.js` to use backendAPI
  - Replace filtered dataManager call with studentsAPI.getAll({ status: 'discontinued' })
  - Add loading states while fetching
  - Implement reinstate functionality using studentsAPI.update() to change status
  - Show confirmation modal before reinstatement
  - Refresh list after successful reinstatement
  - Show success toast after reinstatement
  - Handle errors appropriately
  - _Requirements: 1.1, 1.3, 1.5, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 14. Migrate Marks & Attendance page
  - Update `client/js/pages/marksAttendancePage.js` to use backendAPI
  - Replace mock data with studentsAPI.getSemesterResults()
  - Fetch attendance data with studentsAPI.getSemesterAttendance()
  - Add loading states while fetching data
  - Handle empty semesters appropriately
  - Display real marks and attendance data
  - Handle errors with appropriate messages
  - _Requirements: 1.1, 1.3, 1.5_

- [ ] 15. Remove mock data and localStorage dependencies
  - Remove all mock data generation functions from `client/js/api/data.js`
  - Remove dataManager.getStudents() function
  - Remove dataManager.addStudent() function
  - Remove dataManager.updateStudent() function
  - Remove dataManager.deleteStudent() function
  - Remove dataManager.getDocuments() function
  - Remove dataManager.getAlumni() function
  - Remove applicationManager functions
  - Remove all localStorage.setItem() calls for application data
  - Remove all localStorage.getItem() calls for application data
  - Keep only authentication token storage in localStorage
  - _Requirements: 1.1, 1.5, 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 16. Update index.html with new script imports


  - Add script tag for `client/js/utils/http.js`
  - Add script tag for `client/js/utils/errorHandler.js`
  - Add script tag for `client/js/utils/loadingState.js`
  - Ensure scripts are loaded in correct order (utilities before pages)
  - Verify all pages still load correctly
  - _Requirements: 1.4_

- [ ] 17. Add data transformation utilities
  - Create helper functions to convert camelCase to snake_case
  - Create helper functions to convert snake_case to camelCase
  - Add date formatting utilities
  - Add null value handling utilities
  - Update backend.js to use transformation utilities
  - _Requirements: 1.2_

- [ ] 18. Implement request debouncing for search
  - Update search input handlers to use debounce utility
  - Set debounce delay to 300ms
  - Cancel pending requests when new search is initiated
  - Show loading indicator during debounced search
  - _Requirements: 15.1, 15.4_

- [ ] 19. Implement pagination state management
  - Update pagination components to maintain search parameters
  - Update pagination components to maintain filter parameters
  - Ensure page changes don't reset filters
  - Update URL with pagination state (optional)
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 20. Add retry functionality for failed requests
  - Add retry button to error states
  - Implement retry logic that re-executes failed request
  - Clear error state before retry
  - Show loading state during retry
  - Limit retry attempts to prevent infinite loops
  - _Requirements: 3.5_

- [ ] 21. Implement authentication token management
  - Update http.js to read token from localStorage
  - Add token to Authorization header for all requests
  - Handle 401 errors by redirecting to login page
  - Clear token on logout
  - Add token expiration checking
  - _Requirements: 13.3_

- [ ] 22. Add request timeout handling
  - Set default timeout to 30 seconds in http.js
  - Use AbortController for timeout implementation
  - Show timeout error message to user
  - Provide retry option for timeout errors
  - _Requirements: 3.1_

- [ ] 23. Implement file upload progress tracking
  - Add progress event listener to upload requests
  - Update progress bar during upload
  - Show percentage complete
  - Handle upload cancellation
  - Show success message on completion
  - _Requirements: 9.4_

- [ ] 24. Add empty state components
  - Create empty state component for lists with no results
  - Add appropriate icons and messages
  - Include action buttons where appropriate (e.g., "Add First Student")
  - Apply to all list pages
  - _Requirements: 15.5_

- [ ] 25. Implement form validation error display
  - Update form submission handlers to extract field errors from API response
  - Display errors next to corresponding form fields
  - Highlight error fields with red border
  - Clear errors when user starts typing
  - Scroll to first error field
  - _Requirements: 3.4_

- [ ] 26. Add success toast notifications
  - Create showSuccessToast() function in errorHandler.js
  - Show success message after create operations
  - Show success message after update operations
  - Show success message after delete operations
  - Auto-dismiss after 3 seconds
  - _Requirements: 5.3, 7.4, 8.4, 9.5, 12.4_

- [ ] 27. Test all pages with backend API
  - Test Dashboard page loads correctly
  - Test Student List page with search, filter, and pagination
  - Test Add Student page with valid and invalid data
  - Test Student Details page loads and delete works
  - Test Edit Student page loads and update works
  - Test Alumni page with all CRUD operations
  - Test Documents page with upload and delete
  - Test Departments page loads correctly
  - Test Discontinued Students page with reinstate
  - Test Marks & Attendance page loads correctly
  - _Requirements: All_

- [ ] 28. Test error handling scenarios
  - Test with no internet connection
  - Test with slow network (3G)
  - Test with server returning 400 errors
  - Test with server returning 401 errors
  - Test with server returning 404 errors
  - Test with server returning 500 errors
  - Test with request timeout
  - Verify error messages are user-friendly
  - Verify retry buttons work
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 29. Verify no localStorage usage for application data
  - Search codebase for localStorage.setItem() calls
  - Search codebase for localStorage.getItem() calls
  - Verify only authentication token is stored
  - Remove any remaining localStorage usage
  - Test that application works without localStorage data
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 30. Update documentation
  - Update README with API integration information
  - Document new utility modules
  - Document error handling patterns
  - Document loading state patterns
  - Add troubleshooting guide
  - _Requirements: All_

- [ ] 31. Final integration testing
  - Test complete user flows (add → view → edit → delete)
  - Test search and filter across all pages
  - Test pagination across all pages
  - Test file uploads
  - Test error recovery
  - Test with different network conditions
  - Verify no console errors
  - Verify all features work as expected
  - _Requirements: All_
