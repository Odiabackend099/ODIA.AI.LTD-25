export default function handler(request, response) {
  response.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'odiadev-chat-widget',
    version: '1.0.0'
  });
}