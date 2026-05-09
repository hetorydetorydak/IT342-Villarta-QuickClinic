import styled from "styled-components";

const Button = styled.button`
  width:100%;
  padding:12px;
  border:none;
  border-radius:6px;
  background:#1e90ff;
  color:white;
  font-size:16px;
  font-weight:600;
  cursor:pointer;
  transition: all 0.3s;

  &:hover:not(:disabled){
    background:#187bcd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
  }

  &:active:not(:disabled){
    transform: translateY(0);
  }

  &:disabled{
    background:#ccc;
    cursor:not-allowed;
    opacity:0.7;
  }

  margin-bottom: 12px;
`;

export default Button;