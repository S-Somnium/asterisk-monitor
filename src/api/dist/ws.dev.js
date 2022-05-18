"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKey = exports.getAudio = exports.connect = exports.sendMsg = exports.registrar = void 0;
//let pagina = window.location.hostname
var pagina = "imperiotecnologiajp.sytes.net";
var socket = new WebSocket("ws://" + pagina + ":8080/ws");
var funcoes = [];
var master = [];
var pjsip = [];
var queue = [];
var key = "";

var connect = function connect(isOpen) {
  socket.onopen = function () {
    isOpen("#74A4BC", true);
  };

  socket.onmessage = function (msg) {
    var data = msg.data.split(/\r?\n/);

    switch (data[data.length - 1]) {
      case "master":
        // Recebo a informação em forma de linhas e array, e logo em seguida cada linha do array vira um json
        // OngoingResultado final:
        // {callerid: "8331423222", destino: "3", contexto: "from-external", duracao: "149", resposta: "NO ANSWER", …}
        var HistoricoResult = new Array(data.length - 2);

        for (var index = 0, set = HistoricoResult.length - 1; index < HistoricoResult.length; index++, set--) {
          var conseguiu = false;
          var temp = {};

          try {
            temp = JSON.parse(data[index].replace('\t', ''));
            conseguiu = true;
          } catch (e) {
            console.log(e);
          }

          if (conseguiu) HistoricoResult[set] = temp;
        }

        master = HistoricoResult;
        if (funcoes["ongoing"] !== undefined) funcoes["ongoing"](master);
        if (funcoes["historico"] !== undefined) funcoes["historico"](master);
        break;

      case "pjsip":
        var pjsipOngoingResult = new Array(data.length - 11); // -6 pq as 6 ultimas linhas n importa e 4 das primeiras tbm n

        for (var _index = 0; _index < pjsipOngoingResult.length; _index++) {
          var _temp = data[_index + 4].replace(/\s+/g, ' ').trim().split(' ');

          pjsipOngoingResult[_index] = {
            user: _temp[1].split('/')[0],
            linha: _temp[1].split('/')[1],
            estado: _temp[2][0]
          };
        }

        pjsip = pjsipOngoingResult;
        if (funcoes["pjsip"] !== undefined) funcoes["pjsip"](pjsip);
        break;

      case "queue":
        var QueueResult = [];
        var posicao = 0;
        var inicio = true;
        var callers = false;
        data.forEach(function (element, index) {
          var elemento = element.replace(/\s+/g, ' ').trim();

          if (data[index] !== "" && data[index] !== "queue") {
            if (inicio) {
              QueueResult[posicao] = {
                queue: '',
                members: [],
                espera: []
              };
              QueueResult[posicao].queue = elemento.split(' ')[0];
              inicio = false;
            } else {
              switch (elemento) {
                case "Members:":
                  break;

                case "No Callers":
                  break;

                case "Callers:":
                  callers = true;
                  break;

                default:
                  if (!callers) {
                    var adicionar = elemento.replace("[1;31;40m", "").replace("\x1B[0m)", "").replace("(\x1B[1;32;40m", "").split(' ');
                    QueueResult[posicao].members.push({
                      membro: adicionar[0],
                      estado: adicionar[5]
                    });
                  } else {
                    QueueResult[posicao].espera.push(elemento);
                  }

                  break;
              }
            }
          } else {
            posicao++;
            callers = false;
            inicio = true;
          }
        });
        queue = QueueResult;
        if (funcoes["queue"] !== undefined) funcoes["queue"](queue);
        if (funcoes["queueName"] !== undefined) funcoes["queueName"](queue);
        break;

      case "key":
        key = data[0];
        if (funcoes["login"] !== undefined) funcoes["login"]();
        break;

      case "getPjsip":
        if (funcoes["getPjsip"] !== undefined) funcoes["getPjsip"](data);
        break;

      case "painel":
        alert(data[0]);
        break;

      default:
        console.log('estranho:' + msg.data);
        break;
    }
  };

  socket.onclose = function (event) {
    console.log("Socket Closed Connection: ", event);
    isOpen("#0F255F", false);
    alert("Conexão fechada, atualize a pagina");
  };

  socket.onerror = function (error) {
    console.log("Socket Error: ", error);
    isOpen("#0F255F", false);
    alert("Erro na conexão com o servidor");
  };
};

exports.connect = connect;

var registrar = function registrar(quem, func) {
  switch (quem) {
    case "ongoing":
      funcoes[quem] = func;
      if (func != null) func(master);
      break;

    case "historico":
      funcoes[quem] = func;
      if (func != null) func(master);
      break;

    case "pjsip":
      funcoes[quem] = func;
      if (func != null) func(pjsip);
      break;

    case "queue":
      funcoes[quem] = func;
      if (func != null) func(queue);
      break;

    case "queueName":
      funcoes[quem] = func;
      if (func != null) func(queue);
      break;

    case "login":
      funcoes[quem] = func;
      if (key !== "" && func != null) func();
      break;

    case "getPjsip":
      funcoes[quem] = func;
      break;

    case "setOff":
      funcoes[quem] = func;
      break;

    default:
      break;
  }
};

exports.registrar = registrar;

var sendMsg = function sendMsg(tratamento, informacao) {
  socket.send(JSON.stringify({
    Tratamento: tratamento,
    Informacao: informacao
  }));
};

exports.sendMsg = sendMsg;

var getAudio = function getAudio(file) {
  if (key !== "") {
    window.open("http://" + pagina + ":8080/files/?file=" + file + ".wav&key=" + key, '_blank');
  }
};

exports.getAudio = getAudio;

var getKey = function getKey() {
  return key;
};

exports.getKey = getKey;