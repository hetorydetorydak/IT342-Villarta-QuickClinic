import { useState } from "react";
import styled from "styled-components";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { login } from "./authApi";
import { saveToken } from "../../shared/utils/token";
import { useNavigate, Link } from "react-router-dom";

const Page = styled.div`
height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#f5f7fb;
`;

const Card = styled.div`
background:white;
padding:40px;
width:380px;
border-radius:12px;
box-shadow:0 8px 30px rgba(0,0,0,0.08);
`;

const Title = styled.h1`
font-size:26px;
margin-bottom:8px;
`;

const Subtitle = styled.p`
color:#777;
margin-bottom:30px;
`;

const ErrorMessage = styled.div`
background: #ffe0e0;
color: #c00;
padding: 12px;
border-radius: 6px;
margin-bottom: 20px;
font-size: 14px;
border-left: 4px solid #c00;
`;

const ForgotPassword = styled.a`
display:block;
text-align:right;
font-size:14px;
margin-bottom:20px;
color:#777;
cursor:pointer;

&:hover{
color:#1e90ff;
}
`;

const Divider = styled.div`
display:flex;
align-items:center;
margin:25px 0;
font-size:14px;
color:#aaa;

&::before,
&::after{
content:"";
flex:1;
height:1px;
background:#eee;
}

&::before{
margin-right:10px;
}

&::after{
margin-left:10px;
}
`;

const GoogleButton = styled.button`
width:100%;
padding:12px;
border:1px solid #ddd;
border-radius:6px;
background:white;
cursor:pointer;
font-size:15px;

&:hover{
background:#f5f5f5;
}
`;

const RegisterText = styled.p`
text-align:center;
margin-top:20px;
font-size:14px;
`;

const RegisterLink = styled(Link)`
color:#1e90ff;
font-weight:600;
margin-left:5px;
`;

function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        setLoading(true);

        try{
            const res = await login({ email, password });
            saveToken(res.data.accessToken);
            navigate("/dashboard");
        }catch(err){
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return(

        <Page>

            <Card>

                <Title>Welcome Back</Title>
                <Subtitle>Sign in to your account to continue</Subtitle>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Input
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <ForgotPassword>Forgot password?</ForgotPassword>

                <Button onClick={handleLogin} disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </Button>

                <Divider>Or continue with</Divider>

                <GoogleButton>
                    Sign in with Google
                </GoogleButton>

                <RegisterText>
                    Don't have an account?
                    <RegisterLink to="/register">Register</RegisterLink>
                </RegisterText>

            </Card>

        </Page>

    );

}

export default Login;