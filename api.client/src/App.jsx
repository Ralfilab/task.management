import React from 'react';
import './App.css';
import ToDoListContainer from './ToDoListContainer';

function App() {

    return (
      <div className="container">
        <header className="header">
          <img src="\wizard_logo_dark_background_small.jpg"></img>                      
        </header>

        <main className="body">                
          <ToDoListContainer />                
        </main>

        <footer className="footer">
          <p className="footer-text">&commat; 2024 To-Do List. All rights reserved.</p>
        </footer>
      </div>
    );
}

export default App;