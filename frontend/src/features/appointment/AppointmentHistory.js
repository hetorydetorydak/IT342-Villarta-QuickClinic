import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import { getAppointmentHistory } from "./appointmentApi";

const Page = styled.div`
    min-height: 100vh;
    padding: 40px 20px;
    background: #f9f9f9;
`;

const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

const Header = styled.div`
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
`;

const Title = styled.h1`
    font-size: 28px;
    color: #333;
`;

const BackButton = styled(Button)`
    background: #f0f0f0 !important;
    color: #333 !important;

    &:hover {
        background: #e0e0e0 !important;
    }
`;

const SummaryRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
`;

const StatCard = styled.div`
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    text-align: center;
`;

const StatNumber = styled.div`
    font-size: 32px;
    font-weight: 700;
    color: #1e90ff;
    margin-bottom: 5px;
`;

const StatLabel = styled.div`
    font-size: 14px;
    color: #777;
    font-weight: 500;
`;

const TableContainer = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    thead {
        background: #f5f5f5;
        border-bottom: 2px solid #eee;
    }

    th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #333;
        font-size: 14px;
    }

    td {
        padding: 15px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #555;
    }

    tbody tr:hover {
        background: #f9f9f9;
    }
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;

    background-color: ${(props) => {
        switch (props.status) {
            case "APPROVED":
                return "#d4edda";
            case "REJECTED":
                return "#f8d7da";
            case "PENDING":
                return "#fff3cd";
            case "COMPLETED":
                return "#d1ecf1";
            default:
                return "#e2e3e5";
        }
    }};

    color: ${(props) => {
        switch (props.status) {
            case "APPROVED":
                return "#155724";
            case "REJECTED":
                return "#721c24";
            case "PENDING":
                return "#856404";
            case "COMPLETED":
                return "#0c5460";
            default:
                return "#383d41";
        }
    }};
`;

const ActionButton = styled.button`
    background: #1e90ff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: background 0.3s;
    margin-right: 8px;
    margin-bottom: 4px;

    &:hover {
        background: #1877e0;
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const ActionCell = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 60px 20px;

    p {
        color: #777;
        font-size: 16px;
        margin-bottom: 20px;
    }
`;

const LoadingState = styled.div`
    text-align: center;
    padding: 40px;
    color: #1e90ff;
`;

const ErrorState = styled.div`
    background: #ffe0e0;
    color: #c00;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border-left: 4px solid #c00;
`;

function AppointmentHistory() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await getAppointmentHistory();
            setAppointments(response.data || []);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load appointments. Please try again."
            );
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const stats = {
            total: appointments.length,
            upcoming: appointments.filter((a) => a.status === "APPROVED").length,
            completed: appointments.filter((a) => a.status === "COMPLETED").length,
            pending: appointments.filter((a) => a.status === "PENDING").length,
        };
        return stats;
    };

    const handleViewRecord = (id) => {
        alert(`View record for appointment ${id}`);
    };

    const handleDownloadAttachment = (id) => {
        alert(`Downloading attachment for appointment ${id}`);
    };

    const stats = calculateStats();

    return (
        <Page>
            <Container>
                <Header>
                    <Title>Appointment History</Title>
                    <BackButton onClick={() => navigate("/dashboard")}>← Back to Dashboard</BackButton>
                </Header>

                <SummaryRow>
                    <StatCard>
                        <StatNumber>{stats.total}</StatNumber>
                        <StatLabel>Total Appointments</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatNumber>{stats.upcoming}</StatNumber>
                        <StatLabel>Upcoming</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatNumber>{stats.completed}</StatNumber>
                        <StatLabel>Completed</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatNumber>{stats.pending}</StatNumber>
                        <StatLabel>Pending Review</StatLabel>
                    </StatCard>
                </SummaryRow>

                {error && (
                    <ErrorState>
                        <p>{error}</p>
                        <ActionButton onClick={fetchAppointments}>Retry</ActionButton>
                    </ErrorState>
                )}

                {loading && <LoadingState>Loading appointments...</LoadingState>}

                {!loading && !error && appointments.length === 0 && (
                    <EmptyState>
                        <p>📋 No appointments yet.</p>
                        <Button onClick={() => navigate("/book")}>Book Your First Appointment</Button>
                    </EmptyState>
                )}

                {!loading && !error && appointments.length > 0 && (
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Symptoms</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((apt) => (
                                    <tr key={apt.id}>
                                        <td>{new Date(apt.preferredDate).toLocaleDateString()}</td>
                                        <td>{apt.timeSlot}</td>
                                        <td>
                                            {apt.appointmentType
                                                .split("_")
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                .join(" ")}
                                        </td>
                                        <td>
                                            <StatusBadge status={apt.status}>{apt.status}</StatusBadge>
                                        </td>
                                        <td>
                                            {apt.symptoms.length > 50
                                                ? apt.symptoms.substring(0, 50) + "..."
                                                : apt.symptoms}
                                        </td>
                                        <td>
                                            <ActionCell>
                                                {apt.status === "COMPLETED" && (
                                                    <ActionButton onClick={() => handleViewRecord(apt.id)}>
                                                        View Record
                                                    </ActionButton>
                                                )}
                                                {apt.attachment && (
                                                    <ActionButton onClick={() => handleDownloadAttachment(apt.id)}>
                                                        📥 Download
                                                    </ActionButton>
                                                )}
                                            </ActionCell>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </Page>
    );
}

export default AppointmentHistory;
