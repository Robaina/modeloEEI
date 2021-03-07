# Un modelo de Especies Exóticas Invasoras en Canarias

<img style="margin:0px auto;display:block" src="/imgs/presentacion.png" alt="Responsive image" width=450>
<p></p>

Un pequeño proyecto de innovación docente planteado para alumnado de Biología y Geología de 4º de ESO, que tiene como objetivo el uso de un modelo computacional para investigar algunos de los principales factores de invasividad de una especie exótica invasora en ecosistemas nativos. La justificación docente se puede encontrar en el pdf "justificación de la Innovación", además, se incluye una propuesta de guión de práctica para el alumnado en el pdf "Actividad Modelo EEI en Canarias". El modelo matemático es discreto y dinámico (de tipo agent-based model), y simula el proceso de invasión de la especie exótica invasora <i>Nicotiana glauca</i> en un ecosistema simplificado de Cardonal-Tabaibal. El modelo se compone de una matriz, o cuadrícula, que simula una parcela de terreno, y donde cada casilla puede tener uno de los cuatro estados (los agentes) siguientes: suelo, tabaiba, cardón o tabaco moro en cada instante de tiempo (discreto).

## Reglas de evolución

El modelo sigue una serie de reglas sencillas:
1. Cada casilla sólo puede albergar un tipo de planta en cada instante de tiempo.
2. Todas las plantas van perdiendo “vida” según pasa el tiempo, aunque con diferentes tasas según la especie (parámetro ajustable).
3. Todas las plantas ganan “energía” según pasa el tiempo, aunque con distinta eficiencia según la especie (parámetro ajustable).
4. Cuando una planta alcanza un umbral preestablecido (parámetro ajustable) de energía, se reproduce formando un número aleatorio pero acotado de semillas. El valor máximo se controla a través del parámetro <i>Producción Máxima de Semillas</i>.
5. Las semillas se establecen en otras casillas, siempre que no haya ninguna otra planta (casilla con estado de suelo). Las semillas se establecen a una distancia máxima de la planta parental controlada por el parámetro <i>Dispersión Máxima</i>. La distancia se mide como el número de casillas del camino más cercano que conecta ambos puntos.
6. Las semillas tienen una probabilidad determinada de éxito, es decir, de que la planta alcance la madurez necesaria para reproducirse. Esta probabilidad se controla a través del parámetro <i>Eficiencia Reproductiva</i>.

A medida que pasa el tiempo, las plantas de tabaiba, cardón y tabaco moro compiten por ocupar casillas con el estado suelo. La eficacia de esta competición dependerá de la combinación de parámetros que tenga cada especie, los cuales, de una forma simplificada, modelizan la capacidad invasora de la especie.

Para facilitar la interpretación de los datos, la aplicación web también cuenta con una gráfica que muestra la evolución temporal de las poblaciones de cada especie de planta en la cuadrícula (en forma de fracción sobre el total). Además, la aplicación dispone de cuatro controladores, en forma de “sliders”, para modificar cómodamente (pensado para ser usado en dispositivos táctiles) el valor de los cuatro parámetros que el alumnado puede controlar.
