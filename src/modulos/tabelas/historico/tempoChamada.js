import React from 'react';
import { Pie } from 'react-chartjs-2';

const tempoChamada = (props) => {
  let labels = Object.keys(props.data);
  let data = labels.map((index)=>{
    return props.data[index]['tempo']
  })
    const tempo ={
        labels: labels,
        datasets: [
          {
            label: '# efetuadas',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(70, 51, 145, 0.2)',
              'rgba(145, 51, 70, 0.2)',
              'rgba(244, 4, 160, 0.2)',
              'rgba(244, 4, 51, 0.2)',
              'rgba(174, 169, 86, 0.2)',
              'rgba(152, 160, 222, 0.2)',
              'rgba(64, 194, 149, 0.2)',

            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(70, 51, 145, 1)',
              'rgba(145, 51, 70, 1)',
              'rgba(244, 4, 160, 1)',
              'rgba(244, 4, 51, 1)',
              'rgba(174, 169, 86, 1)',
              'rgba(152, 160, 222, 1)',
              'rgba(64, 194, 149, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    return (
        <div>
            <div className="titulo">Tempo em chamada em minutos</div>
            <div className="conteudo"><Pie data={tempo} /></div>
            <div className="rodape"></div>
            <br/>
                <br/>
        </div>
    );
};

export default tempoChamada;