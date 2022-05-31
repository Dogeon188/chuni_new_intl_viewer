export function getCookie(key: string) {
    const cookieEntry = document.cookie
        .split(";")
        .map(e => decodeURIComponent(e.trim()))
        .map(e => e.split("="))
        .find(e => e[0] === key)
    if (cookieEntry) return cookieEntry[1] // value
    return ""
}

export function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export function parseNumber(str: string) {
    return Number([...str].filter(e => e !== ",").join(""))
}

export function setRootColors(theme: Theme) {
    const root = $(":root")
    for (let [k, v] of Object.entries(theme)) {
        root.css(`--theme-${k}`, v)
    }
    document.body.style.backgroundColor = theme.bg_main
}