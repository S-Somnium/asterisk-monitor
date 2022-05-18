import React, { useState,useEffect }  from 'react';
import { registrar,sendMsg } from '../../../api/ws';
import PjsipUnique from './PjsipUnique';
import { getKey } from '../../../api/ws';

const Pjsip = () => {
    const [destino, setDestino] = useState("");
    const [data, setData] = useState([]);
    const [modvar, setModvar] = useState(["","",""]);
    const [modal, setModal] = useState(0); 
    const [senha, setSenha] = useState("");
    const [linha, setLinha] = useState("");
    const [usuario, setUsuario] = useState("");
    const [context, setContext] = useState("from-internal");
    const atualizar = (valor,destino) =>{
        destino(valor)
    }
    useEffect(() => {
        registrar("pjsip",value => setData(value)) // onmount
        registrar("getPjsip",value => {
            setSenha(value[0]);
            setContext(value[1]);
            setModvar([value[0],"",value[1]])
        })
        return () => {
            registrar("pjsip",undefined) //ondismount
            registrar("getPjsip",undefined)
        }
    }, [])

    let getModal = () =>{
        switch (modal) {
            case 1:
                if(modvar[1]==="")setModvar([modvar[0],linha,modvar[2]])

                return <div>
                <div className="black" onClick={()=>setModal(false)}></div>
                <div className="modal">
                  <div className="titulo" style={{position:"absolute",top:"0px",left:"0px"}}>Usuario</div>      
                  <span className="close" onClick={()=>setModal(false)}>&#10006;</span>
                <br/>
                <br/>
                  <div className="info">Usuario</div>
                  <input type="text" disabled value={usuario} onChange={event => setUsuario(event.target.value)}/>
                  <div className="info">Senha</div>
                  <input type="text" value={senha} onChange={event => setSenha(event.target.value)}/>
                  <div className="info">Linha</div>
                  <input type="text" value={linha} onChange={event => setLinha(event.target.value)} />
                  <div className="info">Tipos de chamada</div>
                  <select name="cars" id="cars" value={context} onChange={(e)=>{setContext(e.target.value)}}>
                    <option value="from-private">Privadas</option>
                    <option value="from-internal">Gravadas</option>
                 </select>
                <div className="rodape" style={{bottom:"0px",cursor:"pointer",left:"0px"}} onClick={() => {
                if(modvar[0]!==senha && senha.length>12 && senha.length<24) sendMsg("att_pass",[usuario,senha])
                if(modvar[1]!==linha && linha.length<12)sendMsg("att_linha",[usuario,linha])
                if(modvar[2]!==context)sendMsg("att_context",[usuario,context])
                }}>Atualizar</div>
                <div className="excluir" onClick={()=>{sendMsg("dell_pjsip",[usuario]);setModal(0) }}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>
                </div>
                </div>
                
            </div>

            case 2:
                return <div>
                <div className="black" onClick={()=>setModal(false)}></div>
                <div className="modal">
                  <div className="titulo" style={{position:"absolute",top:"0px",left:"0px"}}>Usuario</div>      
                  <span className="close" onClick={()=>setModal(false)}>&#10006;</span>
                <br/>
                <br/>
                  <div className="info">Usuario</div>
                  <input type="text" value={usuario} onChange={event => setUsuario(event.target.value)}/>
                  <div className="info">Senha</div>
                  <input type="text" value={senha} onChange={event => setSenha(event.target.value)}/>
                  <div className="info">Linha</div>
                  <input type="text" value={linha} onChange={event => setLinha(event.target.value)}/>
                  <div className="info">Tipos de chamada</div>
                  <select name="cars" id="cars" value={context} onChange={(e)=>{setContext(e.target.value)}}>
                  <option value="from-private">Privadas</option>
                    <option value="from-internal">Gravadas</option>
                 </select>
                <div className="rodape" style={{bottom:"0px",cursor:"pointer",left:"0px"}} onClick={() => {
                if(linha.length<12 && usuario.length<5 && senha.length>12 && senha.length<24)
                sendMsg("new_user",[usuario,senha,linha,context])
                }}>Criar</div>
                </div>
            </div>

            default:
                return <div></div>
        }
    }

    let novoUsuario = () =>{
        if(getKey()!==""){
            setModal(2)
            setSenha("")
            setLinha("")
            setUsuario("")
        }
    }
    let getNewUser = () =>{
        if(getKey()!==""){
            return <button onClick={() => novoUsuario()}>Novo usuario</button>
        }
    }
    return (
        <div className="item">
            <div className="titulo">Usuarios</div>
            <div className="conteudo">
                <table>
                    <tr>
                        <th>Usuario</th>
                        <th>Linha</th>
                        <th>Estado</th>
                    </tr>
                        {data.map((data,index)=>{
                            return <PjsipUnique key={index+"pjsip"} data={data} destino={destino} onClick={()=>
                            {
                                setSenha("")
                                sendMsg("get_pjsip",[data.user])
                                setLinha(data.linha)
                                setUsuario(data.user)
                                setModal(1)                                
                            }}/>
                        })}
                    </table>
                </div>
            <div className="rodape">
                {getNewUser()}
                 <input className="pesquisar" type="text" placeholder="Destino.." value={destino}  onChange={(event)=>atualizar(event.target.value,setDestino)} />
                 </div>
                {getModal()}
        </div>
    );
};

export default Pjsip;