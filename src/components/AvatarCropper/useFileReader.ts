import { useState, useEffect } from "react"
import exif from "exif-js"
import loadImage from "blueimp-load-image"

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

  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>(null)

  useEffect(() => {
    if (file) {
      loadImage(
        file,
        (img) => {
          const base64data = img.toDataURL?.(`image/jpeg`)
          setImgSrc(base64data)
        },
        { orientation: true, canvas: true }
      )
    }
  }, [file])

  return { file, setFile, imgSrc, setImgSrc, orientation }
}
