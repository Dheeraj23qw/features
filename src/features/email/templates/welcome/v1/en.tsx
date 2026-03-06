import * as React from "react";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Section,
} from "@react-email/components";

export interface WelcomeData {
    name: string;
}

export const renderComponent = (data: WelcomeData) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to our platform, {data.name}!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Welcome, {data.name}!</Heading>
                    <Text style={text}>
                        We're excited to have you on board. Our platform makes it easy to
                        manage your application effortlessly.
                    </Text>
                    <Text style={text}>
                        If you have any questions, feel free to reply to this email. We're
                        always here to help.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export const subject = (data: WelcomeData) => `Welcome to our platform, ${data.name}!`;

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
