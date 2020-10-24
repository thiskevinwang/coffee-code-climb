import { useState, useEffect } from "react"

import { SELECTION_PREVIEW_CLASS } from "globalStyles"

export const useWindowSelection = () => {
  const [sel, setSel] = useState("")
  const [url, setUrl] = useState("")

  const [ele] = useState(() => document.createElement("div"))
  const [linkEle] = useState(() => document.createElement("a"))

  ele.style.minWidth = "300px"
  ele.style.maxWidth = "min(90vw, 450px)"
  ele.className = SELECTION_PREVIEW_CLASS

  useEffect(() => {
    document.body.appendChild(ele)

    const handleTextSelect: EventListener = () => {
      const selObj = window.getSelection()
      try {
        ele.removeChild(linkEle)
      } catch (err) {}

      const selectedText = selObj?.toString() || ""
      setSel(selectedText)
      ele.style.opacity = !!selectedText ? "1" : "0"

      const baseURI =
        selObj?.anchorNode?.baseURI || "https://coffeecodeclimb.com"
      setUrl(baseURI)

      const r = window
        ?.getSelection()
        ?.getRangeAt(0)
        .getBoundingClientRect() as DOMRect
      const relative = (document?.body
        ?.parentNode as HTMLElement)?.getBoundingClientRect()

      ele.innerHTML = `<p><i>${selectedText}</i></p>`

      ele.style.top = r.bottom - relative.top + "px" //this will place ele below the selection
      ele.style.right = -(r.right - relative.right) + "px" //this will align the right edges together

      const handleLinkClick = () => {
        const shareDialogParams: fb.ShareDialogParams = {
          method: "share",
          href: url,
          quote: selectedText,
          display: "popup",
        }

        FB.ui(shareDialogParams, (response) => {
          console.log({ response })
        })
      }
      linkEle.innerHTML = "SHARE"
      linkEle.style.textAlign = "right"
      linkEle.style.cursor = "pointer"
      linkEle.addEventListener("mousedown", handleLinkClick)
      ele.appendChild(linkEle)
    }

    window.addEventListener("mouseup", handleTextSelect)
    return () => {
      console.log("CLEAN UP")
      window.removeEventListener("mouseup", handleTextSelect)
      document.body.removeChild(ele)
    }
  }, [])

  return sel
}
