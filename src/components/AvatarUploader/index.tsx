import React, { useState, useRef, useEffect, useReducer } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { animated } from "react-spring"
import exif from "exif-js"

import { useAuthentication } from "hooks/useAuthentication"
import { useUploadAvatar } from "hooks/rds/useUploadAvatar"

import { SubmitButton } from "components/Form"
import { DivTitle } from "components/Comments/Create"

const StyledForm = styled(animated.form)`
  /* ReactCrop magic */
  /* border-image-source: url("data:image/gif;base64,R0lGODlhCgAKAJECAAAAAP///////wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEI5RDc5MTFDNkE2MTFFM0JCMDZEODI2QTI4MzJBOTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEI5RDc5MTBDNkE2MTFFM0JCMDZEODI2QTI4MzJBOTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuZGlkOjAyODAxMTc0MDcyMDY4MTE4MDgzQzNDMjA5MzREQ0ZDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAyODAxMTc0MDcyMDY4MTE4MDgzQzNDMjA5MzREQ0ZDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEBQoAAgAsAAAAAAoACgAAAhWEERkn7W3ei7KlagMWF/dKgYeyGAUAIfkEBQoAAgAsAAAAAAoACgAAAg+UYwLJ7RnQm7QmsCyVKhUAIfkEBQoAAgAsAAAAAAoACgAAAhCUYgLJHdiinNSAVfOEKoUCACH5BAUKAAIALAAAAAAKAAoAAAIRVISAdusPo3RAzYtjaMIaUQAAIfkEBQoAAgAsAAAAAAoACgAAAg+MDiem7Q8bSLFaG5il6xQAIfkEBQoAAgAsAAAAAAoACgAAAg+UYRLJ7QnQm7SmsCyVKhUAIfkEBQoAAgAsAAAAAAoACgAAAhCUYBLJDdiinNSEVfOEKoECACH5BAUKAAIALAAAAAAKAAoAAAIRFISBdusPo3RBzYsjaMIaUQAAOw=="); */
  /* border-image-slice: 1; */
  /* border-image-repeat: repeat;   */
  border-width: 1px;
  border-color: ${theme("mode", {
    light: (props: BaseProps) => props.theme.commentRenderer.borderColor,
    dark: (props: BaseProps) => props.theme.commentRenderer.borderColor,
  })};
  border-style: solid;
  border-radius: 0.2rem;
  padding: 1.5rem;
  /* width: 20rem;
  height: 20rem; */
`

const ImageContainer = styled(animated.div)`
  display: flex;
  justify-content: center;
  border-bottom-color: ${theme("mode", {
    light: (props: BaseProps) => props.theme.commentRenderer.borderColor,
    dark: (props: BaseProps) => props.theme.commentRenderer.borderColor,
  })};
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding-bottom: 1rem;
  margin-bottom: 1rem;

  /* This prevents the draggable ReactCrop from glitching when touching the bottom border */
  img {
    margin-bottom: 0rem;
  }
`

const Img = styled(animated.img)`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 5rem;
  height: 5rem;
  border-radius: 100%;
`

export const AvatarUploader = () => {
  const { currentUserId } = useAuthentication()
  const canvasRef = useRef<HTMLCanvasElement>()
  const inputRef = useRef<HTMLInputElement>()
  const handleClick = e => {
    inputRef.current?.click()
  }
  const { uploadAvatar, isLoading } = useUploadAvatar({
    onSuccess: () => {
      reset()
    },
  })

  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: "%",
    aspect: 1,
    height: 100,
    width: 100,
  })

  const {
    handleFileInputChange,
    imgSrc,
    croppedImgSrc,
    file,
    dispatchSetImage,
    reset,
  } = useImgHandling({
    crop,
    canvasRef,
  })

  if (!currentUserId) return null
  return (
    <>
      <StyledForm
        onSubmit={e => {
          e.preventDefault()
          !isLoading && uploadAvatar(file, croppedImgSrc)
        }}
      >
        <DivTitle>Upload An Avatar (Beta)</DivTitle>
        {imgSrc && (
          <>
            <ImageContainer>
              <ReactCrop
                src={imgSrc}
                crop={{ ...crop, aspect: 1 }}
                ruleOfThirds
                circularCrop
                onImageLoaded={image => {
                  dispatchSetImage(image)
                }}
                // onComplete={c => setCrop(c)}
                onChange={c => setCrop(c)}
              />
            </ImageContainer>
          </>
        )}
        {croppedImgSrc && <Img src={croppedImgSrc}></Img>}
        {/* this avoids document.createElement("canvas"), inside `getCroppedImgSrc()` */}
        <canvas
          ref={canvasRef}
          style={{
            border: `2px dotted pink`,
            display: "none",
          }}
        />
        <input
          ref={inputRef}
          type={"file"}
          accept={"image/png, image/jpeg"}
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        <div style={{ display: "flex" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SubmitButton
              style={{
                width: "initial",
                marginBottom: 0,
              }}
              /** type "button" avoids form submission */
              type={"button"}
              onClick={handleClick}
              disabled={isLoading}
            >
              Select an image
            </SubmitButton>
          </div>

          {file && (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SubmitButton
                style={{
                  width: "initial",
                  marginBottom: 0,
                }}
                type={"submit"}
                disabled={isLoading || !croppedImgSrc}
              >
                {"Set Avatar"}
              </SubmitButton>
            </div>
          )}
        </div>
      </StyledForm>
    </>
  )
}

interface IUseImgArgs {
  crop: ReactCrop.Crop
  canvasRef: React.Ref<HTMLCanvasElement>
}
/**
 * @TODO rename this
 */
function useImgHandling({ crop, canvasRef }: IUseImgArgs) {
  const [reader] = useState(() => new FileReader())
  reader.onload = (e: ProgressEvent) => {
    setImgSrc(reader.result ?? e.target.result)
  }

  const [image, dispatchSetImage] = useReducer<HTMLImageElement>(
    (state, action) => action,
    null
  )
  const [file, setFile] = useState<File>(null)
  const { orientation } = useOrientation(file)

  // imgSrc gets passed to ReactCrop, and a loadedImage image is returned
  const [imgSrc, setImgSrc] = useState<string>(null)
  const [croppedImgSrc, setCroppedImgSrc] = useState<string>(null)

  const [canvas, setCanvas] = useState<HTMLCanvasElement>(canvasRef.current)
  useEffect(() => setCanvas(canvasRef.current), [canvasRef.current])

  useEffect(() => {
    if (image) {
      const _croppedImageSrc = getCroppedImgSrc({
        _crop: crop,
        _image: image,
        _file: file,
        _canvas: canvas,
        _orientation: orientation,
      })
      if (_croppedImageSrc === "data:,") {
        setCroppedImgSrc(null)
      } else {
        setCroppedImgSrc(_croppedImageSrc)
      }
    }
  }, [crop, image, file])

  useEffect(() => {
    if (file) reader.readAsDataURL(file)
  }, [file])

  const reset = () => {
    setFile(null)
    setImgSrc(null)
    setCroppedImgSrc(null)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      // this will go trigger some side effects
    } else {
      reset()
    }
  }

  return {
    handleFileInputChange,
    imgSrc,
    croppedImgSrc,
    file,
    dispatchSetImage,
    reset,
  }
}

interface IGetCroppedImgSrcArgs {
  _crop: ReactCrop.Crop
  _image: HTMLImageElement
  _file: File
  _canvas: HTMLCanvasElement
  _orientation: number
}
function getCroppedImgSrc({
  _crop,
  _image,
  _file,
  _canvas,
  _orientation,
}: IGetCroppedImgSrcArgs) {
  if (!_file) return

  console.log(_image)
  console.log(
    JSON.stringify(
      {
        natWidth: _image.naturalWidth, // 6000
        width: _image.width, // 580
        natHeight: _image.naturalHeight, // 4000
        height: _image.height, // 387
        orientation: _orientation,
      },
      null,
      2
    )
  )
  console.log(_crop)

  const scaleX = _image.naturalWidth / _image.width
  const scaleY = _image.naturalHeight / _image.height

  // _canvas.setAttribute("width", _crop.width)
  // _canvas.setAttribute("height", _crop.height)

  const rawWidth = _orientation > 4 ? _image.height : _image.width
  const rawHeight = _orientation > 4 ? _image.width : _image.height

  _canvas.setAttribute("width", _crop.width)
  _canvas.setAttribute("height", _crop.height)

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

  const croppedImgSrc = _canvas.toDataURL(_file.type)
  return croppedImgSrc
}

const useOrientation = (file: File) => {
  const [orientation, setOrientation] = useState<number>()

  useEffect(() => {
    if (file) {
      exif.getData(file, function() {
        setOrientation(exif.getTag(this, "Orientation"))
      })
    }
  }, [file])

  return { orientation }
}
