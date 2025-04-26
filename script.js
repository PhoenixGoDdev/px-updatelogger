// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Notification system
const notification = document.createElement('div');
notification.className = 'notification';
document.body.appendChild(notification);

// Function to show notification
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Header/Title toggle
const customHeader = document.getElementById('customHeader');
const preconfiguredHeader = document.getElementById('preconfiguredHeader');
document.querySelectorAll('input[name="headerType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customHeader.style.display = '';
            preconfiguredHeader.style.display = 'none';
        } else {
            customHeader.style.display = 'none';
            preconfiguredHeader.style.display = '';
        }
    });
});

// Footer/Thank You toggle
const customFooter = document.getElementById('customFooter');
const preconfiguredFooter = document.getElementById('preconfiguredFooter');
document.querySelectorAll('input[name="footerType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customFooter.style.display = '';
            preconfiguredFooter.style.display = 'none';
        } else {
            customFooter.style.display = 'none';
            preconfiguredFooter.style.display = '';
        }
    });
});

document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Header
    let header;
    if (document.querySelector('input[name="headerType"]:checked').value === 'custom') {
        header = customHeader.value || '## 🚀 SERVER UPDATES';
    } else {
        header = preconfiguredHeader.value;
    }

    // Footer
    let footer;
    if (document.querySelector('input[name="footerType"]:checked').value === 'custom') {
        footer = customFooter.value || '> *Thank you for your continued support! Stay tuned for more exciting updates coming soon!* 🎮';
    } else {
        footer = preconfiguredFooter.value;
    }

    const whatsNew = document.getElementById('whatsNew').value;
    const bugFixes = document.getElementById('bugFixes').value;
    const removed = document.getElementById('removed').value;
    const webhookUrl = document.getElementById('webhookUrl').value;
    const webhookName = document.getElementById('webhookName').value || 'FiveM Update Bot';
    const webhookAvatar = document.getElementById('webhookAvatar').value || 'https://i.imgur.com/4M34hi2.png';
    const roleMentions = document.getElementById('roleMentions').value;
    
    // Format the message
    let message = header + '\n\n';
    
    // What's New section
    if (whatsNew) {
        message += '### ✨ New Features & Additions\n';
        message += '```diff\n';
        whatsNew.split('\n').forEach((item, index) => {
            if (item.trim()) {
                message += `+ ${index + 1}. ${item.trim()}\n`;
            }
        });
        message += '```\n\n';
    }
    
    // Bug Fixes & Updates section
    if (bugFixes) {
        message += '### 🔧 Bug Fixes & Improvements\n';
        message += '```css\n';
        bugFixes.split('\n').forEach((item, index) => {
            if (item.trim()) {
                message += `[${index + 1}. ${item.trim()}]\n`;
            }
        });
        message += '```\n\n';
    }
    
    // Removed Features section
    if (removed) {
        message += '### 🗑️ Removed Features\n';
        message += '```diff\n';
        removed.split('\n').forEach((item, index) => {
            if (item.trim()) {
                message += `- ${index + 1}. ${item.trim()}\n`;
            }
        });
        message += '```\n\n';
    }
    
    message += footer + '\n\n';
    
    // Add role mentions if provided
    if (roleMentions) {
        const roles = roleMentions.split(',').map(role => role.trim());
        roles.forEach(role => {
            message += `<@&${role}> `;
        });
    }
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message,
                username: webhookName,
                avatar_url: webhookAvatar
            })
        });
        
        if (response.ok) {
            showNotification('✅ Update log sent successfully!', 'success');
        } else {
            throw new Error('Failed to send update log');
        }
    } catch (error) {
        showNotification('❌ Error sending update log: ' + error.message, 'error');
    }
}); 