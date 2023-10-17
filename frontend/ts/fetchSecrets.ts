import { getTableBody } from './tableHandler';
const tableBody = getTableBody();

// Fetch secrets from server and add to table on page load 
export async function fetchSecrets() {
    try {
        // Fetch secrets from server and convert to JSON    
        const response = await fetch('http://localhost:8080/secrets');
        const secrets = await response.json();
        secrets.forEach((secret : Secret) => {

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
}