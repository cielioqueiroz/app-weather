# Permanecer na OpenWeather 2.5

A API 2.5 está em fim de vida: chaves criadas depois de junho de 2024 não recebem mais
`/data/2.5/uvi`, e a OpenWeather sinalizou a aposentadoria do 2.5 sem dar data. A nossa
chave é anterior ao corte e continua atendida (verificado: `weather`, `forecast`, `uvi` e
`air_pollution` respondem 200 na produção). Decidimos **ficar no 2.5** e tratar isso como
dívida datada, não como migração pendente.

## Considered Options

Migrar para o One Call 3.0 traria os quatro endpoints numa chamada só, com dados melhores —
mas exige cartão cadastrado mesmo na faixa gratuita de 1.000 chamadas/dia. Num app de
portfólio que hoje não custa nada, o remédio é pior que a doença: além do custo potencial,
combinado com um proxy público (ADR-0001) transformaria abuso em fatura.

## Consequences

Um dia o 2.5 vai desligar e o app vai parar sem aviso. O que torna essa escolha sustentável
não é a escolha em si, é a ADR-0003: como as falhas passaram a ser visíveis na tela, a morte
do 2.5 aparece como indicadores marcados "indisponível" em vez de sumir em silêncio.

**Gatilho para migrar**: os indicadores começarem a exibir "indisponível" de forma
persistente, ou a OpenWeather anunciar data de desligamento.
