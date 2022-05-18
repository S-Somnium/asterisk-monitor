import {React,  useState, useEffect } from 'react';
import { sendMsg, registrar } from '../api/ws';

const Login = (props) => {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");

    let logado = () =>{
        props.setOn()
    }

    useEffect(() => {
        registrar("login",() => logado()) // onmount
        return () => {
            registrar("login",undefined) //ondismount
        }
    }, [])

    return (
        <div className="corpo">
            <div className="item">
            <div className="titulo">Login</div>
            <div className="conteudo login">
                <div className="container">
                    <div className="info">Usuario</div>
                    <input type="text" value={login}  onChange={event => setLogin(event.target.value)}/>
                    <div className="info">Senha</div>
                    <input type="password" value={senha} onKeyPress={e=>{
                        if(e.code==="Enter"){
                            sendMsg("login",[login,senha])
                            setSenha("")
                    }
                }} onChange={event => 
                        {
                            setSenha(event.target.value)
                        }}/>
                    <button onClick={() => {
                        sendMsg("login",[login,senha])
                        setSenha("")
                }}> Logar</button>
                </div>
            </div>
            <div className="rodape"></div>

            </div>
        </div>
    );
};

export default Login;