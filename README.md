# 🏠 Financeiro Rep • Buenos Aires 🇦🇷

Dashboard web moderno, estético e minimalista de gestão financeira compartilhada para os moradores **Otávio**, **Isabella** e **Rafael**.

---

## 🔗 Link da Aplicação Web
* **GitHub Pages:** [https://tazin9.github.io/financeiro-rep/](https://tazin9.github.io/financeiro-rep/)
* *(Ou acesse via Vercel caso conecte seu repositório ao [vercel.com](https://vercel.com))*

---

## 💡 Principais Funcionalidades

### 1. 💵 Aluguel em Dólares (USD) Separado das Contas
* **Dólar Físico / Transferência USD:** O aluguel não se mistura com as despesas correntes em pesos.
* **Variações de Contrato:** Identifica automaticamente os contratos de **US$ 800** e **US$ 900** (após a renovação), calculando os valores por quarto:
  * **Rafael:** `US$ 259,00` (ou `US$ 292,00` no contrato de 900 USD)
  * **Isabella:** `US$ 259,00` (ou `US$ 292,00` no contrato de 900 USD)
  * **Otávio:** `US$ 282,00` (ou `US$ 316,00` no contrato de 900 USD) — *Centraliza e paga o proprietário.*
* **Controle de Status:** Checkbox direto de **Pendente / Pago** por morador.

---

### 2. ⚡ Acerto de Contas (Serviços em Pesos ARS)
* **Rafael:**
  * Transfere para **Otávio**: cota de *Internet + Expensas*.
  * Transfere para **Isa**: cota de *Luz + Gás + ABL + Aysa*.
* **Compensação Líquida Direta (Otávio & Isa):**
  * O app cruza o que cada um adiantou e mostra **apenas uma transferência líquida** de quem deve a diferença para o outro.
  * Transparência total com detalhamento abaixo dos totais pagos por cada um.
* **Cópia de CBU / Alias em 1 Clique:** Botões para copiar instantaneamente os dados bancários para o app do banco (Mercado Pago, Santander, Galicia, Brubank, etc.).
* **Controle de Status:** Marcação individual de **Pendente / Pago**.

---

### 3. 💱 Simulador de Cotação Pessoal (Real, Peso e Dólar)
* Cada morador que acessar a página pode digitar a cotação exata que pagou no seu câmbio particular (*Dólar Blue* ou *Cotação Real/Peso*).
* O app recalcula instantaneamente toda a tela e exibe os valores em **AR$ (Pesos)**, **R$ (Reais)** ou **US$ (Dólares)**.

---

### 4. 📊 Diagnóstico de Contas & Inflação ("Por que subiu ou desceu?")
* **Luz, Gás e Água (Serviços com medição):**
  * Permite informar o consumo em **kWh** (Luz) e **m³** (Gás).
  * Decompõe automaticamente o que foi **aumento de consumo da casa** e o que foi **reajuste tarifário / inflação** ($/kWh e $/m³).
* **Internet (Telecentro) e ABL:**
  * Destaca que 100% da variação é inflação/tarifa pública.
* **Detalhamento das Expensas:**
  * Lançamento das linhas da fatura do condomínio (*Expensas A, Fundo de Reserva/Caja, Gastos Particulares, Intereses, Redondeo*).
  * Aponta automaticamente o item que mais influenciou no valor final.

---

### 5. 💳 Gestor de Dados Bancários
* Modal integrado para cadastrar e atualizar Banco, Titular, CBU/CVU e Alias de Otávio e Isabella.

---

### 6. 📁 Histórico Completo & Upload de Novos Meses
* Já vem com **todos os 11 meses de 2026 pré-carregados** (Janeiro a Novembro).
* Permite arrastar novos arquivos `.csv` gerados no Google Sheets a qualquer momento.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React 19, Vite 6, Tailwind CSS v4, Lucide React
* **Backend Opcional:** Node.js, Express, Multer, Cors
* **Persistência Híbrida:** Funciona 100% offline e estático via `localStorage` e também sincroniza com API local quando iniciada.

---

## 🚀 Como Executar Localmente

Se preferir rodar no computador:

```bash
# 1. Instalar dependências (caso não tenha instalado)
npm install
cd client && npm install && cd ..

# 2. Iniciar a aplicação
npm start
```

Acesse em:
* **Computador:** [http://localhost:3001](http://localhost:3001)
* **Celular no mesmo Wi-Fi:** `http://<SEU_IP_LOCAL>:3001`
