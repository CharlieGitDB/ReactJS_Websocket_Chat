var socket;
var usernameKeep;

var Start = React.createClass({
  getInitialState: function(){
    return {username: '', shouldHide: false};
  },
  componentDidMount: function(){
    ReactDOM.findDOMNode(this.refs.nickName).focus();
  },
  handleChange: function(e){
    this.setState({username: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.setState({shouldHide: true});
    usernameKeep = this.state.username;
  },
  render: function(){
    if(!this.state.shouldHide){
      return(
        <div className="usernameContainer centerBox">
          <form className="usernameForm form-inline" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" placeholder="Enter a username here.." className="form-control" ref="nickName" value={this.state.username} onChange={this.handleChange} />
            </div>
            <input type="submit" value="Start" className="btn-margin btn btn-primary"/>
          </form>
        </div>
      );
    }else{
      return <CommentBox />;
    }
  }
});

var CommentBox = React.createClass({
  getInitialState: function() {
    socket = io();
    return {data: []};
  },
  componentDidMount: function() {
    socket.on('send msg', this.getComments);
  },
  getComments: function(data){
    this.setState({data: data});
  },
  render: function() {
    return (
      <div className="commentBox centerBox">
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
  componentDidUpdate: function(){
    this.handleScroll();
  },
  handleScroll: function(){
    ReactDOM.findDOMNode(this.refs.commentList).scrollTop += ReactDOM.findDOMNode(this.refs.commentList).scrollHeight;
  },
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment username={comment.username} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList" ref="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function(){
    return {username: usernameKeep, text: ''};
  },
  componentDidMount: function(){
    ReactDOM.findDOMNode(this.refs.chat).focus();
  },
  handleTextChange: function(e){
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    var text = this.state.text.trim();
    if(!text || this.state.username == null){
      return;
    }
    socket.emit('send msg', this.state);
    this.setState({text: ''});
  },
  render: function() {
    return (
      <form className="commentForm form-inline" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Say something..." className="form-control" ref="chat" value={this.state.text} onChange={this.handleTextChange} />
          <input type="submit" value="Send" className="btn-margin btn btn-primary"/>
        </div>
      </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <span className="commentUsername">
          {this.props.username + ':  '}
        </span>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

ReactDOM.render(<Start />, document.getElementById('content'));

// <span dangerouslySetInnerHTML={this.rawMarkup()} />
