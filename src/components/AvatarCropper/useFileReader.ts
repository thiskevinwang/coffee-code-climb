import { useState, useEffect } from "react"
import exif from "exif-js"

/**
 * A helper
 */
const useOrientation = (file: File | null) => {
  const [orientation, setOrientation] = useState<number>()

  useEffect(() => {
    if (file) {
      exif.getData(file, function () {
        const detectedOrientation = exif.getTag(this, "Orientation")
        setOrientation(detectedOrientation)
      })
    }
  }, [file])

  return { orientation }
}

/**
 * This hook has the responsibility of
 * - creating an ephemeral FileReader
 * - detecting an image's exif-data/orientation
 */
export const useFileReader = () => {
  /** state for file, uploaded by inputRef */
  const [file, setFile] = useState<File>()
  const { orientation } = useOrientation(file!)
  /** memo-ized FileReader (FileReader not available in SSR) */
  const [reader] = useState(() =>
    typeof FileReader !== "undefined" ? new FileReader() : undefined
  )

  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>(null)

  if (reader) {
    // attach ev listener
    reader.onload = () => {
      // console.log("reader.onload", e.target?.result, reader.result)
      setImgSrc(reader.result)
    }
  }

  useEffect(() => {
    if (file && reader) {
      // imperatively read file, which triggers the
      // event listener above
      reader.readAsDataURL(file)
    }
  }, [file, reader])

  return { file, setFile, imgSrc, setImgSrc, orientation }
}
