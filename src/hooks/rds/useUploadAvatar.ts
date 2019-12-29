import { gql, ApolloError } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks"
import axios, { AxiosRequestConfig } from "axios"
import moment from "moment"

const S3_GET_SIGNED_PUT_OBJECT_URL = gql`
  mutation($fileName: String!, $fileType: String!) {
    s3GetSignedPutObjectUrl(fileName: $fileName, fileType: $fileType) {
      objectUrl
      signedPutObjectUrl
    }
  }
`
type S3 = {
  data: {
    s3GetSignedPutObjectUrl: {
      objectUrl: string
      signedPutObjectUrl: string
    }
  }
}

const UPDATE_USER_AVATAR = gql`
  mutation($avatarUrl: String!) {
    updateUserAvatar(avatarUrl: $avatarUrl) {
      id
      username
      first_name
      last_name
      avatar_url
    }
  }
`

export function useUploadAvatar({ onSuccess }: { onSuccess: () => void }) {
  // if (!file) throw new Error("Missing a required 'file' argument")
  // These args just come from client state
  const [getSignedUrl, { data: data_1, loading: loading_1 }] = useMutation(
    S3_GET_SIGNED_PUT_OBJECT_URL,
    {
      onCompleted: data => {},
      onError: (error: ApolloError) => {
        console.error(error)
        throw new Error(error.message)
      },
    }
  )

  // These args are dependent on the response from the earlier mutation
  const [updateUserAvatar, { data: data_2, loading: loading_2 }] = useMutation(
    UPDATE_USER_AVATAR,
    {
      onCompleted: data => {
        onSuccess?.()
      },
      onError: (error: ApolloError) => {
        console.error(error)
        throw new Error(error.message)
      },
    }
  )

  const uploadAvatar = async (file: File) => {
    try {
      const response: S3 = await getSignedUrl({
        variables: {
          fileName: formatFilename(file?.name ?? ""),
          fileType: file?.type ?? "",
        },
      })
      console.log("getSignedUrl succeeded")
      const avatarUrl = response.data?.s3GetSignedPutObjectUrl.objectUrl
      const signedPutObjectUrl =
        response.data?.s3GetSignedPutObjectUrl.signedPutObjectUrl

      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": file?.type,
        },
      }
      await axios.put(signedPutObjectUrl, file, config)
      console.log("upload to S3 succeeded")
      await updateUserAvatar({ variables: { avatarUrl } })
      console.log("User avatar update succeeded")
    } catch (error) {
      console.error(error)
    }
  }

  return { uploadAvatar }
}

const formatFilename = (filename: string) => {
  const date = moment().format("YYYYMMDD")
  const randomString = Math.random()
    .toString(36)
    .substring(2, 7)
  const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-")
  const newFilename = `images/${date}-${randomString}-${cleanFileName}`
  return newFilename.substring(0, 60)
}
