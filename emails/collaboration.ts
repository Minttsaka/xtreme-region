export const collaborationTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding: 20px 0;
        }
        .email-header img {
            border-radius: 50%;
            width: 100px;
            height: 100px;
            object-fit: cover;
        }
        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body h1 {
            color: #007bff;
        }
        .email-footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #777777;
        }
        .cta-button {
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-size: 16px;
            display: inline-block;
            margin-top: 20px;
        }
        .cta-button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="{{ senderImg }}" alt="Sender's Image">
        </div>
        <div class="email-body">
            <h1>Hello, {{ receiverName }}!</h1>
            <p>
                We hope this email finds you well. I am {{ senderName }}, and I am excited to invite you to collaborate on a new research project.
            </p>
            <p>
                Your expertise and insights would be incredibly valuable to this initiative. If you're interested, please click the button below to learn more about the project and how we can work together:
            </p>
            <p style="text-align: center;">
                <a href="{{ url }}" class="cta-button">Join the Research Collaboration</a>
            </p>
            <p>
                Should you have any questions, feel free to reach out to me directly at {{ senderEmail }}. I look forward to your positive response.
            </p>
            <p>Best regards,<br>{{ senderName }}</p>
        </div>
        <div class="email-footer">
            <p>Xtreme region Research Collaboration. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

`