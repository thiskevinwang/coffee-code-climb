import * as React from "react"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"

interface Props {
  document: {
    nodeType: BLOCKS.DOCUMENT
    content: Array<any>
    data: any
  }
}

export default function DocumentToReactComponents({ document }: Props) {
  /**
   * Arguments to pass to: documentToReactComponents(document, options)
   * https://github.com/contentful/rich-text/tree/master/packages/rich-text-react-renderer
   **/
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: node => {
        // console.log(node)
        let { file, title, description } = node.data.target.fields
        // console.log(file["en-US"].url)
        return <img src={file["en-US"].url} alt={description["en-US"]} />
      },
    },
  }
  // console.log(documentToReactComponents(document, options))

  return documentToReactComponents(document, options)
}
