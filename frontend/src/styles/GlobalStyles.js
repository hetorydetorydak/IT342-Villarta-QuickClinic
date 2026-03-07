import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family: 'Segoe UI', sans-serif;
}

body{
  background:#f9f9f9;
  color:#333;
}

a{
  text-decoration:none;
}

`;

export default GlobalStyles;