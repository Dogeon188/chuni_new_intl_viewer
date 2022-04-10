import { getCookie } from "./utils/utils"
import Svelte from "./Main.svelte"

async function main () {
    if ((window as any).chuniIntlViewer) {
        alert("[chuni-intl-viewer] Please refresh the page before another new fetch.")
        return
    }
    (window as any).chuniIntlViewer = true

    if (window.location.hostname !== "chunithm-net-eng.com") {
        alert("[chuni_intl_viewer] This tools could only be used under chunithm-net international.")
        window.location.href = "https://chunithm-net-eng.com/"
        return
    }

    if (!getCookie("_t")) {
        alert("[chuni-intl-viewer] Token not found. Please login first.")
        window.location.href = "https://chunithm-net-eng.com/"
        return
    }

    const shadow = document.body.attachShadow({mode: "open"})
    new Svelte({target: shadow})
}

main()