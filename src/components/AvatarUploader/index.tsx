import React, { useState, useRef } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { animated } from "react-spring"

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
  const inputRef = useRef<HTMLInputElement>()
  const imgRef = useRef<HTMLImageElement>()
  const canvasRef = useRef<HTMLCanvasElement>()

  const handleClick = e => {
    inputRef.current.click()
  }

  const { uploadAvatar, isLoading } = useUploadAvatar({
    onSuccess: () => {
      setFile(null)
      setImgSrc(null)
      setCroppedImgSrc(null)
    },
  })

  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: "%",
    aspect: 1,
    height: 100,
  })

  /** file is what gets uploaded to S3 */
  const [file, setFile] = useState<File>(null)

  /** imgSrc is just for locally displaying the selected image */
  const [imgSrc, setImgSrc] = useState<string>(null)

  const [croppedImgSrc, setCroppedImgSrc] = useState<string>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files?.[0]) {
      const reader = new FileReader()

      reader.onload = async (e: ProgressEvent) => {
        setImgSrc(reader.result ?? e.target.result)
      }

      reader.readAsDataURL(files[0])
      setFile(files[0])
    } else {
      setFile(null)
      setImgSrc(null)
      setCroppedImgSrc(null)
    }
  }

  function getCanvasUrl(_crop: ReactCrop.Crop) {
    const _img = imgRef.current
    const _canvas = document.createElement("canvas")

    const scaleX = _img.naturalWidth / _img.width
    const scaleY = _img.naturalHeight / _img.height

    _canvas.setAttribute("width", _crop.width)
    _canvas.setAttribute("height", _crop.height)

    const ctx = _canvas.getContext("2d")
    ctx.drawImage(
      _img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    const canvasUrl = _canvas.toDataURL(file.type)
    return canvasUrl
  }

  const handleCompleteAndChange = (_crop: ReactCrop.Crop) => {
    setCrop({ ..._crop, aspect: 1 })
    const croppedImgSrc = getCanvasUrl(_crop)
    setCroppedImgSrc(croppedImgSrc)
  }
  if (!currentUserId) return null
  return (
    <>
      <StyledForm
        onSubmit={e => {
          e.preventDefault()
          !isLoading && uploadAvatar(file, croppedImgSrc)
        }}
      >
        <DivTitle>Upload An Avatar</DivTitle>
        {imgSrc && (
          <>
            <ImageContainer>
              <ReactCrop
                src={imgSrc}
                crop={crop}
                ruleOfThirds
                circularCrop
                // https://github.com/DominicTobias/react-image-crop/issues/32
                onImageLoaded={(target: HTMLImageElement) => {
                  imgRef.current = target
                }}
                onComplete={handleCompleteAndChange}
                onChange={handleCompleteAndChange}
              />
            </ImageContainer>
          </>
        )}
        {croppedImgSrc && <Img src={croppedImgSrc}></Img>}

        <input
          ref={inputRef}
          type={"file"}
          accept={"image/png, image/jpeg"}
          style={{ display: "none" }}
          onChange={handleChange}
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
                disabled={isLoading}
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