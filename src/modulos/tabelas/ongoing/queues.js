import React, { useEffect,useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { registrar } from '../../../api/ws';

const Queues = () => {

  const [queue, setQueue] = useState([]);

  useEffect(() => {
      registrar("queue",value => setQueue(value)) // onmount
      return () => {
          registrar("queue",undefined) //ondismount
      }
  }, [])
  let nomes=[]
  let espera=[]
  let states={livres:[],chamada:[],desconectado:[]}

  states.livres = new Array(queue.length).fill(0);
  states.chamada = new Array(queue.length).fill(0);
  states.desconectado = new Array(queue.length).fill(0);


  queue.forEach((item,index)=>{
    nomes.push(item.queue)
    espera.push(item.espera.lenght)
    item.members.forEach(element =>{
      switch (element.estado) {
        case "Not":
          states.livres[index]+=1;
          break;

        case "(Unavailable":
          states.desconectado[index]+=1;          break;
      
        case "In":
          states.chamada[index]+=1;          break;

        default:
          states.chamada[index]+=1;          break;
      }
    })
  })
  // not in use
  // (Unavailable
  // In
    const data = {
        labels: nomes,
        datasets: [
          {
            label: '# Em espera',
            data: espera,
            backgroundColor: 'rgb(255, 99, 132)',
          },
          {
            label: '# Livres',
            data: states.livres,
            backgroundColor: ' rgb(75, 192, 192)',
          },
          {
            label: '# Em chamada',
            data: states.chamada,
            backgroundColor: 'rgb(54, 162, 235)',
          },
          {
            label: '# Desconectado',
            data: states.desconectado,
            backgroundColor: 'black',
          }
        ],
      };
      const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };

    return (
        <div>
            <div className="titulo">Queues</div>
            <div className="conteudo">
                <Bar data={data} options={options} />
            </div>
            <div className="rodape"></div>

        </div>
    );
};

export default Queues;