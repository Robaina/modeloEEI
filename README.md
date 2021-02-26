# Un modelo de Especies Exóticas Invasoras en Canarias
<!-- <img style="margin:0px auto;display:block" src="/imgs/Sketch.png" alt="Responsive image" width=450> -->
<p></p>
Un modelo dinámico sencillo sobre el proceso de invasión de la especie exótica invasora <i>Nicotiana glauca</i> en el Cardonal-Tabaibal.

## Reglas de evolución
1. Las plantas pierden "vida" a medida que pasa el tiempo, hasta que mueren, momento en el cual la cuadrícula puede ser colonizada por otra planta.
2. Las plantas obtienen energía del medio con diferente eficiencia, cuando la energía pasa un umbral se reproducen
3. Al reproducirse, se crea un número aleatorio (dentro de unos límites) de nuevas plantas de la misma especie en las casillas desocupadas con probabilidad de éxito dada. Si no hay casillas libres, las plantas no se pueden reproducir.

## Parámetros controladores
1. Capacidad reproductiva (número de semillas y/o éxito de semillas, capacidad de dispersión)
2. Efecto perjudicial sobre éxito de semillas de otras especies (toxicidad, afecta a probabilidad de éxito de otras especies)

# Notas
Empezar la simulación con una población estable de cardonal-tabaibal y luego añadir una o varias plantas invasoras de tabaco moro para ver como se ve afectado el ecosistema.
