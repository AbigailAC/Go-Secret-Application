async function revealSecret(secretId: string) {
    const secretPassword = prompt('Enter secretPassword to reveal secret:');

    // If the user entered a secretPassword, send a POST request to the server to reveal the secret with the provided secretId and secretPassword 
    if (secretPassword) {
        try {
            const response = await fetch(`http://localhost:8080/secrets/${secretId}`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                }, // Send the secretPassword as JSON
                body: JSON.stringify({ secretPassword })
            });
            
            const data = await response.json();

            // Check if the server returned an error status
            if (!response.ok) {
                alert('Incorrect secretPassword or no secret found.');
                return;
            }

            // Display secret
            alert(`Secret: ${data.Secret}`);
        }
        catch (error) {
            console.error('Error revealing secret', error);
        }
    }
}