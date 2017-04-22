// NESTE ARQUIVO DEVEM FICAR TODAS AS FUNÇÕES PARA MANIPULAÇÃO DA TABELA

var datafile = "data/dados_tp1.csv";
var tabledata; // armazena os dados da tabela (vetor de objetos - criado pelo d3 - ex: tabledata[0].permalink = "blabla", ou tabledata[0][permalink] = "blabla" ;)
var tableheader; // armazena o cabeçalho da tabela (ex: tableheader[0] = "permalink")

// Parâmetros padrão das funcionalidades
//paginação
var page = 0; // Página atual
var rowsPerPage = 20; // Quantidade de linhas por página
// ordenação
var colSort = 0; // índice da coluna que deve ser ordenada
var sortDesc = false; // ordenar crescente
// busca
var keyword = "";

function initTable(){
	d3.csv(datafile, function(d){
		tableheader = Object.keys(d[0]);
		tabledata = d;

		d3.selectAll("table").selectAll("thead").append("tr").selectAll("th").data(tableheader).enter().append("th").text(function(c){return c;});

		putTable(tabledata, tableheader);
	});
}

function initControllers(){
	$(".button.prev").click(function(){
		setPagination(page-1, rowsPerPage);
	});
	$(".button.next").click(function(){
		setPagination(page+1, rowsPerPage);
	});
	$("input.search").keyup(function(){
		tableMatch($(this).val());
	})
}

// recebe a matriz que deve ser inserida na tabela
// cada linha é um objeto (por causa do d3)
function putTable(data, columns){
	d3.selectAll("table").selectAll("tbody").selectAll("tr").data(data).enter().append("tr")
	.selectAll('td')
	.data(function (row) {
	return columns.map(
		function (column) {
			return {column: column, value: row[column]};
		});
	})
	.enter()
	.append('td')
	.text(function (d) { return d.value; });

	sortTable(colSort, sortDesc);
	tableMatch(keyword);
}

// ordena a tabela
// column: id da coluna que será ordenada
// desc: (bool) verdadeiro se for para ordenar em ordem crescente
function sortTable(column, desc){
	d3.selectAll("table").selectAll("tbody").selectAll("tr").sort(function(a, b){
		return (desc)?a[tableheader[column]] <= b[tableheader[column]]: b[tableheader[column]] <= a[tableheader[column]];
	});

	setPagination(0, rowsPerPage);
}

// Configura a paginação de acordo com a pagina e a quantidade de linhas na tabela
function setPagination(newPage, rows){
	// limite inferior da paginação
	if(newPage < 0) newPage = 0;
	if(rows < 1) rows = rows;

	// limite superior da paginação
	var maxRows = d3.selectAll("table").selectAll("tbody").selectAll("tr:not(.unmach)").size(); // quantos elementos são visualizaveis
	var maxPages;
	if(newPage*rows  >= maxRows){ // se a primeira linha a ser exibida for maior do que a quantidade de linhas visualizaveis
		maxPages = parseInt(maxRows/rows); // parte inteira da divisão
		if(maxRows % rows > 0){ // se sobrarem linhas, adiciona uma página
			maxPages++;
		}
		newPage = maxPages -1; // fixa a paginação na última página
	}

	// atualiza as variáveis globais
	page = newPage;
	rowsPerPage = rows;

	// range
	var start = page*rowsPerPage; // primeira linha a ser exibida
	var end = start + rowsPerPage -1; // o índice começa de zero

	d3.selectAll("table").selectAll("tbody").selectAll("tr:not(.unmach)")
		.classed("hidden", function(d, i){
			return !(start <= i && i <= end) // verdade se i está fora dos limites
		}); // esconde as linhas que estiverem fora do range

	d3.selectAll(".page-label").text(page);
}

function tableMatch(kw){
	keyword = kw;
	d3.selectAll("table").selectAll("tbody").selectAll("tr")
		.classed("unmach", function(d, i){
			if(!keyword){
				return false;
			}
			found = false;

			for(var k in tableheader){
				if(typeof(d[tableheader[k]])==="string"){
					found = found || d[tableheader[k]].toLowerCase().search(keyword.toLowerCase()) >=0; // verifica se contém a string
				}else {
					found = found || (d[tableheader[k]] == keyword);
				}
			}
			return !found;
		});
	setPagination(0, rowsPerPage); // volta a paginação para 0
}
