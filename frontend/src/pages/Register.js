import { useState } from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
height:100vh;
display:flex;
justify-content:center;
align-items:center;
`;

const Card = styled.div`
background:white;
padding:40px;
width:350px;
border-radius:10px;
box-shadow:0 5px 20px rgba(0,0,0,0.1);
`;

function Register(){

    const [firstname,setFirstname] = useState("");
    const [lastname,setLastname] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const register = async ()=>{

        await api.post("/auth/register",{
            firstname,
            lastname,
            email,
            password,
            role:"PATIENT"
        });

        navigate("/");
    };

    return(

        <Container>
            <Card>

                <h2>Create Account</h2>

                <Input placeholder="First Name" onChange={(e)=>setFirstname(e.target.value)} />
                <Input placeholder="Last Name" onChange={(e)=>setLastname(e.target.value)} />
                <Input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

                <Button onClick={register}>Register</Button>

            </Card>
        </Container>

    );

}

export default Register;