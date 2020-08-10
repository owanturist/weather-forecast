import React from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
import logo from './logo.svg'

export const foo = 0

const StyledRoot = styled.div`
  background: #ccc;
`

const cssLogo = css`
  height: 50px;
`

const App: React.FC = () => {
  return (
    <StyledRoot>
      <header className="App-header">
        <img src={logo} className={cssLogo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </StyledRoot>
  )
}

export default App
