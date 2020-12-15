import React from "react"
import styled from "styled-components"

import { LoadingIndicator } from "components/LoadingIndicator"

const FullPage = styled.div`
  background: var(--geist-background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`

export const LoadingPage = () => {
  return (
    <FullPage>
      <LoadingIndicator style={{ fontSize: 96 }} />
    </FullPage>
  )
}
