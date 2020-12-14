import React from "react"
import { gql, useMutation } from "@apollo/client"
import { EditorState, convertToRaw } from "draft-js"
import { Formik, Form } from "formik"
import { RouteComponentProps } from "@reach/router"
import { useSnackbar } from "notistack"
import * as yup from "yup"

import { useVerifyTokenSet } from "utils"
import { Mutation, MutationCreateDiscussionArgs } from "types"
import { SubmitButton } from "components/Form"
import { RichEditor } from "components/RichEditor"

import { TextField } from "./Shared/TextField"

const CREATE_DISCUSSION_MUTATION = gql`
  mutation CreateDiscussion($input: CreateDiscussionInput!) {
    createDiscussion(input: $input) {
      id
      PK
      SK
      created
      updated
      title
      content
    }
  }
`

const schema = yup.object().shape({
  title: yup.string().required("Please enter a title."),
})

export const Submit = ({ navigate }: RouteComponentProps) => {
  const { accessTokenPayload } = useVerifyTokenSet()
  const id = accessTokenPayload?.username

  const { enqueueSnackbar } = useSnackbar()

  const [createDiscussion] = useMutation<
    { createDiscussion: Mutation["createDiscussion"] },
    MutationCreateDiscussionArgs
  >(CREATE_DISCUSSION_MUTATION)

  return (
    <>
      <h1>Create a post</h1>
      <br />
      <br />
      <Formik
        initialValues={{
          title: "",
          editorState: EditorState.createEmpty(),
        }}
        validationSchema={schema}
        onSubmit={async ({ title, editorState }) => {
          const contentString = JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          )

          await createDiscussion({
            variables: {
              input: {
                title: title,
                content: contentString,
                authorId: id!,
              },
            },
          })

          enqueueSnackbar("Post created!", { variant: "success" })
          await navigate!("/app/discussions")
        }}
      >
        {({ values, errors, setFieldValue }) => {
          const handleChange = (e) => {
            setFieldValue(e.target.name, e.target.value)
          }

          return (
            <Form>
              <TextField
                value={values.title}
                helperText={errors.title}
                error={!!errors.title}
                onChange={handleChange}
                style={{ marginBottom: "var(--geist-gap-half)" }}
                fullWidth
                id="title"
                name="title"
                placeholder="title"
                autoComplete={"off"}
              />

              {process.env.NODE_ENV !== "production" && (
                <TextField
                  disabled
                  value={id}
                  onChange={handleChange}
                  style={{ marginBottom: "var(--geist-gap-half)" }}
                  fullWidth
                  id="authorId"
                  name="authorId"
                  placeholder="authorId"
                  autoComplete={"off"}
                />
              )}

              <RichEditor
                editorState={values.editorState}
                onChange={(state) => setFieldValue("editorState", state)}
              />

              <SubmitButton>Post</SubmitButton>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
