import * as React from "react";
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Section,
} from "@react-email/components";

export interface PasswordResetData {
    name: string;
    resetLink: string;
}

export const renderComponent = (data: PasswordResetData) => {
    return (
        <Html>
            <Head />
            <Preview>Reset your password</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Reset your password</Heading>
                    <Text style={text}>Hi {data.name},</Text>
                    <Text style={text}>
                        We received a request to reset the password for your account. If you
                        made this request, click the button below to finish resetting your
                        password.
                    </Text>
                    <Section style={btnContainer}>
                        <Button style={button} href={data.resetLink}>
                            Reset Password
                        </Button>
                    </Section>
                    <Text style={text}>
                        If you didn't request this, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export const subject = () => `Reset your password`;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px 20px",
    borderRadius: "8px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 20px",
};

const text = {
    color: "#555",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 20px",
};

const btnContainer = {
    textAlign: "center" as const,
    margin: "30px 0",
};

const button = {
    padding: "12px 20px",
    backgroundColor: "#007ee6",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
};
