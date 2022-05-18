import React, { useEffect,useState } from 'react';
import { registrar } from '../api/ws';
import { connect } from '../api/ws';

function Header(props) {

  const [queue, setQueues] = useState([]);
  const [estilo, setEstilo] = useState({backgroundColor:"#74A4BC"});
  const [isOn, setOn] = useState(true);

  const isConnected = (cor,isOn) =>{
    setEstilo({backgroundColor:cor})
    setOn(isOn)
  }
  connect(isConnected)

  useEffect(() => {
      registrar("queueName",value => setQueues(value)) // onmount
      return () => {
          registrar("queueName",undefined) //ondismount
      }
  }, [])

  let queueName = []
  queue.forEach(element => {
    queueName.push(element.queue)
  })
// numeros para retonar, volume de chamadas recebida, pessoas logadas.
// quem esta em espera na fila, 
/*
        <div className="dropdown-content">
            <a href="#" >Todas</a>
          {queueName.map(item =>{
            return <a href="#">{item}</a>
          })}
          </div>
*/
  let logado= <></>
  let on=<></>
  if(!isOn){
    on = <div className="opcoes" style={{color:"red"}}>Conexão perdida</div>
  }
  if(!props.isLoged){
    logado = <div className="opcoes" onClick={() => props.switch("login")}>Login</div>
  }
  return (
    <div className="header" style={estilo}>
      {on}
      <div className="opcoes" onClick={() => props.switch("ongoing")}>Monitorizar</div>
      <div className="opcoes" onClick={() => props.switch("historico")}>Historico</div>
      <div className="opcoes" onClick={() => props.switch("gerencial")}>Gerencial</div>
      {logado}
    </div>
  );
}

// props.switch("ongoing")
export default Header;