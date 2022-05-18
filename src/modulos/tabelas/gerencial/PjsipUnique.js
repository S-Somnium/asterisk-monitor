import React from 'react';
import { getKey } from '../../../api/ws';

const PjsipUnique = (props) => {
    if(props.destino!==""){
        let voltar = true;

        for(let i=0;i<props.destino.length;i++){
            if(props.destino[i]===props.data.user[i] || props.destino[i]===props.data.linha[i]){
                voltar = false;
            }else{
                voltar = true;
                break;
            }
        }
 
        if(voltar)return<></>
    }
    let getEstado = () =>{
        switch (props.data.estado) {
            case "N":
                return "Disponivel"
            case "U":
                return "Off"
            case "R":
                return "Chamando"
            case "I":
                return "Em chamada"
            case "O":
                return "Em espera"
            default:
                return props.data.estado;
        }
    }
    let click = () =>{
        if(getKey()!==""){
            props.onClick()
        }
    }
    return (
        <tr onClick={() => click()}>
            <td>{props.data.user}</td>
            <td>{props.data.linha}</td>
            <td>{getEstado()}</td>
        </tr>
    );
};

export default PjsipUnique;