import { toBlob } from "html-to-image"
import { isMobile } from "@/utils/utils"
import { get } from "svelte/store"
import { theme } from "@/config"
import { themes } from "@/themes"

export async function saveResultAsPicture() {
    const resultNode = <HTMLElement>document.body.shadowRoot?.querySelector("main")
    let n = <HTMLElement>resultNode?.cloneNode(true)
    resultNode?.parentElement?.appendChild(n)

    n.style.margin = "initial"
    n.querySelectorAll("tr").forEach((tr, i) => {
        if (i > 40) tr.remove()
    })

    toBlob(n, { backgroundColor: themes[get(theme)].bg_main }).then(async blob => {
        n.remove()
        if (blob == null) return alert("[chuni-intl-viewer] Something went wrong when converting your scores to PNG. Please ask the author to fix it.")
        if (isMobile()) {
            const f = new File([blob], "chunithm_b40.png", { type: blob.type })
            if (navigator?.canShare({ files: [f] })) {
                navigator.share({ files: [f] }).catch(console.log)
            }
        } else {
            $("<a>").attr({
                download: "chunithm_b40.png",
                href: window.URL.createObjectURL(blob)
            })[0].click()
        }
    })
}