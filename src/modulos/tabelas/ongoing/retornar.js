import React, { useEffect,useState } from 'react';
import { registrar } from '../../../api/ws';

const Retornar = () => {
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        registrar("ongoing",value => setHistorico(value)) // onmount
        return () => {
            registrar("ongoing",undefined) //ondismount
        }
    }, [])

    let values = {}
    /*  
    1:[numeros...] 
    2:[numeros...] 
    3:[numeros...] 
    4:[numeros...] 
     */
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    let anterior =""
    let diatual =[]
    for(let item of historico){
        if(item===undefined)continue; // pra caso tenha um espaço vazio random no fim.
        if (today === item.hora.split(' ')[0]) { // é hoje?
            diatual.push(item)
        }
    }
    diatual.reverse()
    for (let item of diatual) { 
            let numero = item.callerid
            if(numero[0]== "+")numero = numero.substring(1)
            if((numero[0]+numero[1])==="55")numero = numero.substring(2)
            if(numero[0]==="0")numero = numero.substring(1)
            if(numero[0]==="0")numero = numero.substring(1)
            if((numero[0]+numero[1])==="83")numero = numero.substring(2)

            if (item.contexto === "from-external" && parseInt(item.destino) < 99) {// so pra confirmar se o destino é alguma das queues e separar inbound d outbound
                if (item.resposta === "NO ANSWER" && numero !== anterior) { // recebeu chamada de fora mas não atendeu. 
                    anterior = numero;
                    if (values[item.destino] === undefined) {
                        values[item.destino] = { numeros: [], horas: [], vezes: [] }
                    }
                    let exist = false;
                    values[item.destino].numeros.forEach((value, index) => {
                        if (value === numero) {
                            exist = true;
                            values[item.destino].horas[index] = item.hora.split(' ')[1]
                            values[item.destino].vezes[index] += 1
                        }
                    })
                    if (!exist) {
                        values[item.destino].numeros.push(numero)
                        values[item.destino].horas.push(item.hora.split(' ')[1])
                        values[item.destino].vezes.push(1)
                    }

                } else if (item.resposta === "ANSWERED") { // aqui estamos vendo caso a pessoa tenha ligado uma segunda vez e tenha sido atendida.
                    let titulos = Object.keys(values);
                    titulos.forEach((index) => {
                        for (var i = 0; i < values[index].numeros.length; i++) {
                            if (values[index].numeros[i] === numero) {
                                values[index].numeros.splice(i, 1);
                                values[index].horas.splice(i, 1);
                                values[index].vezes.splice(i, 1);
                                break;
                            }
                        }
                    })
                }
            } else { // aqui no caso estamos vendo se ela retornou ou não.
                if (item.resposta === "ANSWERED") {
                    let titulos = Object.keys(values);
                    titulos.forEach((index) => {
                        for (var i = 0; i < values[index].numeros.length; i++) {
                            numero = item.destino
                            if(numero[0]== "+")numero = numero.substring(1)
                            if((numero[0]+numero[1])==="55")numero = numero.substring(2)
                            if(numero[0]==="0")numero = numero.substring(1)
                            if((numero[0]+numero[1])==="83")numero = numero.substring(2)
                            if (values[index].numeros[i] === numero) {
                                values[index].numeros.splice(i, 1);
                                values[index].horas.splice(i, 1);
                                values[index].vezes.splice(i, 1);
                                break;
                            }
                        }
                    })
                }
            }
    }
    const getNumeros = () => {
        let x = 0;
        let total;
        let rows = []
        let titulos = Object.keys(values);
        while (true) {
            let sair = titulos.length;
            titulos.forEach(index => {
                if (values[index].numeros[x] === undefined)
                    sair -= 1;
            });
            if (sair === 0) {
                break
            }

            rows.push(
                <tr>
                    {titulos.map((index) => {
                        if(values[index].numeros[x]!==undefined)
                        return <th>{values[index].numeros[x]} x {values[index].vezes[x]}<br />{values[index].horas[x]}</th>
                    })}
                </tr>)
            x++;
        }
        total = <>{rows.map((index) => {
            return index;
        })}</>


        return total;
    }

    return (
        <div>
            <div className="titulo">Retornar</div>
            <div className="conteudo">
                <table>
                    <tr>
                        <th>Suporte</th>
                        <th>Financeiro</th>
                        <th>Administrativo</th>
                        <th>Comercial</th>
                    </tr>
                    {getNumeros()}


                </table>
            </div>
            <div className="rodape"></div>

        </div>
    );
};

export default Retornar;