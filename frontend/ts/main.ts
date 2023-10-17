"use strict";
import { initializeEventHandlers } from './eventhandlers';
import { fetchSecrets } from './fetchSecrets';

// Initialize event handlers when DOM content is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    initializeEventHandlers();
});

// Fetch secrets from server and add to table on page load
fetchSecrets();





