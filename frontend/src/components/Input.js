import styled from "styled-components";

const Input = styled.input`
    width:100%;
    padding:12px;
    margin-bottom:15px;
    border:1px solid #ddd;
    border-radius:6px;
    font-size:14px;

    &:focus{
        outline:none;
        border-color:#1e90ff;
        box-shadow:0 0 0 2px rgba(30,144,255,0.1);
    }
`;

export default Input;