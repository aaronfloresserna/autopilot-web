# Imágenes de Agentes AI

## Para agregar la imagen de Lupita:

1. Guarda la imagen de la recepcionista como: `lupita.jpg` o `lupita.png`
2. Colócala en esta carpeta: `/landing/public/images/agents/`

3. Luego actualiza el componente en `/landing/app/page.tsx`:

```tsx
<AIAgent
  name="Lupita"
  role="Recepcionista Virtual"
  image="/images/agents/lupita.jpg"  // ← Agrega esta línea
  gradient="from-pink-500 to-purple-600"
  features={[...]}
/>
```

## Alternativa: Usar URL externa

Si tienes la imagen en otro lugar:

```tsx
image="https://tu-url.com/lupita.jpg"
```

## Formatos recomendados:
- JPG/JPEG (mejor para fotos)
- PNG (si necesitas transparencia)
- WebP (más optimizado)

## Tamaño recomendado:
- 400x400px mínimo
- 1:1 aspect ratio (cuadrado)
