# WhatsApp Integration Specification — Callvu Agenda API

## 1. Overview
The WhatsApp service in `src/services/whatsapp` SHALL handle Meta Cloud API webhook verification, parsing incoming chat messages, and sending outbound WhatsApp messages.

## 2. Domain & Infrastructure Rules
- **Webhook Verification**: The GET `/webhooks/whatsapp` endpoint MUST verify `hub.mode === 'subscribe'` and compare `hub.verify_token` against the server's configured secret token, returning `hub.challenge` on match or `403 Forbidden` on mismatch.
- **Message Parsing**: Webhook POST events MUST extract sender phone number (`from`), message text (`text.body`), and Meta message ID (`id`), ignoring unsupported event types.
- **Outbound Messaging**: Outbound messages MUST be sent via Meta Graph API v19.0 endpoint `https://graph.facebook.com/v19.0/${phoneId}/messages`.

## 3. Scenarios

### Scenario: Meta Webhook Subscription Handshake
- **GIVEN** a GET request from Meta Cloud API containing `hub.mode=subscribe`, `hub.verify_token`, and `hub.challenge`
- **WHEN** `WhatsAppService.verifyWebhook` is executed
- **THEN** it MUST match the verify token and respond with `200 OK` containing `hub.challenge`.

### Scenario: Parsing Incoming Text Message
- **GIVEN** a valid Meta webhook payload containing a text message from "+5491112345678"
- **WHEN** `WhatsAppService.parseIncomingMessage` is invoked
- **THEN** it MUST extract `{ from: "5491112345678", text: "Quiero reservar un turno", messageId: "..." }`.

### Scenario: Sending Outbound WhatsApp Text Message
- **GIVEN** a target phone number and message body
- **WHEN** `WhatsAppService.sendTextMessage` is called
- **THEN** it MUST issue an HTTP POST request to Meta Graph API with Bearer Token authorization.
