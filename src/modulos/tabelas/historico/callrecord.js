import React, { useState }  from 'react';
import CallrecordUnique from './callrecordUnique';


const Callrecord = (props) => {
    const [data, setData] = useState("");
    const [destino, setDestino] = useState("");

    const atualizar = (valor,destino) =>{
        destino(valor)
    }

    return (
        <div>
            <div className="titulo">Registro de chamadas</div>
                <div className="conteudo">
                <table>
                    <tr>
                        <th>Origem</th>
                        <th>Destino</th>
                        <th>Resposta</th>
                        <th  style={{width:'75px'}} >Duracao</th>
                        <th>Hora</th>
                    </tr>
                        {props.data.map((item,index)=>(
                                <CallrecordUnique key={index+"callRecord"} data={item} pesquisarData={data} pesquisarDestino={destino}/>
                        ))}
                    </table>
                </div>
                <div className="rodape"> 
                <input type="date" value={data} onChange={(event)=>atualizar(event.target.value,setData)} />
                 <input type="text" placeholder="Destino.." value={destino}  onChange={(event)=>atualizar(event.target.value,setDestino)} />

                 </div>
        </div>
    );
};

export default Callrecord;