import { useState } from "react"
import { gql, useMutation } from "@apollo/client"
import axios, { AxiosRequestConfig } from "axios"

import { Query, S3Payload } from "types"
import { useVerifyTokenSet } from "utils"
import { GET_OR_CREATE_USER } from "pages/app"

const S3_GET_SIGNED_PUT_OBJECT_URL = gql`
  mutation($fileName: String!, $fileType: String!) {
    s3: s3GetSignedPutObjectUrl(fileName: $fileName, fileType: $fileType) {
      objectUrl
      signedPutObjectUrl
    }
  }
`
type S3 = {
  s3: S3Payload
}

const UPDATE_USER_AVATAR = gql`
  mutation($avatarUrl: String!, $id: String!) {
    updateAvatarUrl(avatarUrl: $avatarUrl, id: $id) {
      avatar_url
    }
  }
`
interface IUploadAvatarArgs {
  onSuccess: () => void
  onError?: (err: any) => void
  croppedImgSrc?: string
  variablesForCacheUpdate: any
}

export function useUploadAvatar({
  onSuccess,
  onError,
  croppedImgSrc,
  variablesForCacheUpdate,
}: IUploadAvatarArgs) {
  const [isLoading, setIsLoading] = useState(false)

  // These args just come from client state
  const [getSignedUrl] = useMutation<S3>(S3_GET_SIGNED_PUT_OBJECT_URL, {
    onCompleted: (data) => {},
    onError: (err) => {
      console.error(err)
      onError?.(err)
      throw err
    },
  })

  // These args are dependent on the response from the earlier mutation
  const [updateAvatarUrl] = useMutation(UPDATE_USER_AVATAR, {
    onCompleted: (data) => {
      onSuccess?.()
    },
    onError: (err) => {
      console.error(err)
      onError?.(err)
      throw err
    },
    update: (cache, mutationResult) => {
      // Get the cached data
      const cacheData = cache.readQuery<{ user: Query["getOrCreateUser"] }>({
        query: GET_OR_CREATE_USER,
        variables: variablesForCacheUpdate,
      })

      // Create fresh data
      const freshData = {
        user: {
          ...cacheData?.user,
          avatar_url: croppedImgSrc,
        },
      }

      // Update the cache with fresh data
      cache.writeQuery({
        query: GET_OR_CREATE_USER,
        data: freshData,
        variables: variablesForCacheUpdate,
      })
    },
  })

  const { accessTokenPayload } = useVerifyTokenSet()
  const userId = accessTokenPayload?.username

  const uploadAvatar = async (file: File, imgSrc: string) => {
    if (!file) throw new Error("Missing a required 'file' argument")
    setIsLoading(true)

    try {
      const response = await getSignedUrl({
        variables: {
          fileName: `${userId}/avatar`,
          fileType: file.type,
        },
      })
      console.log("signed url response", response)

      const avatarUrl = response?.data?.s3.objectUrl
      const signedPutObjectUrl = response?.data?.s3.signedPutObjectUrl

      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": file?.type,
          /** https://github.com/aws/aws-sdk-js/issues/2482 */
          "Content-Encoding": "base64",
        },
      }
      // await axios.put(signedPutObjectUrl, file, config)
      const buffer = Buffer.from(
        imgSrc.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      )

      console.log(signedPutObjectUrl!, buffer, config)
      const axiosRes = await axios.put(signedPutObjectUrl!, buffer, config)
      console.log("axiosRes", axiosRes.data)
      await updateAvatarUrl({ variables: { avatarUrl, id: userId } })

      setIsLoading(false)
    } catch (err) {
      onError?.(err)
      setIsLoading(false)
      console.error(err)
    }
  }

  return { uploadAvatar, isLoading }
}
