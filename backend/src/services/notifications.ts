interface NotificationPayload {
  filename: string;
  fileId: string;
  detectedThreats: string[];
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

export const sendInfectedFileAlert = async (payload: NotificationPayload) => {
  try {
    const webhookUrl = process.env.SECURITY_WEBHOOK_URL;
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    const alertMessage = {
      text: `🚨 **SECURITY ALERT: Malicious File Detected**`,
      attachments: [
        {
          color: payload.severity === 'high' ? '#ff0000' : '#ffa500',
          fields: [
            {
              title: 'File Name',
              value: payload.filename,
              short: true
            },
            {
              title: 'File ID',
              value: payload.fileId,
              short: true
            },
            {
              title: 'Detected Threats',
              value: payload.detectedThreats.join(', '),
              short: false
            },
            {
              title: 'Severity',
              value: payload.severity.toUpperCase(),
              short: true
            },
            {
              title: 'Timestamp',
              value: payload.timestamp,
              short: true
            }
          ],
          footer: 'CyberXplore Security Scanner'
        }
      ]
    };

    // Send to generic webhook if configured
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertMessage)
      });
      console.log('Security alert sent to webhook');
    }

    // Send to Slack if configured
    if (slackWebhookUrl) {
      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertMessage)
      });
      console.log('Security alert sent to Slack');
    }

    // Log to console if no webhooks configured
    if (!webhookUrl && !slackWebhookUrl) {
      console.log('🚨 SECURITY ALERT - No webhooks configured, logging to console only');
      console.log('Alert payload:', JSON.stringify(alertMessage, null, 2));
    }

  } catch (error) {
    console.error('Error sending security alert:', error);
  }
}; 