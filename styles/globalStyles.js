import { createGlobalStyle } from "styled-components";

// Global Style
const GlobalStyle = createGlobalStyle`
  /* START NORMALIZE */
  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    font-size: 62.5%;
  }

  body {
    margin: 0;
    font-size: 1.6rem;
    max-width: 100%;
    overflow-x: hidden;
  }
  main {
    display: block;
  }
  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }
  pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }
  a {
    background-color: transparent;
    text-decoration: none;
  }
  abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    text-decoration: underline dotted;
  }
  b,
  strong {
    font-weight: bolder;
  }
  code,
  kbd,
  samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  img {
    border-style: none;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  button,
  input {
    overflow: visible;
  }
  button,
  select {
    text-transform: none;
  }
  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }
  button::-moz-focus-inner,
  [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner,
  [type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }
  button:-moz-focusring,
  [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring,
  [type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }
  fieldset {
    padding: 0.35em 0.75em 0.625em;
  }
  legend {
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
  }
  progress {
    vertical-align: baseline;
  }
  textarea {
    overflow: auto;
  }
  [type="checkbox"],
  [type="radio"] {
    box-sizing: border-box;
    padding: 0;
  }
  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }
  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }
  details {
    display: block;
  }
  summary {
    display: list-item;
  }
  template {
    display: none;
  }
  [hidden] {
    display: none;
  }

  /* END NORMALIZE */

  body {
    background: #fff;
    word-wrap: normal;
    word-break: normal;
    -webkit-font-smoothing: antialiased !important;
    text-rendering: optimizelegibility!important;

  }

  fieldset {
    padding: 0px;
    border: none;
    margin: 0px;
  }

  legend {
    position: absolute;
    overflow: hidden;
    left: -100000px;
  }

  /* If the user is using a keyboard then override the no outline functionality on buttons */
  .using-keyboard button {
    :focus {
      outline: -webkit-focus-ring-color auto 5px !important;
    }
  }

  /* Default select style values */
  .using-keyboard select {
    :focus {
      outline: -webkit-focus-ring-color auto 5px !important;
    }
  }
  
  select::-ms-expand {
      display: none !important;
  }

  /* Cannot drag and drop images */
  img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }

  /* Ant Design Movile */
  .ant-dropdown-menu {
    border-radius: 6px;
  }
  .ant-drawer-mask {
    backdrop-filter: blur(5px) !important;
  }
  .ant-modal-wrap {
    backdrop-filter: blur(5px) !important;
  }

  @media (max-width: 900px) {
    .ant-drawer-content-wrapper {
      width: 100% !important;
    }
  }

  /* Custom font styling */
  h1, h2, h3, h4 {
    font-family: Gilroy, -apple-system, system-ui, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    font-weight: 800 !important;
  }
  .ant-result-title {
    font-family: Gilroy, -apple-system, system-ui, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    font-weight: 800 !important;
  }
`;



export default GlobalStyle; 