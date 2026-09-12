# MASTER V36.8 · Ajuste de tamaño del balón

Problema visto en la captura:
- el balón principal queda demasiado cerca de los bordes del cuadro;
- la perspectiva fija no se adapta a la relación ancho/alto del cuadro;
- en pantallas distintas puede verse demasiado grande o recortado.

V36.8 cambia el cálculo de cámara:
- mide el cuadro derecho real;
- calcula la distancia de cámara según el FOV y el aspect ratio;
- deja el balón alrededor del 92–94% del lado limitante;
- mantiene el balón completo dentro del cuadro;
- las órbitas/líneas pueden llegar al borde para conservar el efecto futurista;
- la columna de texto queda separada y con z-index superior;
- no modifica resultados, equipos, APK, tablas ni reglamento.

Base comprobada:
MASTER V36.7.1 en main.
