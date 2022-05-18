import './dist/App.css';
import Header from './modulos/header';
import Ongoing from './modulos/ongoing';
import Historico from './modulos/historico';
import Gerencial from './modulos/gerencial';
import Login from './modulos/Login';
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: "ongoing",
      isLoged: false
    }

  }

  setSelected = (value) => {
    this.setState({ selected: value })
  }

  setLoged = (value) => {
    this.setState({isLoged: value})
  }

  render() {
    let selecionado;
    switch (this.state.selected) {
      case "ongoing":
        selecionado = <Ongoing />
        break;
      case "historico":
        selecionado = <Historico />
      break;
      case "gerencial":
        selecionado = <Gerencial/>
        break;
      case "login":
        selecionado = <Login setOn={()=>{this.setSelected("gerencial");this.setLoged(true)}} />
        break;
      default:
        break;
    }
    return (
      <div className="App">
        <Header switch={(value) => this.setSelected(value)} isLoged={this.state.isLoged}/>
        { selecionado }
      </div>
    );
  }
}

export default App;