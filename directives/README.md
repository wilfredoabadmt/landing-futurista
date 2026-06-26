# AS Marketers - Landing Page Futurista

## Descripción

Landing page de alta conversión con estilo futurista/cyberpunk para AS Marketers, el negocio de Wilfredo Abad especializado en Ingeniería de Sistemas, Automatización con IA y Marketing Digital.

## Características

- **Diseño Futurista**: Estilo cyberpunk con gradientes multidimensionales (azul → púrpura → cian)
- **Animaciones CSS**: Efectos de partículas, glassmorphism, hover effects
- **Responsive**: Mobile-first, optimizado para todos los dispositivos
- **Performance**: Lighthouse 90+, optimizado para velocidad
- **SEO**: Meta tags, Open Graph, estructura semántica

## Estructura

```
landing-futurista/
├── index.html          # Página principal
├── css/
│   ├── styles.css      # Estilos principales
│   └── animations.css  # Animaciones CSS
├── js/
│   └── main.js         # JavaScript principal
├── assets/
│   └── images/         # Imágenes del proyecto
├── health.html         # Endpoint de healthcheck
├── Dockerfile          # Configuración Docker
├── nginx.conf          # Configuración Nginx
└── directives/
    └── README.md       # Este archivo
```

## Endpoints

### GET /health
Retorna el estado del servicio.

**Response:**
```json
{
    "status": "ok",
    "service": "as-marketers-landing",
    "timestamp": "2026-06-25T23:49:00+00:00"
}
```

## Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript vanilla
- Nginx
- Docker

## Despliegue

El proyecto está configurado para desplegarse en Coolify como un contenedor Docker estático con Nginx.

## SEO

- Title: AS Marketers | Ingeniería de Sistemas & Marketing Digital con IA
- Description: Ecosistemas digitales impulsados por Inteligencia Artificial. Automatización, desarrollo web y growth marketing para escalar tu negocio.
- Keywords: IA, automatización, marketing digital, desarrollo web, e-commerce, n8n, agents inteligentes

## Próximos Pasos

1. Integrar video Seedance 2.0 en el Hero
2. Optimizar carga del video
3. A/B testing de headlines
4. Analítica y conversiones
