# Notification Bell Troubleshooting Guide

## Issue: Notification Bell Not Showing

If you don't see the notification bell icon in the top-right corner of the navbar, follow these steps:

### Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Look for any error messages related to NotificationBell

### Step 2: Verify Files Are Loaded
In the Console, run these commands:

```javascript
// Check if NotificationBell class exists
typeof NotificationBell

// Check if the container exists
document.getElementById('notification-bell-container')

// Check if the notification bell was initialized
window.notificationBell
```

### Step 3: Manual Initialization
If the bell didn't initialize automatically, try this in the Console:

```javascript
// Create and initialize the notification bell manually
if (typeof NotificationBell !== 'undefined') {
    window.notificationBell = new NotificationBell();
    window.notificationBell.init();
    console.log('Notification bell initialized manually');
} else {
    console.error('NotificationBell class not found');
}
```

### Step 4: Check Network Tab
1. Go to the **Network** tab in Developer Tools
2. Reload the page
3. Look for `NotificationBell.js` in the list
4. If it shows a red X or 404 error, the file isn't being loaded

### Step 5: Verify HTML Structure
In the Console, run:

```javascript
// Check if the navbar exists
document.getElementById('navbar')

// Check if the notification container exists
document.getElementById('notification-bell-container')

// Check the HTML structure
document.getElementById('notification-bell-container').outerHTML
```

### Step 6: Check CSS
In the Console, run:

```javascript
// Check if CSS is applied
const container = document.getElementById('notification-bell-container');
window.getComputedStyle(container)
```

## Common Issues and Solutions

### Issue 1: "NotificationBell is not defined"
**Solution**: The NotificationBell.js file isn't loaded
- Check that `<script src="js/components/NotificationBell.js"></script>` is in index.html
- Verify the file path is correct
- Clear browser cache (Ctrl+Shift+Delete)

### Issue 2: Container exists but bell doesn't show
**Solution**: CSS might be hiding it
- Check that `#notification-bell-container` has `display: flex` or `display: inline-block`
- Check for `display: none` or `visibility: hidden` in CSS
- Check z-index conflicts

### Issue 3: Bell shows but no badge/count
**Solution**: The updateUnreadCount() might be failing
- Check browser console for API errors
- Verify auth token is in localStorage: `localStorage.getItem('authToken')`
- Check that the backend API is running

### Issue 4: Dropdown doesn't open
**Solution**: Event listeners might not be attached
- In Console, run: `document.getElementById('notificationBell').onclick`
- Should return a function, not undefined
- Try clicking the bell and check console for errors

## Quick Fix: Force Reload

1. **Hard refresh** your browser:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear localStorage** (if needed):
```javascript
localStorage.clear();
location.reload();
```

3. **Restart the development server**:
```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev  # or your start command
```

## Debug Mode

Add this to your browser console to enable debug logging:

```javascript
// Enable debug mode
const originalInit = NotificationBell.prototype.init;
NotificationBell.prototype.init = async function() {
    console.log('🔔 NotificationBell.init() called');
    try {
        await originalInit.call(this);
        console.log('✅ NotificationBell initialized successfully');
    } catch (error) {
        console.error('❌ NotificationBell initialization failed:', error);
    }
};

// Reinitialize
if (window.notificationBell) {
    window.notificationBell.destroy();
}
window.notificationBell = new NotificationBell();
window.notificationBell.init();
```

## Expected Behavior

When working correctly, you should see:

1. **In Console**:
   ```
   ✅ Notification bell initialized
   ```

2. **In Navbar**:
   - A bell icon (🔔) in the top-right corner
   - A red badge with a number (e.g., "3")
   - The badge should pulse/animate

3. **On Click**:
   - A dropdown appears below the bell
   - Shows "Recent Notifications"
   - Shows "View All" and "Mark All as Read" buttons

4. **In Dropdown**:
   - List of recent notifications
   - Each notification shows type, title, message, and time
   - Clicking a notification marks it as read

## Still Not Working?

If none of the above solutions work:

1. **Check the file exists**:
   ```bash
   ls -la client/js/components/NotificationBell.js
   ```

2. **Check for syntax errors**:
   - Open `client/js/components/NotificationBell.js` in your editor
   - Look for red squiggly lines (syntax errors)
   - Check the browser console for parsing errors

3. **Verify the script tag**:
   - Open `client/index.html`
   - Search for `NotificationBell.js`
   - Make sure it's before `app.js`

4. **Check the initialization code**:
   - Open `client/js/components/components.js`
   - Search for "Initialize notification bell"
   - Verify the code is there and not commented out

## Contact Support

If you've tried all these steps and it still doesn't work, provide:
1. Browser console errors (screenshot or copy-paste)
2. Network tab showing file loads (screenshot)
3. Output of `typeof NotificationBell` in console
4. Output of `document.getElementById('notification-bell-container')` in console
