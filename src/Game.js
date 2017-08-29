import React, { Component } from 'react';
import Loading from './Loading'

CanvasRenderingContext2D.prototype.fillVerticalArrayText = function(textArray, x, y, verticalSpacing) {
  for (var i = 0; i < textArray.length; i++) {
      this.fillText(textArray[i], x, y + i * verticalSpacing);
  }
}

class Game extends Component {
  constructor(props, request)
  {
    super(props);
    this.state = {game: null, inProgress: null, squareLength: null, rowCountsWidth: 200, sideLength: null, mouseDown: false};
  }

  extractCounts(answer, sideLength, selector)
  {
      var result = [];

      for(var i = 0; i < sideLength; i++)
      {
          var col = selector(answer, i);

          var counts = [];
          var j = 0;
          var current = 0;
          while(j < sideLength)
          {
              if(col[j] === 0)
              {
                  if(current !== 0)
                  {
                      counts.push(current);
                      current = 0;
                  }
              }
              else
              {
                  current = current + 1;
              }

              j++;
          }

          if(current !== 0)
          {
              counts.push(current);
              current = 0;
          }

          result.push(counts);
      }

      return result;
  }

  generateColCounts(game, sideLength)
  {
      return this.extractCounts(game, sideLength, function(ans, i) {
          return ans.filter(function(el, index) {
              return (index - i) % sideLength === 0;
          })
      });
  }

  generateRowCounts(game, sideLength)
  {
      return this.extractCounts(game, sideLength, function(ans, i) {
          return ans.slice(i * sideLength, (i+1) * sideLength);
      });
  }

  getSquareFromCoordinates(pageX, pageY)
  {
      var { rowCountsWidth, sideLength } = this.state;
      const squareLength = (this.canvas.width - rowCountsWidth) / sideLength;
      
      var x = pageX - this.canvas.offsetLeft - rowCountsWidth;
      var y = pageY - this.canvas.offsetTop - rowCountsWidth;

      if(x < 0 || y < 0)
      {
          return -1;
      }

      var col = Math.floor(x / squareLength);
      var row = Math.floor(y / squareLength);

      var index = (row * sideLength) + col;

      return index;
  }

  drawInitialBoard()
  {
      const {rowCountsWidth, sideLength, game} = this.state;
      const canvas = this.canvas;
      const ctx = canvas.getContext("2d");
      const squareLength = (canvas.width - rowCountsWidth) / sideLength;
      
      var rowCounts = this.generateRowCounts(game.answer, sideLength);
      var colCounts = this.generateColCounts(game.answer, sideLength);

      ctx.font = "24px System";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for(let i = 0; i < rowCounts.length; i++)
      {
          let text = '0';
          if(rowCounts[i].length !== 0)
          {
              text = rowCounts[i].join(' ');
          }

          ctx.fillText(text, 100, rowCountsWidth + (squareLength / 2) +  (i * squareLength));
      }

      for(let i = 0; i < colCounts.length; i++)
      {
          let text = [0];
          if(colCounts[i].length !== 0)
          {
              text = colCounts[i];
          }

          ctx.fillVerticalArrayText(text, rowCountsWidth + (squareLength / 2) +  (i * squareLength), 50, 40);
      }
      
      ctx.clearRect(rowCountsWidth, rowCountsWidth, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#5555FF";

      for(let i = 0; i < sideLength; i++)
      {
          for(let j = 0; j < sideLength; j++)
          {
              if(game[(i * sideLength) + j] === 1)
              {
                  ctx.fillRect(rowCountsWidth + 1 + (j * squareLength), rowCountsWidth + 1 + (i * squareLength),squareLength-2,squareLength-2);
              }

              ctx.rect(rowCountsWidth + j * squareLength, rowCountsWidth + i * squareLength,squareLength,squareLength);
              ctx.stroke();
          }
      }
  }

  drawSquare(index, fillMode)
  {
      const {sideLength, rowCountsWidth} = this.state;
      const squareLength = (this.canvas.width - rowCountsWidth) / sideLength;
      
      var row = Math.floor(index / sideLength);
      var col = index % sideLength;
      const ctx = this.canvas.getContext('2d');

      ctx.clearRect(rowCountsWidth + 1 + (col * squareLength), rowCountsWidth + 1 + (row * squareLength),squareLength-2,squareLength-2);

      if(fillMode === 1)
      {
          ctx.fillRect(rowCountsWidth + 1 + (col * squareLength), rowCountsWidth + 1 + (row * squareLength),squareLength-2,squareLength-2);
      }
      else if(fillMode === 2)
      {
          ctx.beginPath();
          ctx.moveTo(rowCountsWidth + 1 + (col * squareLength), rowCountsWidth + 1 + (row * squareLength));
          ctx.lineTo(rowCountsWidth + 1 + (col * squareLength) + (squareLength - 2), rowCountsWidth + 1 + (row * squareLength) + (squareLength - 2));

          ctx.moveTo(rowCountsWidth + 1 + (col * squareLength), rowCountsWidth + 1 + (row * squareLength) + squareLength);
          ctx.lineTo(rowCountsWidth + 1 + (col * squareLength) + (squareLength - 2), rowCountsWidth + 1 + (row * squareLength));
          ctx.stroke();
      }

      ctx.beginPath();
      ctx.rect(rowCountsWidth + col * squareLength, rowCountsWidth + row * squareLength,squareLength,squareLength);
      ctx.stroke();
  }

  hasWon(board)
  {
    const answer = this.state.game.answer;    
    
    for(let i = 0; i < answer.length; i++)
    {
        if((board[i] === 0 || board[i] === 2) && answer[i] === 1)
        {
            return false;
        }
        else if(board[i] === 1 && answer[i] === 0)
        {
            return false;
        }
    }

    return true;
  }

  drawWinningScreen() {
    const ctx = this.canvas.getContext("2d");
    
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#f8f8f6";                    
    ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    ctx.globalAlpha = 1.0;
    
    ctx.font = "40px System";
    ctx.fillStyle = "#FF0000";
    ctx.fillText('You win!', this.canvas.width / 2, this.canvas.height / 2);
  }

  handleMouseDown = (event) => {
    if(this.state.inProgress) {
        var index = this.getSquareFromCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);
        console.log('Mousedown, square ' + index + ', button ' + event.nativeEvent.which);

        var board = this.state.board.slice();
        var {mouseDown, fillMode } = this.state;
        var inProgress = true;
        
        if(index !== -1)
        {
            mouseDown = true;
            if(board[index] === 0)
            {
                if(event.nativeEvent.which === 3)
                {
                    fillMode = 2;
                }
                else
                {
                    fillMode = 1;
                }
            }
            else
            {
                if(event.nativeEvent.which === 3 && board[index] === 1)
                {
                    fillMode = 2;
                }
                else if(event.nativeEvent.which === 1 && board[index] === 2)
                {
                    fillMode = 1;
                }
                else
                {
                    fillMode = 0;
                }
            }

            board[index] = fillMode;
            this.drawSquare(index, fillMode);

            if(this.hasWon(board))
            {
                this.drawWinningScreen();
                mouseDown = false;
                inProgress = false;
            }

            this.setState({
                mouseDown: mouseDown,
                fillMode: fillMode,
                board: board,
                currentSquare: index,
                inProgress: inProgress
            })
        }
    }
  };

  handleMouseOut = (event) => {
      if(this.state.inProgress) {
        this.setState({mouseDown: false});        
      }
  };

  handleMouseUp = (event) => {
    if(this.state.inProgress) {
        this.setState({mouseDown: false});        
      }
  };
  
  handleContextMenu= (event) => {
    event.preventDefault();
  };

  handleMouseMove = (event) => {
    if(this.state.inProgress) {
        if(this.state.mouseDown) {
            var index = this.getSquareFromCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);
    
            if(index === -1)
            {
                this.setState({mouseDown: false});
            }
            else
            {
                if(index !== this.state.currentSquare)
                {
                    let board = this.state.board.slice();
    
                    board[index] = this.state.fillMode;
    
                    this.drawSquare(index, this.state.fillMode);
    
                    this.setState({currentSquare: index, board: board});
    
                    if(this.hasWon(board))
                    {
                        this.drawWinningScreen();
                        this.setState({mouseDown: false, inProgress: false});
                    }
                }
            }
        }
    }
};

  componentDidUpdate()
  {
    var canvas = this.canvas;

    if(canvas && this.state.initialRender) {      
      this.drawInitialBoard();
      this.setState({initialRender: false, inProgress: true});
    }
  }

  initialiseFromLoadedGame(game) {
    const sideLength = Math.sqrt(game.answer.length);    
    this.props.setTitle(game.name);
    this.setState({
      game: game, 
      sideLength: sideLength,
      board: new Array(game.answer.length).fill(0),
      initialRender: true
    });   
  }

  componentDidMount() {
    //required for load via route change
    if(!this.props.games.loading) {
      var targetId = parseInt(this.props.match.params.id, 10);
      var game = this.props.games.items.find(g => g.id === targetId);

      if(game) {
        this.initialiseFromLoadedGame(game);
      } else {
        this.props.setTitle('Not found');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.games.loading && !nextProps.games.loading) {
      var targetId = parseInt(this.props.match.params.id, 10);
      var game = nextProps.games.items.find(g => g.id === targetId);

      if(game) {
        this.initialiseFromLoadedGame(game);
      } else {
        this.props.setTitle('Not found');
      }
    }
  }

  render() {
    if(this.props.games.loading) {
      return (
        <div className="Game">
            <Loading/>
        </div>);
    }
    else {
      var game = this.state.game;
      if(game) {
        return (
          <div className="Game">
            <canvas ref={(canvas) => { this.canvas = canvas; }} 
              onMouseDown={this.handleMouseDown} 
              onMouseUp={this.handleMouseUp} 
              onMouseOut={this.handleMouseOut} 
              onMouseMove={this.handleMouseMove}
              onContextMenu={this.handleContextMenu}               
              width="500" 
              height="500" />
          </div>
        );
      }
      else {
        return (
          <div className="Game">
            <p>Game not found!</p>
          </div>
        );
      }
    }
  }
}

export default Game;
