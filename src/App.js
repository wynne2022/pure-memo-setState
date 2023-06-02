import './App.css';
import React, { useState, useRef, useEffect } from "react";

// https://github.com/gaearon/react-pure-render/blob/master/src/shallowEqual.js
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

const myMemo = (Component) => {
  const MemoComponent = (props) => {
    const previousProps = useRef(null);
    const previousResult = useRef(null);
    const ComponentRef = useRef(Component);

    useEffect(() => {
      ComponentRef.current = Component;
    }, [Component]);

    const propsAreEqual = shallowEqual(props, previousProps.current);
    if (previousResult.current && propsAreEqual) {
      console.log("props equal and return memorized result");
      return previousResult.current;
    }

    const result = <Component {...props} />;
    previousProps.current = props;
    previousResult.current = result;
    console.log("generate new reuslt");
    return result;
  }
  return MemoComponent;
}

class MyPureComponent extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
}

class Car extends MyPureComponent {
  componentDidUpdate() {
    console.log(this.props.carData.make, "updated");
  }

  render() {
    const { make, quantity } = this.props.carData;
    return (
      <div
        style={{
          border: "1px solid black",
          width: "100px",
          height: "100px",
          margin: "20px",
          display: "inline-block",
        }}
      >
        <p>{make}</p>
        <p>{quantity}</p>
      </div>
    );
  }
}


class SellButton extends React.Component {
  render() {
    const { index } = this.props;
    return <button onClick={() => this.props.handleSell(index)}>Sell</button>;
  }
}

class CarsApp extends React.Component {
  state = {
    cars: [
      {
        make: "Toyota",
        quantity: 10,
        id: 1,
        // date: new Date(),
      },
      {
        make: "Honda",
        quantity: 7,
        id: 2,
      },
      {
        make: "Nissan",
        quantity: 5,
        id: 3,
      },
    ],
    totalQuantity: 22,
  };

  handleSell = (index) => {
    console.log(index);

    this.setState((prev) => {

      const nextState = {
        ...prev,
        cars: [
          ...prev.cars.slice(0, index),
          { ...prev.cars[index], quantity: prev.cars[index].quantity - 1 },
          ...prev.cars.slice(index + 1),
        ],
      };
      console.log(nextState.cars === prev.cars); // false

      return nextState;
    });
  };

  render() {
    return (
      <>
        <div>
          {this.state.cars.map((car) => (
            <Car carData={car} key={car.id} />
          ))}
        </div>
        <div>
          {this.state.cars.map((car, index) => (
            <SellButton
              key={car.id}
              index={index}
              handleSell={this.handleSell}
            />
          ))}
        </div>
      </>
    );
  }
}

const Carfc = myMemo(({ carData }) => {
  console.log(carData.make, 'updated');
  const { make, quantity } = carData;
  return (
    <div
      style={{
        border: '1px solid black',
        width: '100px',
        height: '100px',
        margin: '20px',
        display: 'inline-block',
      }}
    >
      <p>{make}</p>
      <p>{quantity}</p>
    </div>
  );
});

const SellButtonfc = ({ index, handleSell }) => {
  return <button onClick={() => handleSell(index)}>Sell</button>;
};

const CarsAppfc = () => {
  const [cars, setCars] = useState([
    {
      make: 'Toyota',
      quantity: 10,
      id: 1,
    },
    {
      make: 'Honda',
      quantity: 7,
      id: 2,
    },
    {
      make: 'Nissan',
      quantity: 5,
      id: 3,
    },
  ]);

  const handleSell = (index) => {
    setCars((prevCars) => {
      const updatedCars = [...prevCars];
      updatedCars[index] = {
        ...updatedCars[index],
        quantity: updatedCars[index].quantity - 1,
      };
      return updatedCars;
    });
  };

  return (
    <>
      <div>
        {cars.map((car) => (
          <Carfc carData={car} key={car.id} />
        ))}
      </div>
      <div>
        {cars.map((car, index) => (
          <SellButtonfc key={car.id} index={index} handleSell={handleSell} />
        ))}
      </div>
    </>
  );
};

class Practice extends React.Component {
  state = {
    "id": "001",
    "type": "A",
    "value": "aaaaa",
    "data:": {},
    "path": ["001"],
    "children": [
      {
        "id": "003",
        "type": "A",
        "value": "aaaaa",
        "data:": {},
        "path": ["001", "003"],
        "children": [
          {
            "id": "002",
            "type": "A",
            "value": "aaaaa",
            "data:": {},
            "path": ["001", "003", "002"],
            "children": []
          },
        ]
      },
      {
        "id": "004",
        "type": "A",
        "value": "aaaaa",
        "data:": {},
        "path": ["001", "004"],
        "children": [
          {
            "id": "005",
            "type": "A",
            "value": "aaaaa",
            "data:": {},
            "path": ["001", "004", "005"],
            "children": []
          }, {
            "id": "005",
            "type": "A",
            "value": "aaaaa",
            "data:": {},
            "path": ["001", "004", "005"],
            "children": [
              {
                "id": "002",
                "type": "A",
                "value": "aaaaa",
                "data:": {},
                "path": ["001", "004", "005", "002"],
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }

  handleClick = () => {
    const newObj = JSON.parse(JSON.stringify(this.state));
    newObj.children[0].children[0].path[1] = "004";
    newObj.children[1].children[1].children[0].path[2] = "006";
    this.setState(newObj);
  }


  render() {
    return (<>
      <pre>{JSON.stringify(this.state, null, 2)}</pre>
      <button onClick={this.handleClick}>change</button>
    </>);
  }

}

function App() {

  return (
    <div>
      <CarsAppfc />
      <CarsApp />
      <Practice />
    </div>
  );
}



export default App;
