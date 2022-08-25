export function unescapeHtml(safe) {
        return safe.replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&eacute;/g, "é")
            .replace(/&auml;/g, "Ä");
    }