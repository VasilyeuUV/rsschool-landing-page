document.addEventListener('DOMContentLoaded', async () => {
    const components = document.querySelectorAll('[data-component]');

    for (const element of components) {
        const url = element.dataset.component;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Failed to load component: ${url} (${response.status})`
                );
            }

            const html = await response.text();

            const template = document.createElement('template');
            template.innerHTML = html.trim();

            element.replaceWith(template.content);
        } catch (error) {
            console.error(error);
        }
    }
});