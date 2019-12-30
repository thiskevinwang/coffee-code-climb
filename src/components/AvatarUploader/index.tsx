import React, { useState, useRef } from "react"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { animated } from "react-spring"

import { useAuthentication } from "hooks/useAuthentication"
import { useUploadAvatar } from "hooks/rds/useUploadAvatar"

import { SubmitButton } from "components/Form"
import { DivTitle } from "components/Comments/Create"

const StyledForm = styled(animated.form)`
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
  margin-bottom: 1rem;

  > img {
    margin-bottom: 1rem;
  }
`

export const AvatarUploader = () => {
  const { currentUserId } = useAuthentication()
  const inputRef = useRef<HTMLInputElement>()
  const handleClick = e => {
    inputRef.current.click()
  }

  const { uploadAvatar, isLoading } = useUploadAvatar({
    onSuccess: () => {
      setFile(null)
      setImgSrc(null)
    },
  })

  /** file is what gets uploaded to S3 */
  const [file, setFile] = useState<File>(null)

  /** imgSrc is just for locally displaying the selected image */
  const [imgSrc, setImgSrc] = useState<string>(null)

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
    }
  }

  if (!currentUserId) return null

  return (
    <>
      <StyledForm
        onSubmit={e => {
          e.preventDefault()
          !isLoading && uploadAvatar(file)
        }}
      >
        <DivTitle>Upload An Avatar</DivTitle>

        {imgSrc && (
          <ImageContainer>
            <img src={imgSrc} alt={file.name} />
          </ImageContainer>
        )}

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
