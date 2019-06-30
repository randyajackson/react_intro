import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//We use components to tell React what we want to see on the screen. 
//When our data changes, React will efficiently update and re-render our components.


//we want the Square component to “remember” that it got clicked, and fill it with an “X” mark. 
//To “remember” things, components use state.

//React components can have state by setting this.state in their constructors. 
//this.state should be considered as private to a React component that it’s defined in.

//In React, function components are a simpler way to write components that only contain a render method and don’t have their own state. 
//before we let board control state
    //class Square extends React.Component {
//after
    function Square(props){
    //In JavaScript classes, you need to always call super when defining the constructor of a subclass. 
    //All React component classes that have a constructor should start it with a super(props) call.
    
    /*constructor(props){
        super(props);
        this.state = {
            value: null,
        };
    }*/

    //render() {
      return (
        <button 
                className="square" 
                //By calling this.setState from an onClick handler in the Square’s render method
                //, we tell React to re-render that Square whenever its <button> is clicked.

                //When you call setState in a component, React automatically updates the child components inside of it too.
                //before letting board control state 
                    //onClick={() => { this.setState({value: 'X'}) }}
                //after
                    //onClick={() => { this.props.onClick()}}
                //after change to function component
                onClick={props.onClick}

                //When a Square is clicked, the onClick function provided by the Board is called.
                // The onClick prop on the built-in DOM <button> component tells React to set up a click event listener.
                // When the button is clicked, React will call the onClick event handler that is defined in Square’s render() method.
                //This event handler calls this.props.onClick(). The Square’s onClick prop was specified by the Board.
                //Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls this.handleClick(i) when clicked.
        >
        { /**this.props.value changing to function component*/}
        {props.value}
        </button>
      );
    //}
  }

  //To collect data from multiple children, or to have two child components communicate with each other, 
  //you need to declare the shared state in their parent component instead. The parent component can pass
  // the state back down to the children by using props; this keeps the child components in sync with each 
  //other and with the parent component.

  //Add a constructor to the Board and set the Board’s initial state to contain an array of 9 nulls corresponding to the 9 squares:
  class Board extends React.Component {
    //When we fill the board in later, the this.state.squares array will look something like this:
    /*
    [
    'O', null, 'X',
    'X', 'X', 'O',
    'O', null, null,
    ]
   */ 

    constructor(props){
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }
    //Since the Square components no longer maintain state, the Square components receive values from the 
    //Board component and inform the Board component when they’re clicked. 
    //In React terms, the Square components are now controlled components.
    handleClick(i) {
        //we call .slice() to create a copy of the squares array to modify instead of modifying the existing array.
        const squares = this.state.squares.slice();
        //squares[i] = 'X';
        //this.setState({squares: squares});
        
        //We can now change the Board’s handleClick function to return early by ignoring a click if someone has won the game or if a Square is already filled
        if (calculateWinner(squares) || squares[i]) {
            return;
          }


        //Each time a player moves, xIsNext (a boolean) will be flipped to determine which 
        //player goes next and the game’s state will be saved. We’ll update the Board’s handleClick function to flip the value of xIsNext
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }
    //There are generally two approaches to changing data. 
    //The first approach is to mutate the data by directly changing the data’s values. 
    //The second approach is to replace the data with a new copy which has the desired changes.

    //Immutability makes complex features much easier to implement. Later in this tutorial, 
    //we will implement a “time travel” feature that allows us to review the tic-tac-toe game’s history and “jump back” to previous moves. 
    //Avoiding direct data mutation lets us keep previous versions of the game’s history intact, and reuse them later.
    //Detecting changes in mutable objects is difficult because they are modified directly. 
    //Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.


    //We need to create a way for the Square to update the Board’s state. 
    //Since state is considered to be private to a component that defines it, we cannot update the Board’s state directly from Square.
    //Instead, we’ll pass down a function from the Board to the Square, and we’ll have Square call that function when a square is clicked. 
    //We’ll change the renderSquare method in Board to:
    renderSquare(i) {
      //before** return <Square value = {this.state.squares[i]}/>;
      return(
          <Square
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
            //Now we’re passing down two props from Board to Square: value and onClick. 
            //The onClick prop is a function that Square can call when clicked.
          />
      );
    }
  
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;

        if(winner) {
            status = 'Winner: ' + winner;
        }
        else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  