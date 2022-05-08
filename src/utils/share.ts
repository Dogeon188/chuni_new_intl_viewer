import { toBlob } from "html-to-image"
import { isMobile } from "./utils"

export async function saveResultAsPicture(mode: "b30" | "b40") {
    const resultNode = <HTMLElement>document.body.shadowRoot?.querySelector("main")
    let n = <HTMLElement>resultNode?.cloneNode(true)
    resultNode?.parentElement?.appendChild(n)

    n.style.margin = "initial"
    n.querySelectorAll("tr").forEach((tr, i) => {
        if (i > (mode == "b30" ? 30 : 40)) tr.remove()
    })

    toBlob(n, { backgroundColor: "#113" }).then(async blob => {
        n.remove()
        if (blob == null) return alert("[chuni-intl-viewer] Something went wrong when converting your scores to PNG. Please ask the author to fix it.")
        if (isMobile()) {
            const f = new File([blob], `result_${mode}.png`, { type: blob.type })
            if (navigator?.canShare({ files: [f] })) {
                navigator.share({ files: [f] }).catch(console.log)
            }
        } else {
            $("<a>").attr({
                download: `result_${mode}.png`,
                href: window.URL.createObjectURL(blob)
            })[0].click()
        }
    })
}