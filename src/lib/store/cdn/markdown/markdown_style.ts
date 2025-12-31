

function createMarkdownStyle() {

    function getMarkdownStyle({theme}:{theme:string}) {



        function loadCSS(href:string) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.head.appendChild(link);
        }

        if (theme === 'dark') {
            loadCSS('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.css');
        } else {
            loadCSS('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.css');
        }
    }

    return{
        getMarkdownStyle
    }
}

export const MarkdownStyle = createMarkdownStyle()



