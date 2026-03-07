import styled from "styled-components";

const Container = styled.div`
padding:40px;
`;

function Dashboard(){

    return(

        <Container>
            <h1>Welcome to QuickClinic</h1>
            <p>You are logged in.</p>
        </Container>

    );

}

export default Dashboard;