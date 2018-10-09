import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.state = {
      items: []
    };
  }

  onAdd(item) {
    if (!item) {
      return 'Type an item and hit Enter';
    } else if (this.state.items.indexOf(item) > -1) {
      return 'This item is already on the list';
    }

    this.setState((prevState) => ({
      items: prevState.items.concat(item)
    }));
  }
  onRemove(itemToRemove) {
    this.setState((prevState) => ({
      items: prevState.items.filter((item) => itemToRemove !== item)
    }));
  }

  render() {
    const subtitle = 'Add to List';

    return (
      <div>
        <Header subtitle={subtitle} />
        <AddItem onAdd={this.onAdd} />
        <Items
          items={this.state.items}
          onRemove={this.onRemove}
        />

      </div>
    );
  }

  //Storaging and retrieving list from LocalStorage: 
  componentDidMount() {
    try {
      const json = localStorage.getItem('items');
      const items = JSON.parse(json);

      if (items) {
        this.setState(() => ({ items }));
      }
    } catch (e) {
     
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.items.length !== this.state.items.length) {
      const json = JSON.stringify(this.state.items);
      localStorage.setItem('items', json);
    }
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }


}

const Header = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
      {props.subtitle && <h2>{props.subtitle}</h2>}
    </div>
  );
};

Header.defaultProps = {
  title: 'List Maker'
};


const Items = (props) => {
  return (
    <div>
      {props.items.length === 0 && <p>Please add an item to get started!</p>}
      {
        props.items.map((item) => (
          <Item
            key={item}
            optionText={item}
            onRemove={props.onRemove}
          />
        ))
      }
    </div>
  );
};

const Item = (props) => {
  return (
    <div>
      {props.optionText}
      <button
        onClick={(e) => {
          props.onRemove(props.optionText);
        }}
      >
        remove
      </button>
    </div>
  );
};

class AddItem extends React.Component {
  constructor(props) {
    super(props);
    this.onAdd = this.onAdd.bind(this);
    this.state = {
      error: undefined
    };
  }
  onAdd(e) {
    e.preventDefault();

    const listItem = e.target.elements.listItem.value.trim();
    const error = this.props.onAdd(listItem);

    this.setState(() => ({ error }));

    if (!error) {
      e.target.elements.listItem.value = '';
    }
  }
  render() {
    return (
      <div>
        {this.state.error && <p>{this.state.error}</p>}
        <form onSubmit={this.onAdd}>
          <input type="text" name="listItem" />
          <button>Add Item</button>
        </form>
      </div>
    );
  }
}

export default App;
