# Clima·Tempo

Aplicação de previsão do tempo cujo painel principal reage às condições reais da cidade
consultada. Este documento fixa a linguagem do projeto: os termos abaixo são os nomes
canônicos, e são exatamente os identificadores usados no código.

## Language

### O que se consulta

**City**:
O lugar cujo céu o usuário quer ver. Identificado por coordenadas, nunca por nome — o nome
é apenas como o usuário chega até ele.
_Avoid_: local, localidade, place

**CitySuggestion**:
Um candidato a City oferecido durante a digitação da busca. Vira uma City quando escolhido.
_Avoid_: resultado, autocomplete item

**LocationInfo**:
O nome apresentável de uma City — cidade, estado, país. Enfeite: sem ele a aplicação ainda
sabe de que lugar está falando.
_Avoid_: endereço, address

### O que se sabe sobre ela

**WeatherBundle**:
Tudo que a aplicação sabe sobre o céu de uma City num instante. É a unidade que a tela
inteira consome — não existe estado em que parte dela é de uma cidade e parte de outra.
_Avoid_: payload, dados do clima, weather data

**CurrentWeather**:
As condições de agora. É a única parte do WeatherBundle sem a qual não há o que mostrar:
se ela falha, não há tela; se qualquer outra falha, há tela incompleta.
_Avoid_: clima atual, now

**ForecastEntry**:
A previsão para um instante futuro específico, em passos de 3 horas.
_Avoid_: hora, hourly item

**DailySummary**:
O que um dia inteiro será, condensado a partir dos ForecastEntry daquele dia no fuso da
City. A condição do dia é a do meio-dia local, não a média.
_Avoid_: dia, previsão diária

**AirQuality**:
A qualidade do ar como faixa nomeada, não como número bruto. O índice existe, mas o que se
comunica é a faixa.
_Avoid_: AQI, poluição

### Como se lida com o que falta

**Reading**:
Uma leitura de indicador, em um de três estados: `ok` (há valor), `absent` (a fonte
respondeu e não tem esse dado para esta City) ou `unavailable` (não conseguimos perguntar).
A distinção existe porque um céu sem índice UV e um índice UV que não chegou parecem iguais
na tela, e não são a mesma coisa nem para o usuário nem para quem mantém o projeto.
_Avoid_: null, nullable, erro, Result

### Como se mostra

**SkyCondition**:
O clima traduzido para o tema visual do painel — gradiente mais camada de ambiente animada.
É uma leitura estética da condição, não uma classificação meteorológica: garoa e chuva são
o mesmo SkyCondition.
_Avoid_: weather type, condição, tema

**Stat**:
Um dos indicadores da grade — umidade, vento, chuva, UV, ar, visibilidade, pressão,
sensação. Cada um mostra uma Reading e, quando não há valor, o motivo.
_Avoid_: card, métrica, indicador
