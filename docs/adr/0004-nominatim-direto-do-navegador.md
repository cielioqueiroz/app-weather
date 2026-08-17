# Nominatim continua sendo chamado direto do navegador

Existindo um proxy serverless para a OpenWeather (ADR-0001), a pergunta óbvia é por que o
autocomplete e o geocoding reverso falam direto com o Nominatim a partir do navegador.
A resposta é que passá-los pelo proxy seria **pior**: a política de uso do Nominatim limita
a 1 requisição por segundo **por cliente**, e concentrar o autocomplete de todos os usuários
no punhado de IPs das funções serverless é exatamente o padrão que eles bloqueiam. Mantido
no navegador, a carga fica distribuída pelos IPs dos próprios usuários e o `Referer` já
identifica a aplicação, que é o que a política pede.

## Consequences

Não há chave a proteger no Nominatim, então nada vaza com essa escolha. Para reduzir o
volume, a busca só dispara a partir de 3 caracteres (com 2, os resultados eram ruído de
qualquer forma), mantido o debounce de 300ms.

**Gatilho para revisar**: se o volume crescer a ponto de justificar cache do lado do
servidor, a saída não é o proxy — é trocar o Nominatim por um serviço de geocoding com
plano próprio.
