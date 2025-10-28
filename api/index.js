export default function handler(request, response) {
  response.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'odiadev-website',
    version: '1.0.0',
    endpoints: {
      'admin-dashboard': '/admin',
      'chat-widget': '/widget',
      'static-pages': '/',
      'api-health': '/api/health'
    }
  });
}