import React, { useEffect,useState } from 'react';
import Inbound from './tabelas/historico/inbound';
import Outbound from './tabelas/historico/outbound';
import TempoChamada from './tabelas/historico/tempoChamada';
import Callrecord from './tabelas/historico/callrecord';
import { registrar } from '../api/ws.js';

/*
recebo o array aqui de forma simples
{callerid: "8331423222", destino: "3", contexto: "from-external", duracao: "149", resposta: "NO ANSWER", …}
*/
function Historico() {
    const [data, setData] = useState([]);

    useEffect(() => {
        registrar("historico",value => setData(value)) // onmount
        return () => {
            registrar("historico",undefined) //ondismount
        }
    }, [])

    let values ={}
    data.forEach((item)=>{
        if(item.resposta === "ANSWERED"){
            let channel = item.channel.split('-')[0]
            if(parseInt(item.destino)<9999999) return;

            if(item.contexto === "from-internal"){
                if(values[channel]===undefined)
                {
                    values[channel]={tempo:0,out:{quantidade:0},in:{quantidade:0}}
                } 
                if(parseInt(item.duracao)>5) {
                    values[channel]['tempo'] += parseInt(item.duracao) 
                    values[channel]['out']['quantidade'] += 1
                }
        
            }else if(item.contexto === "from-external"){
                if(values[channel]===undefined) {
                    values[channel]={tempo:0,out:{quantidade:0},in:{quantidade:0}}
                }
                if(parseInt(item.duracao)>5){
                    values[channel]['tempo'] += parseInt(item.duracao) 
                    values[channel]['in']['quantidade'] += 1
                } 
        
            }
            
        }
    })


    return (
        <div className="corpo">
            {/* <div className="item">
                <RetornarQueue data={data}/>
            </div> */}
            <div className="item">
                <Callrecord data={data}/>
            </div>
            {
                /*
                <div className="item">
                <Inbound data={values}/>
                </div>
                */
            }

            <div className="item">
                <Outbound data={values}/>
            </div>
            <div className="item">
                <TempoChamada data={values}/>
            </div>

        </div>
    );
}

export default Historico;