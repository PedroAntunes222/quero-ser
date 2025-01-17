import montaProduto from "../Tratamento/montaProduto.js";
import montaVenda from "../Tratamento/montaVenda.js";
import somaVendas from "./somaVendas.js";
import somaCanal from "./somaCanal.js";
import criaTransfere from "../criaArquivo/criaTransfere.js";
import criaPasta from "../criaArquivo/criaPasta.js";

export default function montaTabelas(cn) {
  const ArrayProdutos = montaProduto("./Entrada/" + cn + "_produtos.txt");
  const ArrayVendas = montaVenda("./Entrada/" + cn + "_vendas.txt");

  criaPasta(cn);

  somaCanal(ArrayVendas, cn);

  const produtosVendidos = somaVendas(ArrayProdutos, ArrayVendas, cn);

  for (const codigoProdutos in produtosVendidos) {
    // index do produto que tem o codigo igual a posicao do array de vendas
    const index = ArrayProdutos.findIndex(
      (produto) => produto.codigo == codigoProdutos
    );
    // 0, 1, 2, 3...
    if (index !== -1) {
      ArrayProdutos[index].vendas = produtosVendidos[codigoProdutos];
    }

    const quantidade = ArrayProdutos[index].quantidade;
    const quantidadeMinima = ArrayProdutos[index].quantidadeMinima;

    // calculo para estoque apos vendas
    const estoqueAtual = quantidade - ArrayProdutos[index].vendas;
    ArrayProdutos[index].estoque = estoqueAtual;

    // se estoque atual for menor que o minimo
    if (estoqueAtual < quantidadeMinima) {
      const necessario = quantidadeMinima - estoqueAtual;
      ArrayProdutos[index].necessidade = necessario;
      // se a necessidade estiver entre 1 e 10
      if (necessario > 1 && necessario < 10) {
        ArrayProdutos[index].transferencia = 10;
      } else {
        ArrayProdutos[index].transferencia = necessario;
      }
    }
  }

  criaTransfere(ArrayProdutos, cn);
}
