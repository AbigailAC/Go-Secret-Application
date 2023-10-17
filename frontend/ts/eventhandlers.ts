import { getAddSecretButton } from './buttonHandler.js';
import { fetchSecrets } from './fetchSecrets.js';
import { getTableBody } from './tableHandler.js';

const tableBody = getTableBody();
const addSecretButton = getAddSecretButton();

export function initializeEventHandlers(): void {
    if (addSecretButton) {
        addSecretButton.addEventListener('click', addSecret);
    }
}


/**
 * Function to handle adding a new secret via the "Add Secret" button.
 * - Prompts the user for the secret's name, value, and password.
 * - Sends the secret to the server for storage.
 * - Provides feedback on success or failure.
 */

async function addSecret(): Promise<void> {
    console.log('addSecret called.');
    
    const secretName: string | null = prompt('Enter secret name:');
    const secretValue: string | null = prompt('Enter secret:');
    const secretPassword: string | null = prompt('Enter secretPassword:');

    // Ensure all secret details are provided.
    if (secretName && secretValue && secretPassword) {
        try {
            const response: Response = await fetch('http://localhost:8080/secrets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    SecretName: secretName,
                    Secret: secretValue,
                    SecretPW: secretPassword
                })
            });

            // Handle potential errors from the server.
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Server error while adding secret.');
            }

            // Provide feedback on successful secret addition.
            alert('Secret added successfully!');

            // Refresh the secrets table.
            if (tableBody) {
                tableBody.innerHTML = '';
                fetchSecrets();
            } else {
                console.error('tableBody element not found.');
            }

        } catch (error: unknown) {
            console.error('Error adding secret:', error);
        
            let errorMessage: string;
        
            // Check if error is an instance of the Error class
            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                // If not, convert error to string or use a default error message
                errorMessage = typeof error === 'string' ? error : 'An unknown error occurred';
            }
        
            alert(`Failed to add secret: ${errorMessage}`);
        }
    } 
    else {
        alert('Please provide all secret details.');
    }
};