import React, { useState, useRef, useEffect } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import { useSnackbar } from "notistack"
import styled from "styled-components"

import { useUploadAvatar } from "hooks/rds/useUploadAvatar"
import Modal from "components/Modal"

import { getCroppedImgSrc } from "./getCroppedImgSrc"
import { useFileReader } from "./useFileReader"

const Container = styled.div`
  /* ReactCrop magic */
  /* border-image-source: url("data:image/gif;base64,R0lGODlhCgAKAJECAAAAAP///////wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEI5RDc5MTFDNkE2MTFFM0JCMDZEODI2QTI4MzJBOTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEI5RDc5MTBDNkE2MTFFM0JCMDZEODI2QTI4MzJBOTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuZGlkOjAyODAxMTc0MDcyMDY4MTE4MDgzQzNDMjA5MzREQ0ZDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAyODAxMTc0MDcyMDY4MTE4MDgzQzNDMjA5MzREQ0ZDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEBQoAAgAsAAAAAAoACgAAAhWEERkn7W3ei7KlagMWF/dKgYeyGAUAIfkEBQoAAgAsAAAAAAoACgAAAg+UYwLJ7RnQm7QmsCyVKhUAIfkEBQoAAgAsAAAAAAoACgAAAhCUYgLJHdiinNSAVfOEKoUCACH5BAUKAAIALAAAAAAKAAoAAAIRVISAdusPo3RAzYtjaMIaUQAAIfkEBQoAAgAsAAAAAAoACgAAAg+MDiem7Q8bSLFaG5il6xQAIfkEBQoAAgAsAAAAAAoACgAAAg+UYRLJ7QnQm7SmsCyVKhUAIfkEBQoAAgAsAAAAAAoACgAAAhCUYBLJDdiinNSEVfOEKoECACH5BAUKAAIALAAAAAAKAAoAAAIRFISBdusPo3RBzYsjaMIaUQAAOw=="); */
  /* border-image-slice: 1; */
  /* border-image-repeat: repeat;   */
`

const DEFAULT_CROP: ReactCrop.Crop = {
  unit: "%",
  aspect: 1,
  height: 100,
  width: 100,
}

/**
 * This component returns a _**clickable avatar**_, that prompts a
 * file-upload dialog.
 *
 * When the file is uploaded to the browser, a _**modal-cropper**_
 * is displayed, along with option to submit.
 *
 * Upon submit, the following requests are made
 * - 1. Get a S3 signed url (GraphQL)
 * - 2. Upload the cropped image data to S3 (Rest)
 * - 3. Update the user's `avatar_url` (GraphQL)
 *
 * The Apollo cache is also updated with the cropped avatar url
 */
export const AvatarCropper = ({
  src,
  variablesForCacheUpdate,
}: {
  src?: string
  variablesForCacheUpdate: any
}) => {
  const { enqueueSnackbar } = useSnackbar()
  /** ref for an invisible native canvas element */
  const canvasRef = useRef<HTMLCanvasElement>()
  /** ref for an invisible native input element */
  const inputRef = useRef<HTMLInputElement>()
  const clickInvisibleInput = () => inputRef.current!.click()
  const { file, setFile, imgSrc, setImgSrc, orientation } = useFileReader()

  // initial `crop` values; will get reset by ReactCrop
  // setCrop is only passed to ReactCrop
  const [crop, setCrop] = useState<ReactCrop.Crop>(() => DEFAULT_CROP)

  // imageElement is the image inside <ReactCrop>
  const imageRef = useRef<HTMLImageElement>()

  const [croppedImgSrc, setCroppedImgSrc] = useState<string>()

  useEffect(() => {
    // This is mainly a sideEffect of
    if (imageRef.current && file) {
      const _croppedImageSrc = getCroppedImgSrc({
        _crop: crop,
        _image: imageRef.current,
        _canvas: canvasRef.current!,
        _orientation: orientation,
        _file: file,
      })!

      setCroppedImgSrc(_croppedImageSrc)
    }
  }, [crop, file, imageRef.current, canvasRef.current])

  // our api call... less important for now
  const { uploadAvatar, isLoading } = useUploadAvatar({
    onSuccess: () => {
      // reset various state values
      setFile(undefined)
      setImgSrc(null)
      setCroppedImgSrc(undefined)
      enqueueSnackbar("Avatar updated successfully", {
        variant: "success",
      })
    },
    onError: (err) => {
      enqueueSnackbar(`Error: ${err.message}`, {
        variant: "error",
      })
    },
    croppedImgSrc,
    variablesForCacheUpdate,
  })

  const handleCancel = () => setFile(undefined)
  const handleSubmit = () => uploadAvatar(file, croppedImgSrc)

  return (
    <Container>
      <Modal.Modal open={!!file} onClose={() => {}}>
        <Modal.Body>
          <ReactCrop
            style={{
              backgroundColor: "var(--accents-2)",
            }}
            imageStyle={{
              // prevent crop-box-drag-bounce bug on v8.4.2
              marginBottom: "0px",
            }}
            src={imgSrc as string}
            crop={crop}
            // ruleOfThirds
            circularCrop
            onImageLoaded={(target) => {
              imageRef.current = target
            }}
            onChange={(c) => {
              setCrop(c)
            }}
          />
        </Modal.Body>
        <Modal.Actions>
          <Modal.Action onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Modal.Action>
          <Modal.Action
            onClick={handleSubmit}
            disabled={isLoading || !croppedImgSrc}
          >
            Set Avatar
          </Modal.Action>
        </Modal.Actions>
      </Modal.Modal>

      {/* Image feedback is optional... vercel only shows the crop box */}
      {/* {process.env.NODE_ENV === "development" && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          border="1px dashed red"
          boxShadow="var(--shadow-medium)"
          mb="var(--geist-gap)"
        >
          <img
            src={croppedImgSrc as string}
            style={{
              maxHeight: 150,
              maxWidth: 150,
            }}
          />
        </Box>
      )} */}

      <Box display="none">
        {/* Invisible elements */}
        <canvas ref={canvasRef} />
        <input
          ref={inputRef}
          type={"file"}
          accept={"image/png, image/jpeg"}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (typeof file === "undefined") return
            setFile(file)
          }}
        />
      </Box>

      <Box>
        <Avatar
          src={croppedImgSrc ?? src}
          onClick={clickInvisibleInput}
          style={{
            height: "var(--geist-space-24x)",
            width: "var(--geist-space-24x)",
            cursor: "pointer",
            border: "1px solid var(--accents-2)",
          }}
        />
      </Box>
    </Container>
  )
}
