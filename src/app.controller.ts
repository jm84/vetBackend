import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('auth/google-test')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getGoogleTestPage(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID ?? '';

    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Google Login Test</title>
  <style>
    body {
      font-family: Segoe UI, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f6f8fa;
      color: #1f2328;
    }
    .card {
      max-width: 700px;
      background: #fff;
      margin: 24px auto;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
    }
    .muted { color: #667085; }
    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 8px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
  <div class="card">
    <h1>Prueba Google Login</h1>
    <p class="muted">Esta pagina obtiene el idToken de Google y llama a <code>/auth/social/google</code>.</p>
    <div id="status" class="muted"></div>
    <div id="g_id_onload"
      data-client_id="${clientId}"
      data-callback="handleGoogleCredentialResponse"
      data-auto_prompt="false">
    </div>
    <div class="g_id_signin" data-type="standard"></div>

    <h3>idToken (Google)</h3>
    <pre id="tokenOutput">Aun no recibido</pre>

    <h3>Respuesta backend</h3>
    <pre id="backendOutput">Aun sin llamada</pre>
  </div>

  <script>
    const statusEl = document.getElementById('status');
    const tokenEl = document.getElementById('tokenOutput');
    const backendEl = document.getElementById('backendOutput');
    const clientId = ${JSON.stringify(clientId)};

    if (!clientId || clientId.includes('your-google-client-id')) {
      statusEl.textContent = 'Configura GOOGLE_CLIENT_ID real en .env y reinicia el backend.';
    } else {
      statusEl.textContent = 'Listo para iniciar sesion con Google.';
    }

    async function handleGoogleCredentialResponse(response) {
      try {
        const idToken = response && response.credential ? response.credential : '';
        tokenEl.textContent = idToken || 'No se recibio idToken';

        const apiResponse = await fetch('/auth/social/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        const data = await apiResponse.json().catch(() => ({}));
        backendEl.textContent = JSON.stringify(
          { status: apiResponse.status, ok: apiResponse.ok, data },
          null,
          2,
        );
      } catch (error) {
        backendEl.textContent = JSON.stringify({ error: String(error) }, null, 2);
      }
    }

    window.handleGoogleCredentialResponse = handleGoogleCredentialResponse;
  </script>
</body>
</html>`;
  }
}
