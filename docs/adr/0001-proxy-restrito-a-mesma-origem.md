# Proxy restrito à mesma origem

O proxy serverless `api/ow.ts` existe para manter a chave da OpenWeather fora do navegador,
mas por ser público e sem restrição qualquer pessoa com a URL podia usá-lo como um proxy
OpenWeather gratuito custeado pela nossa chave — verificado na produção, com resposta 200
para os quatro endpoints sem `Referer`, sem `Origin` e sem token. Passamos a recusar com 403
toda requisição cujo `Referer` não aponte para o mesmo host da função, aceitando também
`Sec-Fetch-Site: same-origin` para os navegadores que suprimem o `Referer`.

## Considered Options

Rate limit por IP e Vercel Firewall foram descartados por desproporção. A conta da
OpenWeather não tem assinatura One Call 3.0 e portanto não tem cartão cadastrado
(confirmado: a chave responde 401 no `/data/3.0/onecall`), então o teto do plano gratuito
transforma abuso em `429`, não em fatura. O dano é de **disponibilidade**, não financeiro, e
não justifica introduzir estado externo (KV/Redis) nem plano pago num app de portfólio.

## Consequences

`Referer` é trivialmente forjável: isto é lombada contra uso oportunista, não autenticação —
não confie nisso como controle de segurança. Usuários com `Referer` removido por extensão de
privacidade dependem do `Sec-Fetch-Site` para não serem bloqueados.

**O portão só age em cache miss.** A chave do cache de borda é a URL, não os cabeçalhos:
uma requisição não autorizada para coordenadas que algum usuário legítimo acabou de
consultar recebe o 200 cacheado sem nunca chegar à função. Isso é aceitável de propósito —
uma resposta servida do cache não consome quota da OpenWeather, e quota é exatamente o que
o portão protege. Qualquer coordenada nova é miss, chega à função e toma 403 (verificado na
produção). Se um dia o objetivo do portão passar a ser confidencialidade dos dados em vez de
quota, esse raciocínio deixa de valer.

**Gatilho para revisar**: se a conta ganhar cartão ou assinatura paga, o dano deixa de ser
disponibilidade e vira fatura ilimitada — aí rate limit real passa a ser obrigatório.
