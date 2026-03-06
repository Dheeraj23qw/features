import * as React from "react";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Hr,
} from "@react-email/components";

export interface NotificationData {
    title: string;
    message: string;
}

export const renderComponent = (data: NotificationData) => {
    return (
        <Html>
            <Head />
            <Preview>{data.title}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>{data.title}</Heading>
                    <Text style={text}>{data.message}</Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        This is an automated notification from our system.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export const subject = (data: NotificationData) => data.title;

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

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
};
