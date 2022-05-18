import React from 'react';
import Retornar from './tabelas/ongoing/retornar.js';
import Queues from './tabelas/ongoing/queues.js';

const Ongoing = () => {
    
    return (
    <div className="corpo">
        <div className="item">
            <Retornar />
        </div>
        <div className="item">
            <Queues />
        </div>
    </div>
    );
};

export default Ongoing;