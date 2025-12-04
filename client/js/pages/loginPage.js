/**
 * Login Page
 * Sign In and Sign Up with JWT authentication
 */

(function() {
    'use strict';

    let currentTab = 'signin';

    function renderLogin() {
        // Hide sidebar and navbar
        document.getElementById('sidebar').style.display = 'none';
        document.getElementById('navbar').style.display = 'none';
        
        const mainContent = document.getElementById('main-content');
        mainContent.className = 'min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6';
        mainContent.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="graduation-cap" class="w-8 h-8 text-white"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900">SLMS</h1>
                    <p class="text-gray-600 text-sm mt-1">Student Lifecycle Management System</p>
                </div>

                <!-- Tabs -->
                <div class="flex gap-0 mb-6 border-b border-gray-200">
                    <button onclick="switchTab('signin')" id="signin-tab" class="flex-1 py-3 text-center font-medium border-b-2 border-blue-600 text-blue-600 transition-colors">
                        Sign In
                    </button>
                    <button onclick="switchTab('signup')" id="signup-tab" class="flex-1 py-3 text-center font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 transition-colors">
                        Sign Up
                    </button>
                </div>

                <!-- Error Message -->
                <div id="error-message" class="hidden mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

                <!-- Sign In Form -->
                <form id="signin-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="signin-email" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="admin@slms.edu">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div class="relative">
                            <input type="password" id="signin-password" required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                                placeholder="••••••••">
                            <button type="button" onclick="togglePassword('signin')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i data-lucide="eye" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" class="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
                    </div>

                    <button type="submit" id="signin-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                        Sign In
                    </button>
                </form>

                <!-- Sign Up Form -->
                <form id="signup-form" class="space-y-4 hidden">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" id="signup-name" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="John Doe">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select id="signup-role" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                            <option value="">Select a role</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="signup-email" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="john@slms.edu">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div class="relative">
                            <input type="password" id="signup-password" required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                                placeholder="••••••••">
                            <button type="button" onclick="togglePassword('signup')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i data-lucide="eye" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <div class="relative">
                            <input type="password" id="signup-confirm" required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                                placeholder="••••••••">
                            <button type="button" onclick="togglePassword('confirm')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i data-lucide="eye" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>

                    <label class="flex items-center">
                        <input type="checkbox" id="terms" required class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                        <span class="ml-2 text-sm text-gray-600">I agree to the <a href="#" class="text-blue-600 hover:text-blue-700">Terms of Service</a></span>
                    </label>

                    <p class="text-xs text-gray-500 text-center">Your account will be pending admin approval</p>

                    <button type="submit" id="signup-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                        Create Account
                    </button>
                </form>

                <!-- Footer -->
                <p class="text-center text-xs text-gray-500 mt-6">
                    © 2024 SLMS. All rights reserved.
                </p>
            </div>
        `;
        
        lucide.createIcons();
        
        // Attach event listeners
        document.getElementById('signin-form').addEventListener('submit', handleSignIn);
        document.getElementById('signup-form').addEventListener('submit', handleSignUp);
    }

    function switchTab(tab) {
        currentTab = tab;
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const signinTab = document.getElementById('signin-tab');
        const signupTab = document.getElementById('signup-tab');
        const errorMsg = document.getElementById('error-message');

        errorMsg.classList.add('hidden');

        if (tab === 'signin') {
            signinForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            signinTab.classList.add('border-blue-600', 'text-blue-600');
            signinTab.classList.remove('border-transparent', 'text-gray-600');
            signupTab.classList.remove('border-blue-600', 'text-blue-600');
            signupTab.classList.add('border-transparent', 'text-gray-600');
        } else {
            signinForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            signupTab.classList.add('border-blue-600', 'text-blue-600');
            signupTab.classList.remove('border-transparent', 'text-gray-600');
            signinTab.classList.remove('border-blue-600', 'text-blue-600');
            signinTab.classList.add('border-transparent', 'text-gray-600');
        }
    }

    async function handleSignIn(e) {
        e.preventDefault();
        
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        const btn = document.getElementById('signin-btn');
        const errorMsg = document.getElementById('error-message');

        if (!email || !password) {
            showError('Please enter email and password');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Signing in...';

        try {
            const result = await authService.login(email, password);
            
            showError('');
            showToast('Login successful!', 'success');
            
            // Restore layout
            document.getElementById('sidebar').style.display = 'block';
            document.getElementById('navbar').style.display = 'block';
            document.getElementById('main-content').className = 'p-6';
            
            setTimeout(() => navigateTo('/'), 500);
        } catch (error) {
            showError(error.message || 'Login failed. Please try again.');
            btn.disabled = false;
            btn.textContent = 'Sign In';
        }
    }

    async function handleSignUp(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const role = document.getElementById('signup-role').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        const terms = document.getElementById('terms').checked;
        const btn = document.getElementById('signup-btn');

        if (!name || !email || !role || !password || !confirm) {
            showError('Please fill in all fields');
            return;
        }

        if (password !== confirm) {
            showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        if (!terms) {
            showError('Please agree to the terms of service');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Creating account...';

        try {
            const result = await authService.register(name, email, password, role);
            
            showError('');
            showToast('Account created! Pending admin approval.', 'success');
            
            // Switch to sign in tab
            setTimeout(() => {
                switchTab('signin');
                btn.disabled = false;
                btn.textContent = 'Create Account';
            }, 1500);
        } catch (error) {
            showError(error.message || 'Registration failed. Please try again.');
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    }

    function togglePassword(field) {
        let inputId;
        if (field === 'signin') {
            inputId = 'signin-password';
        } else if (field === 'signup') {
            inputId = 'signup-password';
        } else if (field === 'confirm') {
            inputId = 'signup-confirm';
        }
        
        const input = document.getElementById(inputId);
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    }

    function showError(message) {
        const errorMsg = document.getElementById('error-message');
        if (message) {
            errorMsg.textContent = message;
            errorMsg.classList.remove('hidden');
        } else {
            errorMsg.classList.add('hidden');
        }
    }

    window.renderLogin = renderLogin;
    window.switchTab = switchTab;
    window.togglePassword = togglePassword;

    window.LoginPage = {
        render: renderLogin
    };

})();
