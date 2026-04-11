import { useState } from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Page = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fb;
`;

const Card = styled.div`
    background: white;
    padding: 40px;
    width: 380px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
    font-size: 26px;
    margin-bottom: 8px;
`;

const Subtitle = styled.p`
    color: #777;
    margin-bottom: 30px;
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

const FormGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const LoginLink = styled(Link)`
    color: #1e90ff;
    font-weight: 600;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const LoginText = styled.p`
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #777;
`;

function Register() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError("");

        if (!firstname || !lastname || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await registerUser({
                firstname,
                lastname,
                email,
                password,
                role: "STUDENT",
            });

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleRegister();
        }
    };

    return (
        <Page>
            <Card>
                <Title>Create Account</Title>
                <Subtitle>Join QuickClinic to book appointments</Subtitle>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <FormGroup>
                    <Input
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Input
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </FormGroup>

                <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <Button onClick={handleRegister} disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                </Button>

                <LoginText>
                    Already have an account? <LoginLink to="/">Sign In</LoginLink>
                </LoginText>
            </Card>
        </Page>
    );
}

export default Register;