// include-shared.js
async function includeSharedContent(targetElementId, sharedContentPath) {
    try {
        const response = await fetch(sharedContentPath);
        const sharedContent = await response.text();

        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = sharedContent;
        } else {
            console.error(`Target element with ID "${targetElementId}" not found.`);
        }
    } catch (error) {
        console.error("Error including shared content:", error);
    }
}

// Dynamically load the content when the page loads
document.addEventListener('DOMContentLoaded', () => {
    includeSharedContent('shared-content-container', 'shared.html');
});

