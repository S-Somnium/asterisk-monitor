import React from 'react';
import { getAudio } from '../../../api/ws';

const callrecordUnique = (props) => {
    
    const getCall = () =>{
        let respostaStatus="";
        switch (props.data.resposta) {
            case "ANSWERED":
                respostaStatus = "Atendido"
                break;
            case "NO ANSWER":
                respostaStatus = "Sem resposta"
                break;

            case "BUSY":
                respostaStatus = "Ocupado"
                break;
            default:
                break;

        }
        let minutos = Math.trunc(props.data.duracao/60)
        let segundos = props.data.duracao%60
        let tempo=[]
        if(minutos>=10)tempo[0]=minutos+':'
        else tempo[0]='0'+minutos+':'
        if(segundos>=10)tempo[1]=''+segundos
        else tempo[1]='0'+segundos

        let channel = props.data.channel.split('-')[0].split('/')[1]
        let onclick = () =>{
            getAudio(props.data.unique)
        }
        if(channel==="numerosonline")channel = props.data.callerid
        let resposta = <tr onClick={()=>onclick()}>        
        <td>{channel}</td>
        <td>{props.data.destino}</td>
        <td>{respostaStatus}</td>
        <td>{tempo[0]+tempo[1]}</td>
        <td>{props.data.hora}</td>
        </tr>;
        if(props.pesquisarData !=="" && props.pesquisarData !== props.data.hora.split(' ')[0]){
            resposta = <></>;
        }
        let voltar = false;
        let voltar2 = false;

        if(props.pesquisarDestino!==""){
            for(let i=0;i<props.pesquisarDestino.length;i++){
                if(props.pesquisarDestino[i]===props.data.destino[i]){
                    voltar = false;
                }else{
                    voltar = true;
                    break;
                }
            }
            for(let i=0;i<channel.length;i++){
                if(props.pesquisarDestino[i]===channel[i]){
                    voltar2 = false;
                }else{
                    voltar2 = true;
                    break;
                }
            }
        }

        if(voltar && voltar2) resposta = <></>;

        
//|| props.pesquisarDestino[i]===channelNumber[i]

        return resposta;
    } 

    return (
        <>
            {getCall()}
    </>
    );
};

export default callrecordUnique;