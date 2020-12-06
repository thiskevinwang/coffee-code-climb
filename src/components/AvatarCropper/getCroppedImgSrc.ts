import ReactCrop from "react-image-crop"

interface IGetCroppedImgSrcArgs {
  _crop: ReactCrop.Crop
  _image: HTMLImageElement
  _canvas: HTMLCanvasElement
  _orientation?: number
  _file: File
}

export function getCroppedImgSrc({
  _crop,
  _image,
  _canvas,
  _orientation,
  _file,
}: IGetCroppedImgSrcArgs) {
  if (!_file) return

  const scaleX = _image.naturalWidth / _image.width
  const scaleY = _image.naturalHeight / _image.height

  const rawWidth = _orientation > 4 ? _image.height : _image.width
  const rawHeight = _orientation > 4 ? _image.width : _image.height

  _canvas.setAttribute("width", `${_crop.width!}`)
  _canvas.setAttribute("height", `${_crop.height!}`)

  const ctx = _canvas.getContext("2d")
  // prettier-ignore
  switch (_orientation) {
    case  2: ctx?.transform(-1,  0,  0,  1,  rawWidth,  0        ); break;
    case  3: ctx?.transform(-1,  0,  0, -1,  rawWidth,  rawHeight); break;
    case  4: ctx?.transform( 1,  0,  0, -1,  0,         rawHeight); break;
    case  5: ctx?.transform( 0,  1,  1,  0,  0,         0        ); break;
    case  6: ctx?.transform( 0,  1, -1,  0,  rawHeight, 0        ); break;
    case  7: ctx?.transform( 0, -1, -1,  0,  rawHeight, rawWidth ); break;
    case  8: ctx?.transform( 0, -1,  1,  0,  0,         rawWidth ); break;
    default: break;
  }

  if (/* PORTRAIT */ _orientation > 4) {
    ctx?.rotate(0.05)
    ctx?.drawImage(
      _image,
      /**
       * swapping x & y makes the crop selection and canvas feedback match in scroll behavior.
       */
      _crop.y * scaleY,
      _crop.x * scaleX,
      _crop.height * scaleY,
      _crop.width * scaleX,
      _image.height - _crop.height,
      /** this fixes smaller crop sizes creating black space on the preview canvas */
      _image.width - _crop.width,
      _crop.width,
      _crop.height
    )
  } /* LANDSCAPE */ else {
    ctx?.drawImage(
      _image,
      _crop.x * scaleX,
      _crop.y * scaleY,
      _crop.width * scaleX,
      _crop.height * scaleY,
      0,
      0,
      _crop.width,
      _crop.height
    )
  }
  // ctx?.drawImage(
  //   _image,
  //   _crop.x * scaleX,
  //   _crop.y * scaleY,
  //   _crop.width * scaleX,
  //   _crop.height * scaleY,
  //   0,
  //   0,
  //   _crop.width,
  //   _crop.height
  // )

  const croppedImgSrc = _canvas.toDataURL(_file.type, 1)
  return croppedImgSrc
}
