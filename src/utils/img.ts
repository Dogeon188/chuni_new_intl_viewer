import { toBlob, toCanvas, toPng } from "html-to-image"
import { isMobile } from "./utils"

async function savePic(mode: "b30"|"b40") {
    const resultNode = <HTMLElement>document.body.shadowRoot?.querySelector("main")
    let n = <HTMLElement>resultNode?.cloneNode(true)
    resultNode?.parentElement?.appendChild(n)

    n.querySelectorAll("tr").forEach((tr, i) => {
        if (i > (mode == "b30" ? 30 : 40)) tr.remove()
    })

    toBlob(n, {backgroundColor: "#223"}).then(async blob => {
        n.remove()
        if (blob == null) return alert("[chuni-intl-viewer] Something went wrong when converting your scores to PNG. Please ask the author to fix it.")
        if (isMobile()){
            const f = new File([blob], `result_${mode}.png`, {type: blob.type})
            if (navigator?.canShare({files: [f]})) {
                navigator.share({files: [f], text: "#CHUNITHM"}).catch(console.log)
            }
        } else {
            $("<a>").attr({
                download: `result_${mode}.png`,
                href: window.URL.createObjectURL(blob)
            })[0].click()
        }
    })
}

export async function saveResultAsPicture (ce: MouseEvent, mode: "b30"|"b40") {
    $(ce.currentTarget as HTMLButtonElement).fadeTo(100, 0.5)
    await savePic(mode)
    $(ce.currentTarget as HTMLButtonElement).fadeTo(100, 1)
}