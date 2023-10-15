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
const addSecretButton = document.querySelector('#addSecretButton');
// Fetch secrets from server and add to table
function fetchSecrets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:8080/secrets');
            const secrets = yield response.json();
            secrets.forEach((secret) => {
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
function revealSecret(secretId) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretPassword = prompt('Enter secretPassword to reveal secret:');
        if (secretPassword) {
            try {
                alert('Revealing secret...');
                // Fetch secret from server with the provided password
                const response = yield fetch(`http://localhost:8080/secrets/${secretId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ secretPassword })
                });
                alert('Revealing secret 123');
                const data = yield response.json();
                // Check if the server returned an error status
                if (!response.ok) {
                    alert('Incorrect secretPassword or no secret found.');
                    return;
                }
                alert('Revealing secret456');
                // Display secret
                alert(`Secret: ${data.Secret}`);
            }
            catch (error) {
                console.error('Error revealing secret', error);
            }
        }
    });
}
// Add functionality to the add secret button
if (addSecretButton instanceof HTMLButtonElement) {
    // Add an event listener to the button, which prompts the user for a secret name, value, and password
    addSecretButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        const secretName = prompt('Enter secret name:');
        const secretValue = prompt('Enter secret:');
        const secretPassword = prompt('Enter secretPassword:');
        // If the user entered all three values, send a POST request to the server
        if (secretName && secretValue && secretPassword) {
            try {
                yield fetch('http://localhost:8080/secrets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Send the secret name, value, and password as JSON
                    body: JSON.stringify({
                        SecretName: secretName,
                        Secret: secretValue,
                        SecretPW: secretPassword
                    })
                });
                // If the tableBody isn't null, clear the table and fetch the secrets again
                if (tableBody instanceof HTMLTableSectionElement) {
                    tableBody.innerHTML = '';
                    fetchSecrets();
                }
                else {
                    console.error('tableBody is null');
                }
            }
            catch (error) {
                console.error('Error adding secret:', error);
            }
        }
    }));
}
fetchSecrets();
