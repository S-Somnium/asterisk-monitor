import React from 'react';


const retornarQueue = () => {
    return (
        <div>
            <div className="titulo">chamadas não retornadas por queue</div>
                <div className="conteudo">
                <table>
                    <tr>
                        <th>Dia</th>
                        <th>Suporte</th>
                        <th>Financeiro</th>
                        <th>Gerencial</th>
                        <th>Comercial</th>
                    </tr>
                    <tr>
                        <td>07/06/2026</td>
                        <td>88553112100</td>
                        <td>88553112100</td>
                        <td>88553112100</td>
                        <td>88553110120</td>
                    </tr>
                    <tr>
                        <td>06/06/2026</td>
                        <td>88553112100</td>
                        <td>88553121100</td>
                        <td>88551231100</td>
                        <td>88553121100</td>
                    </tr>
                    <tr>
                        <td>05/06/2026</td>
                        <td>88553112100</td>
                        <td>88553112100</td>
                        <td>88553112100</td>
                        <td>88553112100</td>
                    </tr>
                    </table>
                </div>
        </div>
    );
};

export default retornarQueue;