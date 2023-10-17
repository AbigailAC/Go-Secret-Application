"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const tableBody = document.querySelector('#secretsTable tbody');
const addSecretButton = document.querySelector('#addSecretBtn');
fetchSecrets();
// Fetch secrets from server and add to table on page load 
function fetchSecrets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch secrets from server and convert to JSON    
            const response = yield fetch('http://localhost:8080/secrets');
            const secrets = yield response.json();
            secrets.forEach((secret) => {
                // Check if tableBody is an HTMLTableSectionElement (i.e. a tbody)  
                if (tableBody instanceof HTMLTableSectionElement) {
                    // Add secret to table
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = secret.secretId.toString();
                    row.insertCell(1).textContent = secret.secretName;
                    // Add reveal button
                    const revealBtn = document.createElement('button');
                    revealBtn.textContent = 'Reveal Secret';
                    revealBtn.addEventListener('click', () => revealSecret(secret.secretId.toString()));
                    row.insertCell(2).appendChild(revealBtn);
                }
            });
        }
        catch (error) {
            console.error('Error fetching secrets', error);
        }
    });
}
// Reveal secret with the provided secretId and secretPassword
function revealSecret(secretId) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretPassword = prompt('Enter secretPassword to reveal secret:');
        // If the user entered a secretPassword, send a POST request to the server to reveal the secret with the provided secretId and secretPassword 
        if (secretPassword) {
            try {
                const response = yield fetch(`http://localhost:8080/secrets/${secretId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ secretPassword })
                });
                const data = yield response.json();
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
    });
}
/**
 * Function to handle adding a new secret via the "Add Secret" button.
 * - Prompts the user for the secret's name, value, and password.
 * - Sends the secret to the server for storage.
 * - Provides feedback on success or failure.
 */
function addSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('addSecret called.');
        // Ensure the addSecretButton exists.
        if (!addSecretButton) {
            console.error('addSecretButton element not found.');
            return;
        }
        // Attach event listener to the "Add Secret" button.
        addSecretButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const secretName = prompt('Enter secret name:');
            const secretValue = prompt('Enter secret:');
            const secretPassword = prompt('Enter secretPassword:');
            // Ensure all secret details are provided.
            if (secretName && secretValue && secretPassword) {
                try {
                    const response = yield fetch('http://localhost:8080/secrets', {
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
                        const data = yield response.json();
                        throw new Error(data.error || 'Server error while adding secret.');
                    }
                    // Provide feedback on successful secret addition.
                    alert('Secret added successfully!');
                    // Refresh the secrets table.
                    if (tableBody) {
                        tableBody.innerHTML = '';
                        fetchSecrets();
                    }
                    else {
                        console.error('tableBody element not found.');
                    }
                }
                catch (error) {
                    console.error('Error adding secret:', error);
                    let errorMessage;
                    // Check if error is an instance of the Error class
                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    else {
                        // If not, convert error to string or use a default error message
                        errorMessage = typeof error === 'string' ? error : 'An unknown error occurred';
                    }
                    alert(`Failed to add secret: ${errorMessage}`);
                }
            }
            else {
                alert('Please provide all secret details.');
            }
        }));
    });
}
function hi() {
    return __awaiter(this, void 0, void 0, function* () {
        const hiButton = document.querySelector('#hiBtn');
        hiButton === null || hiButton === void 0 ? void 0 : hiButton.addEventListener('click', () => console.log('hi'));
    });
}
