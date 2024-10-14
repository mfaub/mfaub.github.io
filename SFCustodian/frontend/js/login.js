document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const pin = document.getElementById('pin').value;
    const accountType = document.getElementById('accountType').value;

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pin, accountType })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', JSON.stringify(data.authToken));
            localStorage.setItem('sessionId', data.sessionId); // Store session ID
            
            // Redirect to the dashboard after successful login
            window.location.href = 'dashboard.html';
        } else {
            displayMessage('Login failed. Invalid PIN or Account Type.', 'red');
        }
    } catch (error) {
        displayMessage('An error occurred. Please try again later.', 'red');
    }
});

function displayMessage(message, color) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<p style="color:${color};">${message}</p>`;
}
