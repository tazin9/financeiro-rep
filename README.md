# Financeiro Repartição • Buenos Aires 🇦🇷

Sistema moderno, minimalista e estético de gestão de despesas compartilhadas entre **Otávio**, **Isabella** e **Rafael**.

---

## 🚀 Como Iniciar o App

Na pasta do projeto, basta executar:

```bash
npm start
```

O aplicativo estará disponível imediatamente em:
* **No seu computador:** [http://localhost:3001](http://localhost:3001)
* **No celular dos moradores (conectados no mesmo Wi-Fi):** `http://<SEU_IP_LOCAL>:3001` *(ex: `http://192.168.1.50:3001`)*

---

## ✨ Funcionalidades Principais

1. **Aluguel (USD) Totalmente Separado das Contas:**
   * Cada morador adquire seus próprios dólares e entrega para o Otávio (que centraliza o pagamento com o proprietário).
   * O app gerencia as variações de contrato (ex: **800 USD** no início do ano e **900 USD** a partir da renovação).
   * Valores por quarto:
     * **Rafael:** US$ 259 (ou US$ 292 após renovação)
     * **Isabella:** US$ 259 (ou US$ 292 após renovação)
     * **Otávio:** US$ 282 (ou US$ 316 após renovação)
   * Controle de status: **Pendente / Pago**.

2. **Acertos de Contas (Serviços em Pesos ARS):**
   * **Rafael:** Valor exato a transferir para **Otávio** (Internet + Expensas) e para **Isa** (Luz + Gás + ABL + Aysa).
   * **Acerto Otávio & Isa (Compensação Líquida Direta):**
     * O app calcula a compensação cruzada e mostra uma única transferência líquida de quem deve a diferença, eliminando transferências desnecessárias.
     * Detalhamento 100% transparente do total de contas adiantadas por cada um.
   * **Cópia de CBU / Alias em 1 clique:** Botões diretos para copiar dados bancários para o app do banco (Mercado Pago, Galicia, Santander, Brubank, etc.).
   * Controle de status de pagamento por morador (**Pendente / Pago**).

3. **Simulador de Cotação Pessoal (Real, Peso e Dólar):**
   * Além da cotação de referência do mês, quem acessar pode digitar no topo a **cotação exata que pagou** no dólar ou no peso.
   * O app recalcula instantaneamente todos os valores em **AR$**, **R$** e **US$**.

4. **Diagnóstico de Contas & Inflação ("Por que pagamos mais ou menos?"):**
   * **Contas com Consumo (Luz, Gás, Água):**
     * Permite informar o consumo em **kWh** (Luz) e **m³** (Gás).
     * O app decompõe automaticamente o que foi **aumento de consumo da casa** e o que foi **aumento de tarifa/inflação da concessionária** ($/kWh e $/m³).
   * **Contas sem Consumo (Telecentro/Internet e ABL):**
     * Mostra que 100% da variação mês a mês decorre de reajuste tarifário / inflação.
   * **Expensas Detalhadas:**
     * Permite subdividir a fatura nas linhas reais do condomínio:
       * *Expensas A (Ordinarias)*
       * *Fundo de Reserva / Caja*
       * *Gastos Particulares*
       * *Intereses Punitorios*
       * *Redondeo / Ajustes*
     * Aponta automaticamente o principal motivo da oscilação do mês.

5. **Gerenciador de Dados Bancários (CBU / Alias):**
   * Tela para consultar e atualizar Alias, CBU/CVU, Banco e Titular de Otávio e Isabella.

6. **Adicionar Novos Meses (Upload de CSV):**
   * Basta arrastar o novo arquivo CSV exportado do Google Sheets para o app.
