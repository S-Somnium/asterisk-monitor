let pagina = window.location.hostname
//let pagina = "imperiotecnologiajp.sytes.net"
var socket =  new WebSocket("ws://"+pagina+":8080/ws");
let funcoes = []
let master = []
let pjsip = []
let queue = []
let key =""
let connect = isOpen => {

  socket.onopen = () => {
    isOpen("#74A4BC",true)
  };

  socket.onmessage = msg => {    
    let data = msg.data.split(/\r?\n/)
    console.log('recebi:'+data)
    switch (data[data.length - 1]) {
      case "master":
        // Recebo a informação em forma de linhas e array, e logo em seguida cada linha do array vira um json
        // OngoingResultado final:
        // {callerid: "8331423222", destino: "3", contexto: "from-external", duracao: "149", resposta: "NO ANSWER", …}

        var HistoricoResult = new Array(data.length - 2)
        for (let index = 0, set = HistoricoResult.length - 1; index < HistoricoResult.length; index++, set--) {
          let conseguiu = false
          let temp = {}
          try {
            temp = JSON.parse(data[index].replace('\t', ''));
            conseguiu = true
         }
         catch (e) {
            console.log(e); 
         }
         if(conseguiu)HistoricoResult[set] = temp
        }
        master = HistoricoResult;
        if (funcoes["ongoing"] !== undefined) funcoes["ongoing"](master)
        if (funcoes["historico"] !== undefined) funcoes["historico"](master)
        break;

      case "pjsip":
      var pjsipOngoingResult = new Array(data.length - 11) // -6 pq as 6 ultimas linhas n importa e 4 das primeiras tbm n
      for (let index = 0; index < pjsipOngoingResult.length; index++){
          let temp = data[index+4].replace(/\s+/g, ' ').trim().split(' ')
          pjsipOngoingResult[index] = {user:temp[1].split('/')[0],linha:temp[1].split('/')[1],estado:temp[2][0]}
        }
        pjsip = pjsipOngoingResult
        if (funcoes["pjsip"] !== undefined) funcoes["pjsip"](pjsip)
        break;
      case "queue":
      let QueueResult = []
      let posicao=0
      let inicio=true
      let callers=false;
        data.forEach((element,index) => {
          let elemento = element.replace(/\s+/g, ' ').trim()
          if(data[index]!=="" && data[index]!=="queue"){
            if(inicio){
              QueueResult[posicao] = {queue:'',members:[],espera:[]}
              QueueResult[posicao].queue = elemento.split(' ')[0]
              inicio=false;
            }else{
              switch (elemento) {
                case "Members:":  break;
                case "No Callers": break;
                case "Callers:": callers=true; break;
              default:
                if(!callers){
                  let adicionar = elemento.replace("[1;31;40m","").replace("\u001b[0m)","").replace("(\u001b[1;32;40m","").split(' ')
                  QueueResult[posicao].members.push({membro:adicionar[0],estado:adicionar[5]})  
                }else{
                  QueueResult[posicao].espera.push(elemento)
                }
                  break;
              }
            }
          }else {
            posicao++
            callers=false
            inicio=true
          }
        });
        queue = QueueResult
        if (funcoes["queue"] !== undefined) funcoes["queue"](queue)
        if (funcoes["queueName"] !== undefined) funcoes["queueName"](queue)
       break;
       case "key":
          key = data[0]
          if(funcoes["login"]!==undefined)funcoes["login"]()
        break;
        case "getPjsip":
          if(funcoes["getPjsip"]!==undefined)funcoes["getPjsip"](data)
          break
        case "painel":
          alert(data[0])
        break;
      default:
        console.log('estranho:'+msg.data)
        console.log('estranho:'+msg)
        break;
    }
  };

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    isOpen("#0F255F",false)
    alert("Conexão fechada, atualize a pagina")

  };

  socket.onerror = error => {
    console.log("Socket Error: ", error);
    isOpen("#0F255F",false)
    alert("Erro na conexão com o servidor")
  };
};

let registrar = (quem, func) => {
  switch (quem) {
    case "ongoing":
      funcoes[quem] = func
      if (func != null) func(master)
      break;

    case "historico":
      funcoes[quem] = func
      if (func != null) func(master)
      break;

    case "pjsip":
      funcoes[quem] = func
      if (func != null) func(pjsip)
      break;

    case "queue":
      funcoes[quem] = func
      if (func != null) func(queue)
      break;

    case "queueName":
      funcoes[quem] = func
      if (func != null) func(queue)
      break;
    case "login":
      funcoes[quem] = func
      if(key!==""&&func!=null)func()
      break;
    case "getPjsip":
      funcoes[quem] = func
      break;
    case "setOff":
      funcoes[quem] = func
      break; 
    default:
      break;
  }
}

let sendMsg = (tratamento,informacao) => {
  socket.send(JSON.stringify({Tratamento:tratamento,Informacao:informacao}));
};

let getAudio = (file) =>{
  if(key!==""){
    window.open("http://"+pagina+":8080/files/?file="+file+".wav&key="+key,'_blank')
  }
}

let getKey = () =>{
  return key
}

export { registrar, sendMsg, connect, getAudio, getKey};