import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import Input from "../../shared/components/Input";
import { bookAppointment } from "./appointmentApi";

const Page = styled.div`
    min-height: 100vh;
    padding: 40px 20px;
    background: #f9f9f9;
`;

const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
`;

const Header = styled.div`
    margin-bottom: 40px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
`;

const Subtitle = styled.p`
    color: #777;
    font-size: 16px;
`;

const FormCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
    margin-top: 20px;

    &:first-child {
        margin-top: 0;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;

    span {
        color: #e74c3c;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
    background: white;
    cursor: pointer;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: #1e90ff;
        box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.1);
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: #1e90ff;
        box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.1);
    }
`;

const FileUploadBox = styled.div`
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: #fafafa;

    &:hover {
        border-color: #1e90ff;
        background: #f0f7ff;
    }

    input[type="file"] {
        display: none;
    }

    p {
        color: #777;
        font-size: 14px;
        margin-bottom: 5px;
    }

    .filename {
        color: #1e90ff;
        font-weight: 600;
        font-size: 13px;
        margin-top: 10px;
    }
`;

const InfoBox = styled.div`
    background: #fff9e6;
    border: 1px solid #ffe082;
    border-radius: 6px;
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 20px;

    p {
        color: #856404;
        font-size: 14px;
        margin: 0;
    }
`;

const SuccessCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: center;
`;

const SuccessIcon = styled.div`
    width: 60px;
    height: 60px;
    background: #27ae60;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: white;
    font-size: 30px;
`;

const SuccessTitle = styled.h2`
    font-size: 24px;
    color: #27ae60;
    margin-bottom: 10px;
`;

const SuccessMessage = styled.p`
    color: #777;
    font-size: 15px;
    margin-bottom: 30px;
    line-height: 1.6;
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

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;

    button {
        flex: 1;
    }
`;

function BookAppointment() {
    const [appointmentType, setAppointmentType] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [preferredDate, setPreferredDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ["application/pdf", "image/jpeg", "image/png"];
            const maxSize = 50 * 1024 * 1024; // 50MB

            if (!validTypes.includes(file.type)) {
                setError("File must be PDF, JPG, or PNG");
                setAttachment(null);
                return;
            }

            if (file.size > maxSize) {
                setError("File size must not exceed 50MB");
                setAttachment(null);
                return;
            }

            setAttachment(file);
            setError("");
        }
    };

    const validateForm = () => {
        if (!appointmentType) {
            setError("Please select appointment type");
            return false;
        }
        if (!symptoms.trim()) {
            setError("Please describe your symptoms");
            return false;
        }
        if (!preferredDate) {
            setError("Please select a date");
            return false;
        }
        if (!timeSlot) {
            setError("Please select a time slot");
            return false;
        }

        const selected = new Date(preferredDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
            setError("Date must not be in the past");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const appointmentData = {
                appointmentType,
                symptoms,
                preferredDate,
                timeSlot,
                attachment: attachment ? attachment.name : null,
            };

            await bookAppointment(appointmentData);
            setSuccess(true);
        } catch (err) {
            console.error("Appointment submission error:", err);
            setError(
                err.response?.data?.message || 
                err.message || 
                "Failed to book appointment. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReturnToDashboard = () => {
        navigate("/dashboard");
    };

    if (success) {
        return (
            <Page>
                <Container>
                    <SuccessCard>
                        <SuccessIcon>✓</SuccessIcon>
                        <SuccessTitle>Appointment Request Submitted!</SuccessTitle>
                        <SuccessMessage>
                            Your appointment request has been successfully submitted. Our triage nurse will review
                            your request and get back to you shortly with confirmation and further instructions.
                        </SuccessMessage>
                        <Button onClick={handleReturnToDashboard}>Return to Dashboard</Button>
                    </SuccessCard>
                </Container>
            </Page>
        );
    }

    return (
        <Page>
            <Container>
                <Header>
                    <Title>Book an Appointment</Title>
                    <Subtitle>Schedule your visit with our healthcare team</Subtitle>
                </Header>

                <FormCard as="form" onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <SectionTitle>Appointment Details</SectionTitle>

                    <FormGroup>
                        <Label htmlFor="type">
                            Appointment Type <span>*</span>
                        </Label>
                        <Select
                            id="type"
                            value={appointmentType}
                            onChange={(e) => setAppointmentType(e.target.value)}
                        >
                            <option value="">Select an option</option>
                            <option value="EMERGENCY">Emergency</option>
                            <option value="SAME_DAY">Same-Day</option>
                            <option value="SCHEDULED">Scheduled</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="symptoms">
                            Symptoms / Reason for Visit <span>*</span>
                        </Label>
                        <TextArea
                            id="symptoms"
                            placeholder="Please describe your symptoms in detail..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="date">
                            Preferred Date <span>*</span>
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="time">
                            Time Slot <span>*</span>
                        </Label>
                        <Select
                            id="time"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                        >
                            <option value="">Select a time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="09:30">9:30 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="11:30">11:30 AM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="13:30">1:30 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="14:30">2:30 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="15:30">3:30 PM</option>
                        </Select>
                    </FormGroup>

                    <SectionTitle>Additional Information</SectionTitle>

                    <FormGroup>
                        <Label htmlFor="file">Medical Documents (Optional)</Label>
                        <FileUploadBox onClick={() => document.getElementById("file").click()}>
                            <p>📎 Click to upload or drag and drop</p>
                            <p style={{ fontSize: "12px", color: "#aaa" }}>PDF, JPG or PNG • Max 50MB</p>
                            {attachment && <div className="filename">✓ {attachment.name}</div>}
                            <input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </FileUploadBox>
                    </FormGroup>

                    <InfoBox>
                        <p>
                            ℹ️ <strong>Note:</strong> Your appointment request will be reviewed by our triage nurse.
                            You'll receive confirmation within 24 hours.
                        </p>
                    </InfoBox>

                    <ButtonGroup>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Appointment Request"}
                        </Button>
                    </ButtonGroup>
                </FormCard>
            </Container>
        </Page>
    );
}

export default BookAppointment;
