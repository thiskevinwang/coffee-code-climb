import React, { useRef } from "react"
import styled, { css } from "styled-components"
import {
  ContentBlock,
  Editor,
  EditorProps,
  EditorState,
  RichUtils,
  DraftInlineStyleType,
  DraftBlockType,
} from "draft-js"

export const RichEditorRoot = styled.div<{ readOnly?: boolean }>`
  background: var(--accents-1);
  padding: var(--geist-gap-half);
  border: 1px solid var(--accents-3);
  transition: border-color 200ms ease-in-out;

  ${(p) =>
    !p.readOnly &&
    css`
      :hover,
      :focus-within {
        border-color: var(--geist-foreground);
      }
    `}

  border-radius: var(--geist-radius);
  margin-bottom: var(--geist-gap-half);

  .RichEditor-editor {
    border-top: 1px solid var(--accents-3);
    cursor: text;
    font-size: 16px;
  }

  .RichEditor-editor .public-DraftEditorPlaceholder-root {
    position: absolute;
    color: var(--accents-4);
    pointer-events: none;
  }

  .RichEditor-editor .public-DraftEditorPlaceholder-root,
  .RichEditor-editor .public-DraftEditor-content {
    margin: 0 -15px -15px;
    padding: 15px;
  }

  .RichEditor-editor .public-DraftEditor-content {
    min-height: 100px;
  }

  .RichEditor-hidePlaceholder .public-DraftEditorPlaceholder-root {
    display: none;
  }

  .RichEditor-editor .RichEditor-blockquote {
    border-left: 5px solid #eee;
    color: #666;
    font-style: italic;
    margin: 16px 0;
    padding: 10px 20px;
  }

  .RichEditor-editor .public-DraftStyleDefault-ul,
  .RichEditor-editor .public-DraftStyleDefault-ol {
    margin-left: 16px;
  }

  .RichEditor-editor .public-DraftStyleDefault-pre {
    background-color: rgba(0, 0, 0, 0.05);
    font-family: "Inconsolata", "Menlo", "Consolas", monospace;
    font-size: 16px;
    padding: 20px;
  }

  .RichEditor-controls {
    font-size: 14px;
    margin-bottom: 5px;
    user-select: none;
  }

  .RichEditor-styleButton {
    color: var(--accents-4);
    cursor: pointer;
    margin-right: 16px;
    padding: 2px 0;
    display: inline-block;
    transition: color 200ms ease-in-out;

    :hover {
      color: var(--accents-8);
    }
  }

  .RichEditor-activeButton {
    color: var(--geist-code) !important;
  }
`

interface Props {
  editorState: EditorState
  onChange: (state: EditorState) => void
}
export const RichEditor: React.ComponentType<Props> = ({
  editorState,
  ...props
}) => {
  const editorRef = useRef()

  const onChange = (editorState) => {
    props.onChange(editorState)
  }

  const focus = () => {
    // editorRef.current?.focus?.()
  }

  const handleKeyCommand: EditorProps["handleKeyCommand"] = (
    command,
    editorState
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      onChange(newState)
      return "handled"
    }
    return "not-handled"
  }

  const onTab: EditorProps["onTab"] = (e) => {
    e.preventDefault()
    const maxDepth = 4
    onChange(RichUtils.onTab(e, editorState, maxDepth))
  }
  const toggleBlockType = (blockType: DraftBlockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType))
  }
  const toggleInlineStyle = (inlineStyle: string) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = "RichEditor-editor"
  const contentState = editorState.getCurrentContent()
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      className += " RichEditor-hidePlaceholder"
    }
  }
  return (
    <RichEditorRoot>
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <div className={className} onClick={focus}>
        <Editor
          editorState={editorState}
          blockStyleFn={getBlockStyle}
          onChange={onChange}
          customStyleMap={styleMap}
          handleKeyCommand={handleKeyCommand}
          onTab={onTab}
          placeholder="Write something 🐶"
          ref={editorRef}
          spellCheck={true}
        />
      </div>
    </RichEditorRoot>
  )
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}

function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote"
    default:
      return ""
  }
}

interface StyleButtonProps {
  onToggle:
    | ((blockType: DraftBlockType) => void)
    | ((inlineStyle: string) => void)
  label: string
  active: boolean
  style: string
}

/**
 * This is shared between `BlockStyleControls` & `InlineStyleControls`
 */
const StyleButton: React.ComponentType<StyleButtonProps> = (props) => {
  const onToggle: React.DOMAttributes<HTMLSpanElement>["onMouseDown"] = (e) => {
    e.preventDefault()
    props.onToggle(props.style)
  }

  let className = "RichEditor-styleButton"
  if (props.active) {
    className += " RichEditor-activeButton"
  }
  return (
    <span className={className} onMouseDown={onToggle}>
      {props.label}
    </span>
  )
}

type BlockType = { label: string; style: DraftBlockType }
const BLOCK_TYPES: BlockType[] = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  // { label: "Code Block", style: "code-block" },
]

interface BlockStyleControlsProps {
  editorState: EditorState
  onToggle: (blockType: DraftBlockType) => void
}

const BlockStyleControls = ({
  editorState,
  onToggle,
}: BlockStyleControlsProps) => {
  const selection = editorState.getSelection()
  const blockType: DraftBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

type InlineType = { label: string; style: DraftInlineStyleType }
const INLINE_STYLES: InlineType[] = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" },
]

interface InlineStyleControlsProps {
  editorState: EditorState
  onToggle: (inlineStyle: any) => void
}

const InlineStyleControls: React.ComponentType<InlineStyleControlsProps> = (
  props
) => {
  const currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}
