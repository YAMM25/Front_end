import React, { useContext, useReducer, useEffect, useRef, useState} from 'react'

const HOST_API = "http://localhost:8080/api";

const initialState = {
  list:[]
};

const Form = () =>{
 
  const formRef = useRef(null);
 
  const onAdd = (event) =>{
    event.preventDefault();

    const request ={
      name: state.name,
      id: null,
      isComplete: false
    };

    fetch(HOST_API+"/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((todo)=>{
      dispatch({ type: "add-item", item: todo});
      setState({name: ""});
      formRef.current.reset();
    });
  }


  return <form ref={formRef}>
    <input type="text" name="name" onChange={(event)=>{
      setState({...state, name: event.target.value})
    }}  ></input>
    <button onClick={onAdd}>Agregar</button>
  </form>
}


const List = () =>{
  const { dispatch, state} = useContext(Store);

  useEffect(() =>{
    fetch(HOST_API+"/todos")
    .then(response => response.json())
    .then((list) => {
      dispatch({type: "update-list", list})
    })
  }, [state.list.lenght, dispatch]);

  return <div>
  <table>
    <thead>
      <tr>
        <td>ID</td>
        <td>Nombre</td>
        <td>¿Está completado?</td>
      </tr>
    </thead>
    <tbody>
      {state.list.map((todo) =>{
        return <tr key={todo.id}>
          <td>{todo.id}</td>
          <td>{todo.name}</td>
          <td>{todo.isComplete === true ? "SI" : "NO"}</td>
          <td><button onClick={() => onDelete(todo.id)}>Eliminar</button></td>
          <td><button onClick={() => onEdit(todo)}>Editar</button></td>
        </tr>
      })}
    </tbody>
  </table>
</div>
  };

  function reducer(state, action){
    switch(action.type) {
      case 'update-list':
        return {...state, list: action.list}
      case 'add-item':
        const newList = state.list;
        newList.push(action.item);
        return { ...state, list: newList} 
      default:
        return state;   
    }
  }

  const StoreProvider = ({children}) =>{

    const [state, dispatch] = useReducer(reducer, initialState);
  
    return <Store.Provider value={{ state, dispatch}}>
      {children}
    </Store.Provider>
  }

  function App(){
    return <StoreProvider> 
      <Form />
      <Form />
    </StoreProvider>
  }
  

export default App;