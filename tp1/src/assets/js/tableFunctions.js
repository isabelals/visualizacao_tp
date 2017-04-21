// NESTE ARQUIVO DEVEM FICAR TODAS AS FUNÇÕES PARA MANIPULAÇÃO DA TABELA

var datafile = "data/dados_tp1.csv";
var tabledata;
var tableheader;

// Parâmetros padrão das funcionalidades
//paginação
var page = 0;
var rowsPerPage = 20;
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

	sortTable(colSort, sortDesc, tabledata);
	tableMatch(keyword);
}

// ordena a tabela
// column: id da coluna que será ordenada
// desc: (bool) verdadeiro se for para ordenar em ordem crescente
function sortTable(column, desc, table){
	d3.selectAll("table").selectAll("tbody").selectAll("tr").sort(function(a, b){
		return (desc)?a[tableheader[column]] <= b[tableheader[column]]: b[tableheader[column]] <= a[tableheader[column]];
	});
	
	setPagination(0, rowsPerPage);
}

// Configura a paginação de acordo com a pagina e a quantidade de linhas na tabela
function setPagination(newPage, rows){
	page = newPage;
	rowsPerPage = rows;
	var start = newPage*rowsPerPage; // primeira linha a ser exibida
	var end = start + rowsPerPage -1; // o índice começa de zero
	d3.selectAll("table").selectAll("tbody").selectAll("tr")
		.classed("hidden", function(d, i){
			return !(start <= i && i <= end) // verdade se i está fora dos limites
		});
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
				if(d[tableheader[k]] === keyword){
					found = true;
				}
			}
			return !found;
		});
}
