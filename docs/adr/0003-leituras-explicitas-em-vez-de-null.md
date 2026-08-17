# Leituras explícitas em vez de `null`

Todo dado complementar do WeatherBundle era buscado com `catch { return null }`: se o índice
UV, a qualidade do ar ou a previsão falhassem, a tela montava normalmente sem aqueles
números e o estado continuava `ready`. Para o usuário isso era indistinguível de "esse dado
não existe para esta cidade"; para nós, significava que uma quebra de integração podia durar
meses sem ninguém notar. Introduzimos o tipo `Reading<T>` com três estados — `ok`, `absent`
(a fonte não tem o dado) e `unavailable` (não conseguimos perguntar) — e a grade de
indicadores passa a exibir o motivo.

## Consequences

`Reading` foi aplicado só onde a diferença é perceptível: `uvIndex`, `airQuality` e `hourly`.
`location` continua `LocationInfo | null` de propósito — ela apenas embeleza o nome do lugar,
e falha e ausência levam ao mesmo resultado, então distinguir as duas seria cerimônia sem
ganho. Não repita o padrão por simetria; aplique onde o usuário consegue perceber a
diferença.

Esta decisão é o que sustenta a ADR-0002: sem ela, "ficar no 2.5 até quebrar" seria uma
aposta cega, porque a quebra seria invisível.
